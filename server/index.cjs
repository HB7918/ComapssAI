const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
const PORT = process.env.PORT || 3001;

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const INTAKES_TABLE = 'compass-ai-intakes-dev';
const DRAFTS_TABLE = 'compass-ai-drafts-dev';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SERVICES = [
  { id: 'amazon-opensearch-service', name: 'Amazon OpenSearch Service' },
  { id: 'opensearch-project', name: 'OpenSearch Project' },
  { id: 'cloudwatch', name: 'CloudWatch' },
  { id: 'cloudtrail', name: 'CloudTrail' },
  { id: 'security-hub', name: 'Security Hub' },
  { id: 'security-lake', name: 'Security Lake' },
  { id: 'other', name: 'Other' }
];

const generateRefNumber = () => {
  const date = new Date().toISOString().split('T')[0];
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return 'SSO-UX-' + date + '-' + seq;
};

const sanitize = (str) => typeof str === 'string' ? str.replace(/<[^>]*>/g, '').trim() : str;

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', storage: 'dynamodb', region: 'us-east-1' });
});

app.get('/api/v1/intake/services', (req, res) => res.json({ success: true, services: SERVICES }));

app.post('/api/v1/intake/submit', async (req, res) => {
  try {
    const { customerProblem, featureType, enhancingFeature, service, stakeholder, additionalContext } = req.body;
    if (!customerProblem || customerProblem.length < 50) {
      return res.status(400).json({ success: false, errors: [{ field: 'customerProblem', message: 'Min 50 chars' }] });
    }
    const referenceNumber = generateRefNumber();
    const now = new Date().toISOString();
    const item = {
      pk: 'INTAKE#' + referenceNumber,
      sk: 'METADATA',
      id: uuidv4(),
      referenceNumber,
      submittedAt: now,
      status: 'SUBMITTED',
      customerProblem: sanitize(customerProblem),
      featureType: featureType || 'NOT_SURE',
      enhancingFeature: enhancingFeature ? sanitize(enhancingFeature) : null,
      service: sanitize(service),
      stakeholder: stakeholder ? sanitize(stakeholder) : 'Not specified',
      additionalContext: additionalContext ? sanitize(additionalContext) : null
    };
    await docClient.send(new PutCommand({ TableName: INTAKES_TABLE, Item: item }));
    console.log('Intake submitted:', referenceNumber);
    res.status(201).json({ success: true, referenceNumber, submittedAt: now });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/intakes', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({ TableName: INTAKES_TABLE, FilterExpression: 'begins_with(pk, :p)', ExpressionAttributeValues: { ':p': 'INTAKE#' } }));
    res.json({ success: true, items: result.Items || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('🧭 Compass AI Server: http://localhost:' + PORT);
  console.log('📦 Storage: DynamoDB (us-east-1)');
});
