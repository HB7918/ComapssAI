const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  console.log('Processing DynamoDB Stream records:', event.Records.length);

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const intake = unmarshall(record.dynamodb.NewImage);
      console.log('Processing intake:', intake.referenceNumber);

      try {
        await sendConfirmationEmail(intake);
        await sendTeamNotification(intake);
        console.log(`✅ Emails sent successfully for: ${intake.referenceNumber}`);
      } catch (error) {
        console.error('❌ Error sending emails:', error);
      }
    }
  }

  return { statusCode: 200, body: 'Processed' };
};

async function sendConfirmationEmail(intake) {
  const params = {
    Source: 'hbaisani@amazon.com',
    Destination: {
      ToAddresses: [intake.submittedBy || 'hbaisani@amazon.com']
    },
    Message: {
      Subject: { Data: `✅ UX Intake Submitted: ${intake.referenceNumber}` },
      Body: {
        Html: { Data: generateEmailHTML(intake, 'confirmation') },
        Text: { Data: generateEmailText(intake, 'confirmation') }
      }
    }
  };
  await ses.send(new SendEmailCommand(params));
  console.log('Confirmation email sent');
}

async function sendTeamNotification(intake) {
  const params = {
    Source: 'hbaisani@amazon.com',
    Destination: { ToAddresses: ['hbaisani@amazon.com'] },
    Message: {
      Subject: { Data: `🆕 New UX Intake: ${intake.referenceNumber} - ${intake.service}` },
      Body: {
        Html: { Data: generateEmailHTML(intake, 'team') },
        Text: { Data: generateEmailText(intake, 'team') }
      }
    }
  };
  await ses.send(new SendEmailCommand(params));
  console.log('Team notification sent');
}

function generateEmailHTML(intake, type) {
  const isConfirmation = type === 'confirmation';
  const headerTitle = isConfirmation ? '🧭 SSO UX Intake' : '🆕 New UX Intake Request';
  const headerSubtitle = isConfirmation 
    ? 'Your request has been submitted successfully!' 
    : `${intake.referenceNumber} | Submitted ${new Date(intake.submittedAt).toLocaleString()}`;
  
  const featureTypeDisplay = intake.featureType === 'new' ? 'New Feature' : 
                             intake.featureType === 'enhancement' ? 'Enhancement' : 
                             intake.featureType || 'TBD';
  
  const stakeholderDisplay = intake.stakeholder && intake.stakeholder !== 'Not specified' 
    ? intake.stakeholder : 'None provided';
  
  const additionalContextDisplay = intake.additionalContext || 'None provided';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Amazon Ember', Arial, sans-serif; line-height: 1.6; color: #232f3e; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF9900, #FF6600); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 0; opacity: 0.95; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .reference-label { color: #666; font-size: 14px; margin-bottom: 5px; }
    .reference { font-size: 28px; font-weight: bold; color: #FF9900; margin-bottom: 25px; }
    .section { background: white; padding: 18px 20px; margin: 12px 0; border-radius: 8px; border-left: 4px solid #FF9900; }
    .label { font-weight: 600; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .value { font-size: 16px; color: #232f3e; }
    .next-steps { background: #232f3e; color: white; padding: 24px; border-radius: 8px; margin-top: 25px; }
    .next-steps h3 { color: #FF9900; margin: 0 0 16px 0; font-size: 18px; }
    .next-steps p { margin: 10px 0; font-size: 15px; }
    .next-steps strong { color: #FF9900; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .footer a { color: #FF9900; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${headerTitle}</h1>
      <p>${headerSubtitle}</p>
    </div>
    <div class="content">
      <p class="reference-label">Reference Number:</p>
      <p class="reference">${intake.referenceNumber}</p>
      
      <div class="section">
        <div class="label">Service</div>
        <div class="value">${intake.service}</div>
      </div>
      
      <div class="section">
        <div class="label">Feature Type</div>
        <div class="value">${featureTypeDisplay}${intake.enhancingFeature ? ` - ${intake.enhancingFeature}` : ''}</div>
      </div>
      
      <div class="section">
        <div class="label">Customer Problem</div>
        <div class="value">${intake.customerProblem}</div>
      </div>
      
      <div class="section">
        <div class="label">Stakeholder</div>
        <div class="value">${stakeholderDisplay}</div>
      </div>
      
      <div class="section">
        <div class="label">Additional Context</div>
        <div class="value">${additionalContextDisplay}</div>
      </div>
      
      ${isConfirmation ? `
      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <p>✅ Your request has been added to our intake queue</p>
        <p>👥 The SSO UX team will review your submission</p>
        <p>💡 We'll contact you within <strong>48 hours</strong> with an initial concept</p>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>Questions? Reply to this email or contact <a href="mailto:sso-ux-intake@amazon.com">sso-ux-intake@amazon.com</a></p>
      <p>© 2026 SSO UX Team | Security Search and Observability</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailText(intake, type) {
  const isConfirmation = type === 'confirmation';
  const featureTypeDisplay = intake.featureType === 'new' ? 'New Feature' : 
                             intake.featureType === 'enhancement' ? 'Enhancement' : 
                             intake.featureType || 'TBD';
  const stakeholderDisplay = intake.stakeholder && intake.stakeholder !== 'Not specified' 
    ? intake.stakeholder : 'None provided';
  const additionalContextDisplay = intake.additionalContext || 'None provided';

  let text = `
${isConfirmation ? 'SSO UX INTAKE - CONFIRMATION' : 'NEW UX INTAKE REQUEST'}
=============================

Reference Number: ${intake.referenceNumber}
Submitted: ${new Date(intake.submittedAt).toLocaleString()}

SERVICE: ${intake.service}
FEATURE TYPE: ${featureTypeDisplay}${intake.enhancingFeature ? ` - ${intake.enhancingFeature}` : ''}
STAKEHOLDER: ${stakeholderDisplay}

CUSTOMER PROBLEM:
${intake.customerProblem}

ADDITIONAL CONTEXT:
${additionalContextDisplay}
`;

  if (isConfirmation) {
    text += `
WHAT HAPPENS NEXT:
✅ Your request has been added to our intake queue
👥 The SSO UX team will review your submission
💡 We'll contact you within 48 hours with an initial concept
`;
  }

  text += `
---
Questions? Contact sso-ux-intake@amazon.com
SSO UX Team | Security Search and Observability
`;

  return text.trim();
}
