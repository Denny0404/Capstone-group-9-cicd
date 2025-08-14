import crypto from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/** Build a DynamoDB update expression from input fields (tested via Jest) */
export function buildUpdate(fields) {
  const expr = [];
  const names = {};
  const values = {};
  if (Object.prototype.hasOwnProperty.call(fields, "title")) {
    expr.push("#t = :t"); names["#t"] = "title"; values[":t"] = String(fields.title);
  }
  if (Object.prototype.hasOwnProperty.call(fields, "completed")) {
    expr.push("#c = :c"); names["#c"] = "completed"; values[":c"] = !!fields.completed;
  }
  return {
    UpdateExpression: expr.length ? "SET " + expr.join(", ") : undefined,
    ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
    ExpressionAttributeValues: Object.keys(values).length ? values : undefined
  };
}

export async function listTodos() {
  const res = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
  return res.Items || [];
}

export async function createTodo(body) {
  const data = body ? JSON.parse(body) : {};
  const item = {
    id: crypto.randomUUID(),
    title: String(data.title ?? "Untitled"),
    completed: !!data.completed,
    createdAt: new Date().toISOString(),
  };
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  return item;
}

export async function getTodo(id) {
  const res = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
  if (!res.Item) {
    const e = new Error("Not found"); e.statusCode = 404; throw e;
  }
  return res.Item;
}

export async function updateTodo(id, body) {
  const data = body ? JSON.parse(body) : {};
  const parts = buildUpdate(data);
  if (!parts.UpdateExpression) {
    return getTodo(id); // nothing to update -> return existing
  }
  const res = await ddb.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    ...parts,
    ReturnValues: "ALL_NEW",
  }));
  return res.Attributes;
}

export async function deleteTodo(id) {
  await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
  return { id };
}

function ok(body, statusCode = 200) {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}
function err(e) {
  const status = e?.statusCode || 500;
  return { statusCode: status, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: e?.message || "Server error" }) };
}

export async function handler(event) {
  try {
    const rk = event?.requestContext?.routeKey; // e.g., "GET /todos", "PATCH /todos/{id}"
    if (rk === "GET /todos") {
      return ok(await listTodos());
    }
    if (rk === "POST /todos") {
      return ok(await createTodo(event.body), 201);
    }
    if (rk === "PATCH /todos/{id}") {
      const id = event?.pathParameters?.id;
      return ok(await updateTodo(id, event.body));
    }
    if (rk === "DELETE /todos/{id}") {
      const id = event?.pathParameters?.id;
      return ok(await deleteTodo(id));
    }
    return { statusCode: 404, body: JSON.stringify({ message: "Not found" }) };
  } catch (e) {
    console.error(e);
    return err(e);
  }
}
