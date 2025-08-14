# Project Report — Capstone CI/CD (Serverless TODO)

## 1. Application & Infrastructure
- **App**: Minimal TODO service with CRUD API and single‑page frontend.
- **Frontend**: Static HTML/CSS/JS (S3 website hosting).
- **Backend**: AWS Lambda (Node.js 18) via API Gateway (HTTP API).
- **DB**: DynamoDB (on‑demand, single partition key `id`).
- **IaC**: Terraform modules inline; reproducible with `init/plan/apply`.

### Architecture Diagram (text)
S3 (Website) → Browser (fetch) → API Gateway (HTTP API) → Lambda → DynamoDB  
CloudWatch: logs for Lambda; alarms: Lambda Errors > 0, API 5XX > 0.

## 2. Pipeline Design
- **Source**: GitHub repo (app + IaC).
- **Code Scanning (Bonus)**: GitHub CodeQL (JavaScript).
- **Build/Test**: Jest unit tests with coverage (lambda code).
- **Validate**: `terraform fmt` + `terraform validate` on PR.
- **Deploy**: On push to `main`:
  1. run tests & coverage
  2. `terraform apply` infra
  3. read `api_url` output, inject into `frontend/app.js`
  4. `aws s3 sync` to public website bucket
- **Triggers**: PRs and pushes to feature branches run CI; `main` runs deploy.

## 3. Monitoring & Logging
- **CloudWatch Logs**: Lambda log group auto-created; review `REPORT` events.
- **Alarms**:
  - Lambda **Errors** > 0 (sum, 60s)
  - API Gateway **5xx** > 0 (sum, 60s)

## 4. Challenges & Resolutions
- **Fast deploy without servers**: used Lambda + DynamoDB (no servers/VPC).
- **Single integration for many routes**: HTTP API with `AWS_PROXY` and route keys.
- **Front‑end API URL**: placeholder replacement during deploy step.
- **Minimal but real tests**: focused unit tests for request building & helpers.
- **Public website hosting**: S3 policy + block public access set appropriately.

## 5. How to Run Locally (optional dev loop)
- Run Jest tests locally (`npm test`) to iterate on handlers.
- You can invoke Lambda handler locally by calling exported functions.

## 6. References
- AWS Docs (Lambda, API Gateway HTTP APIs, DynamoDB, S3 Website)
- Terraform Registry (aws, archive, apigatewayv2, dynamodb, lambda)

