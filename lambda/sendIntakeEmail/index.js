const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-west-2' });

exports.handler = async (event) => {
  console.log('Processing DynamoDB Stream records:', event.Records.length);

  for (const record of event.Records) {
    // Only process INSERT events (new submissions)
    if (record.eventName === 'INSERT') {
      const intake = unmarshall(record.dynamodb.NewImage);
      
      console.log('Processing intake:', intake.referenceNumber);

      try {
        await sendConfirmationEmail(intake);
        await sendTeamNotification(intake);
        console.log(`✅ Emails sent successfully for: ${intake.referenceNumber}`);
      } catch (error) {
        console.error('❌ Error sending emails:', error);
        // Don't throw - allow other records to process
      }
    }
  }

  return { statusCode: 200, body: 'Processed' };
};

async function sendConfirmationEmail(intake) {
  const params = {
    Source: 'hbaisani@amazon.com',
    Destination: {
      ToAddresses: [intake.submittedBy || 'hbaisani@amazon.com'],
      CcAddresses: intake.stakeholder && intake.stakeholder !== 'Not specified' ? [intake.stakeholder] : []
    },
    Message: {
      Subject: {
        Data: `✅ UX Intake Submitted: ${intake.referenceNumber}`
      },
      Body: {
        Html: {
          Data: generateConfirmationEmailHTML(intake)
        },
        Text: {
          Data: generateConfirmationEmailText(intake)
        }
      }
    }
  };

  await ses.send(new SendEmailCommand(params));
  console.log('Confirmation email sent to:', intake.submittedBy);
}

async function sendTeamNotification(intake) {
  const params = {
    Source: 'hbaisani@amazon.com',
    Destination: {
      ToAddresses: ['hbaisani@amazon.com']
    },
    Message: {
      Subject: {
        Data: `🆕 New UX Intake: ${intake.referenceNumber} - ${intake.service}`
      },
      Body: {
        Html: {
          Data: generateTeamNotificationHTML(intake)
        },
        Text: {
          Data: generateTeamNotificationText(intake)
        }
      }
    }
  };

  await ses.send(new SendEmailCommand(params));
  console.log('Team notification sent');
}

function generateConfirmationEmailHTML(intake) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Amazon Ember', Arial, sans-serif; line-height: 1.6; color: #232f3e; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF9900, #FF6600); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .reference { font-size: 24px; font-weight: bold; color: #FF9900; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #FF9900; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-top: 5px; }
    .next-steps { background: #232f3e; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .next-steps h3 { color: #FF9900; margin-top: 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧭 SSO UX Intake</h1>
      <p>Your request has been submitted successfully!</p>
    </div>
    <div class="content">
      <p>Reference Number:</p>
      <p class="reference">${intake.referenceNumber}</p>
      
      <div class="section">
        <div class="label">Service</div>
        <div class="value">${intake.service}</div>
      </div>
      
      <div class="section">
        <div class="label">Feature Type</div>
        <div class="value">${intake.featureType}${intake.enhancingFeature ? ` - ${intake.enhancingFeature}` : ''}</div>
      </div>
      
      <div class="section">
        <div class="label">Timeline</div>
        <div class="value">${intake.timeline}</div>
      </div>
      
      <div class="section">
        <div class="label">Customer Problem</div>
        <div class="value">${intake.customerProblem}</div>
      </div>
      
      ${intake.additionalContext ? `
      <div class="section">
        <div class="label">Additional Context</div>
        <div class="value">${intake.additionalContext}</div>
      </div>
      ` : ''}
      
      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <p>✅ Your request has been added to our intake queue</p>
        <p>👥 The SSO UX team will review your submission</p>
        <p>💡 We'll contact you within <strong>48 hours</strong> with an initial concept</p>
      </div>
    </div>
    <div class="footer">
      <p>Questions? Reply to this email or contact sso-ux-intake@amazon.com</p>
      <p>© 2026 SSO UX Team | Security Search and Observability</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateConfirmationEmailText(intake) {
  return `
SSO UX INTAKE - CONFIRMATION
=============================

Your request has been submitted successfully!

Reference Number: ${intake.referenceNumber}

REQUEST DETAILS:
- Service: ${intake.service}
- Feature Type: ${intake.featureType}${intake.enhancingFeature ? ` - ${intake.enhancingFeature}` : ''}
- Timeline: ${intake.timeline}
- Stakeholder: ${intake.stakeholder}

CUSTOMER PROBLEM:
${intake.customerProblem}

${intake.additionalContext ? `ADDITIONAL CONTEXT:\n${intake.additionalContext}\n` : ''}

WHAT HAPPENS NEXT:
✅ Your request has been added to our intake queue
👥 The SSO UX team will review your submission
💡 We'll contact you within 48 hours with an initial concept

Questions? Reply to this email or contact sso-ux-intake@amazon.com

---
SSO UX Team | Security Search and Observability
  `.trim();
}

function generateTeamNotificationHTML(intake) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Amazon Ember', Arial, sans-serif; line-height: 1.6; color: #232f3e; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #232f3e; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #FF9900; margin: 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .meta { display: flex; gap: 20px; margin-bottom: 20px; }
    .meta-item { background: white; padding: 15px; border-radius: 8px; flex: 1; }
    .meta-label { font-size: 11px; color: #666; text-transform: uppercase; }
    .meta-value { font-size: 16px; font-weight: bold; }
    .problem { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9900; }
    .priority-urgent { color: #d13212; }
    .priority-high { color: #ff9900; }
    .priority-standard { color: #067f68; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🆕 New UX Intake Request</h1>
      <p>${intake.referenceNumber} | Submitted ${new Date(intake.submittedAt).toLocaleString()}</p>
    </div>
    <div class="content">
      <div class="meta">
        <div class="meta-item">
          <div class="meta-label">Service</div>
          <div class="meta-value">${intake.service}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Timeline</div>
          <div class="meta-value ${intake.timeline?.includes('Urgent') ? 'priority-urgent' : intake.timeline?.includes('High') ? 'priority-high' : 'priority-standard'}">${intake.timeline}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Type</div>
          <div class="meta-value">${intake.featureType}</div>
        </div>
      </div>
      
      <div class="problem">
        <h3>Customer Problem</h3>
        <p>${intake.customerProblem}</p>
      </div>
      
      ${intake.additionalContext ? `
      <div class="problem" style="margin-top: 15px; border-left-color: #666;">
        <h3>Additional Context</h3>
        <p>${intake.additionalContext}</p>
      </div>
      ` : ''}
      
      <p style="margin-top: 20px;"><strong>Stakeholder:</strong> ${intake.stakeholder}</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateTeamNotificationText(intake) {
  return `
NEW UX INTAKE REQUEST
=====================

Reference: ${intake.referenceNumber}
Submitted: ${new Date(intake.submittedAt).toLocaleString()}

SERVICE: ${intake.service}
TIMELINE: ${intake.timeline}
TYPE: ${intake.featureType}${intake.enhancingFeature ? ` - ${intake.enhancingFeature}` : ''}
STAKEHOLDER: ${intake.stakeholder}

CUSTOMER PROBLEM:
${intake.customerProblem}

${intake.additionalContext ? `ADDITIONAL CONTEXT:\n${intake.additionalContext}` : ''}
  `.trim();
}
