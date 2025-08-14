<<<<<<< HEAD
# Capstone: Serverless TODO (CI/CD + IaC)

The project demonstrates:
**Frontend** hosting with AWS S3 (Static Website Hosting)
**Backend** API with AWS Lambda + API Gateway
**Data storage** with AWS DynamoDB
**Infrastructure provisioning** with Terraform
**Continuous Integration & Deployment (CI/CD) using** GitHub Actions

A tiny full‑stack app you can demo *today*:

- **Frontend:** Static HTML/CSS/JS hosted on **S3 (website hosting)**
- **Backend:** **AWS Lambda (Node.js 18)** behind **API Gateway (HTTP API)**
- **Database:** **DynamoDB** (pay-per-request)
- **IaC:** **Terraform** (AWS provider)
- **CI/CD:** **GitHub Actions** (PR CI + main deploy)
- **Code Scanning:** **GitHub CodeQL** (JavaScript)
- **Monitoring:** CloudWatch logs + metric alarms (Lambda errors, API 5XX)

---

## Quick Start

### 1) Create a new GitHub repo and push
```bash
unzip capstone-ci-cd.zip
cd capstone-ci-cd
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 2) Set GitHub Secrets (Repo → Settings → Secrets and variables → Actions → New repository secret)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g., `us-east-1`)

### 3) (Optional local) Run tests
```bash
cd lambda
npm ci
npm test -- --coverage
```

### 4) Deploy (push to `main`)
Commit/push to `main`. The **Deploy** workflow will:
- run tests & coverage
- `terraform apply` the infra
- fetch the API URL and inject into the frontend
- upload the frontend to S3 website hosting

When the workflow finishes, check the job summary for the **Website URL** output.

---

## Branching Strategy (example)
- `main`: protected, deploys to AWS
- `feature/ui-theme`, `feature/filters`, `feature/mark-all`, `feature/stats`, `feature/due-date`

Always open Pull Requests into `main`. Have a teammate review + approve. CI runs on PRs.

---

## Repo layout
```
.
├─ .github/workflows/
│  ├─ ci.yml
│  ├─ deploy.yml
│  └─ codeql.yml
├─ frontend/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js   (API URL injected during deploy)
├─ lambda/
│  ├─ index.js
│  ├─ package.json
│  ├─ jest.config.js
│  └─ __tests__/handler.test.js
└─ terraform/
   ├─ main.tf
   ├─ variables.tf
   ├─ versions.tf
   └─ outputs.tf
```

---

## Demo Script (10 minutes, no slides)
1. Show PRs, reviews, and CI checks on PR (tests + terraform validate).
2. Merge to `main` → Deploy workflow runs.
3. Open S3 **Website URL** → add, list, complete, and delete TODOs.
4. Show **CloudWatch Logs** (Lambda) and **Alarms** created by Terraform.
5. Show **CodeQL** security alerts tab in GitHub (post-scan).

---

## Cleanup
From your local machine or a runner:
```bash
cd terraform
terraform destroy -auto-approve
```
=======
# Capstone-group-9-cicd
>>>>>>> a713425475fa27e4c725c22a91b90a86760013cb
