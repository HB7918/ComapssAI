# Compass AI Backend Server

Express server that connects the UX Intake chat to DynamoDB.

## Prerequisites

- Node.js 18+
- AWS CLI configured with credentials
- DynamoDB table created

## Setup

### 1. Create DynamoDB Table

Using CloudFormation:
```bash
aws cloudformation create-stack \
  --stack-name compass-ai-intake-dev \
  --template-body file://infrastructure/dynamodb-table.yaml \
  --parameters ParameterKey=Environment,ParameterValue=dev
```

Or manually create a table with:
- Table name: `compass-ai-intake`
- Partition key: `id` (String)

### 2. Configure Environment

Create a `.env` file in the project root:
```
AWS_REGION=us-east-1
DYNAMODB_TABLE=compass-ai-intake-dev
```

Or export environment variables:
```bash
export AWS_REGION=us-east-1
export DYNAMODB_TABLE=compass-ai-intake-dev
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

Development (server only):
```bash
npm run server
```

Development (frontend + server):
```bash
npm run dev:all
```

## API Endpoints

### POST /api/intake
Submit a new intake request.

Request body:
```json
{
  "problem": "Customer problem description",
  "featureType": "new|enhancement|unsure",
  "existingFeature": "Feature name (if enhancement)",
  "service": "Service name",
  "timeline": "urgent|high|standard|future",
  "hasResearch": "yes|no|in_progress",
  "researchLinks": "Links to research",
  "stakeholder": "PM/Stakeholder name",
  "constraints": "Any constraints"
}
```

Response:
```json
{
  "success": true,
  "referenceNumber": "SSO-UX-2024-01-15-001",
  "id": "uuid",
  "message": "Intake submitted successfully"
}
```

### GET /api/intake
Get all intake requests.

### GET /api/intake/:refNumber
Get intake by reference number.

### GET /api/health
Health check endpoint.

## DynamoDB Schema

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (UUID) |
| referenceNumber | String | Human-readable reference (SSO-UX-YYYY-MM-DD-###) |
| problem | String | Customer problem description |
| featureType | String | new, enhancement, or unsure |
| existingFeature | String | Feature being enhanced (nullable) |
| service | String | Target AWS service |
| timeline | String | Priority level |
| hasResearch | String | Research availability |
| researchLinks | String | Links to research (nullable) |
| stakeholder | String | PM/Stakeholder name |
| constraints | String | Additional constraints (nullable) |
| status | String | pending, in_progress, completed |
| createdAt | String | ISO timestamp |
| updatedAt | String | ISO timestamp |
