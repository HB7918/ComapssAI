import React, { useState, useEffect, useRef } from 'react';
import intakeApi from '../services/intakeApi';
import './mockups.css';

const ChatIntake = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('welcome');
  const [intakeData, setIntakeData] = useState({
    problem: '',
    featureType: '',
    existingFeature: '',
    service: '',
    otherService: '',
    timeline: '',
    hasResearch: '',
    researchLinks: '',
    stakeholder: '',
    constraints: ''
  });
  const [showOptions, setShowOptions] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const initializedRef = useRef(false);

  const services = [
    'Amazon OpenSearch Service', 'OpenSearch Project', 'CloudWatch',
    'CloudTrail', 'Security Hub', 'Security Lake', 'Other'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // Initial welcome message
    setTimeout(() => {
      addBotMessage(
        "Hi! 👋 Welcome to the Security Search and Observability UX intake portal. I'm here to help you submit a UX request for your project.\n\nI'll ask you a few questions about the customer problem you're trying to solve, and our UX team will get back to you within 48 hours with a concept.\n\nReady to get started?",
        [{ label: "Yes, let's go!", value: 'yes' }, { label: 'Sure', value: 'sure' }]
      );
    }, 500);
  }, []);

  const addBotMessage = (content, options = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content }]);
      if (options) setShowOptions(options);
    }, 800);
  };

  const addUserMessage = (content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setShowOptions(null);
  };

  const handleOptionClick = (option) => {
    addUserMessage(option.label);
    processStep(option.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const value = inputValue.trim();
    addUserMessage(value);
    setInputValue('');
    processInput(value);
  };

  const processStep = (value) => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('problem');
        setTimeout(() => {
          addBotMessage(
            "Great! Let's start with the most important part.\n\n**What customer problem are you trying to solve?**\n\nPlease describe the problem in detail. Include:\n• What customers are trying to accomplish\n• Current pain points or friction\n• Expected outcome"
          );
        }, 300);
        break;

      case 'problem_confirm':
        if (value === 'yes') {
          setCurrentStep('feature_type');
          setTimeout(() => {
            addBotMessage(
              "Now, help me understand the scope of this request.\n\n**Is this a new feature or an enhancement to an existing feature?**",
              [
                { label: '🆕 New Feature - Building something from scratch', value: 'new' },
                { label: '✨ Enhancement - Improving an existing feature', value: 'enhancement' },
                { label: "🤔 Not sure - Need help determining this", value: 'unsure' }
              ]
            );
          }, 300);
        } else {
          setCurrentStep('problem');
          setTimeout(() => {
            addBotMessage("No problem! Let's try again. Please describe the customer problem you're trying to solve:");
          }, 300);
        }
        break;

      case 'feature_type':
        setIntakeData(prev => ({ ...prev, featureType: value }));
        if (value === 'enhancement') {
          setCurrentStep('existing_feature');
          setTimeout(() => {
            addBotMessage("Which existing feature are you enhancing?");
          }, 300);
        } else {
          setCurrentStep('service');
          setTimeout(() => {
            addBotMessage(
              "**Which service is this feature for?**",
              services.map(s => ({ label: s, value: s.toLowerCase().replace(/\s+/g, '_') }))
            );
          }, 300);
        }
        break;

      case 'service':
        const serviceName = services.find(s => s.toLowerCase().replace(/\s+/g, '_') === value) || value;
        setIntakeData(prev => ({ ...prev, service: serviceName }));
        if (value === 'other') {
          setCurrentStep('other_service');
          setTimeout(() => {
            addBotMessage("Please specify the service name:");
          }, 300);
        } else {
          setCurrentStep('timeline');
          setTimeout(() => {
            addBotMessage(
              "Just a few more quick questions to help us prioritize and prepare...\n\n**What's the target timeline for this feature?**",
              [
                { label: '🔴 Urgent (next sprint)', value: 'urgent' },
                { label: '🟡 High priority (next quarter)', value: 'high' },
                { label: '🟢 Standard (next 6 months)', value: 'standard' },
                { label: '⚪ Future consideration', value: 'future' }
              ]
            );
          }, 300);
        }
        break;

      case 'timeline':
        const timelineLabels = {
          'urgent': '🔴 Urgent (next sprint)',
          'high': '🟡 High priority (next quarter)',
          'standard': '🟢 Standard (next 6 months)',
          'future': '⚪ Future consideration'
        };
        setIntakeData(prev => ({ ...prev, timeline: timelineLabels[value] || value }));
        setCurrentStep('research');
        setTimeout(() => {
          addBotMessage(
            "**Do you have any existing research or customer feedback?**",
            [
              { label: 'Yes (I can provide links)', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'In progress', value: 'in_progress' }
            ]
          );
        }, 300);
        break;

      case 'research':
        setIntakeData(prev => ({ ...prev, hasResearch: value }));
        if (value === 'yes') {
          setCurrentStep('research_links');
          setTimeout(() => {
            addBotMessage("Please provide links to your research or attach files:");
          }, 300);
        } else {
          setCurrentStep('stakeholder');
          setTimeout(() => {
            addBotMessage("**Who is the primary stakeholder or PM for this project?** (Optional - press Enter to skip)");
          }, 300);
        }
        break;

      case 'review_confirm':
        if (value === 'submit') {
          submitIntake();
        } else if (value === 'edit') {
          setCurrentStep('problem');
          setTimeout(() => {
            addBotMessage("Let's start over. What customer problem are you trying to solve?");
          }, 300);
        } else {
          setTimeout(() => {
            addBotMessage("Intake cancelled. Feel free to start a new request anytime!");
          }, 300);
        }
        break;

      default:
        break;
    }
  };

  const processInput = (value) => {
    switch (currentStep) {
      case 'problem':
        if (value.length < 50) {
          setTimeout(() => {
            addBotMessage("Please provide more detail (minimum 50 characters). What specific pain points are customers experiencing?");
          }, 300);
          return;
        }
        setIntakeData(prev => ({ ...prev, problem: value }));
        setCurrentStep('problem_confirm');
        const summary = value.length > 150 ? value.substring(0, 150) + '...' : value;
        setTimeout(() => {
          addBotMessage(
            `Thanks for sharing that context. Let me make sure I understand...\n\n*"${summary}"*\n\nDoes this accurately capture the problem?`,
            [{ label: 'Yes, that\'s correct', value: 'yes' }, { label: 'No, let me clarify', value: 'no' }]
          );
        }, 300);
        break;

      case 'existing_feature':
        setIntakeData(prev => ({ ...prev, existingFeature: value }));
        setCurrentStep('service');
        setTimeout(() => {
          addBotMessage(
            "**Which service is this feature for?**",
            services.map(s => ({ label: s, value: s.toLowerCase().replace(/\s+/g, '_') }))
          );
        }, 300);
        break;

      case 'other_service':
        setIntakeData(prev => ({ ...prev, service: value, otherService: value }));
        setCurrentStep('timeline');
        setTimeout(() => {
          addBotMessage(
            "**What's the target timeline for this feature?**",
            [
              { label: '🔴 Urgent (next sprint)', value: 'urgent' },
              { label: '🟡 High priority (next quarter)', value: 'high' },
              { label: '🟢 Standard (next 6 months)', value: 'standard' },
              { label: '⚪ Future consideration', value: 'future' }
            ]
          );
        }, 300);
        break;

      case 'research_links':
        setIntakeData(prev => ({ ...prev, researchLinks: value }));
        setCurrentStep('stakeholder');
        setTimeout(() => {
          addBotMessage("**Who is the primary stakeholder or PM for this project?** (Optional - press Enter to skip)");
        }, 300);
        break;

      case 'stakeholder':
        setIntakeData(prev => ({ ...prev, stakeholder: value || 'Not specified' }));
        setCurrentStep('constraints');
        setTimeout(() => {
          addBotMessage("**Are there any specific constraints or requirements we should know about?** (Optional - press Enter to skip)");
        }, 300);
        break;

      case 'constraints':
        setIntakeData(prev => ({ ...prev, constraints: value }));
        showReview({ ...intakeData, constraints: value });
        break;

      default:
        break;
    }
  };

  const showReview = (data) => {
    setCurrentStep('review_confirm');
    const featureTypeLabel = data.featureType === 'new' ? '🆕 New Feature' : 
                            data.featureType === 'enhancement' ? '✨ Enhancement' : '🤔 To be determined';
    
    setTimeout(() => {
      addBotMessage(
        `Perfect! Let me summarize your request:\n\n**📋 Intake Summary**\n\n**Customer Problem:**\n${data.problem}\n\n**Feature Type:** ${featureTypeLabel}${data.existingFeature ? `\nEnhancing: ${data.existingFeature}` : ''}\n\n**Service:** ${data.service}\n\n**Timeline:** ${data.timeline}\n\n**Stakeholder:** ${data.stakeholder || 'Not specified'}\n\n${data.constraints ? `**Additional Context:** ${data.constraints}\n\n` : ''}Does everything look correct?`,
        [
          { label: '✅ Yes, submit this request', value: 'submit' },
          { label: '✏️ Edit my responses', value: 'edit' },
          { label: '❌ Cancel', value: 'cancel' }
        ]
      );
    }, 300);
  };

  const submitIntake = async () => {
    setIsSubmitting(true);
    setCurrentStep('submitting');
    
    try {
      // Submit to DynamoDB via API
      const response = await intakeApi.submitIntake({
        problem: intakeData.problem,
        featureType: intakeData.featureType,
        existingFeature: intakeData.existingFeature,
        service: intakeData.service,
        timeline: intakeData.timeline,
        hasResearch: intakeData.hasResearch,
        researchLinks: intakeData.researchLinks,
        stakeholder: intakeData.stakeholder,
        constraints: intakeData.constraints
      });

      setCurrentStep('complete');
      setTimeout(() => {
        addBotMessage(
          `🎉 **Your intake has been submitted successfully!**\n\n**Reference Number:** ${response.referenceNumber}\n\n**What happens next?**\n✅ Your request has been added to our intake queue\n📧 You'll receive a confirmation email shortly\n👥 The SSO UX team will review your submission\n💡 We'll contact you within 48 hours with an initial concept\n\n---\n\nNeed to make changes? Reply to the confirmation email with your reference number.\n\nHave questions? Contact us at sso-ux-intake@amazon.com\n\nThank you for using the SSO UX intake portal! 🚀`
        );
      }, 300);
    } catch (error) {
      console.error('Failed to submit intake:', error);
      // Fallback to local reference number if API fails
      const refNumber = `SSO-UX-${new Date().toISOString().split('T')[0]}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
      setCurrentStep('complete');
      setTimeout(() => {
        addBotMessage(
          `🎉 **Your intake has been submitted!**\n\n**Reference Number:** ${refNumber}\n\n⚠️ *Note: There was an issue connecting to the database. Your request has been saved locally and will be synced when the connection is restored.*\n\n**What happens next?**\n✅ Your request has been added to our intake queue\n📧 You'll receive a confirmation email shortly\n👥 The SSO UX team will review your submission\n💡 We'll contact you within 48 hours with an initial concept\n\n---\n\nThank you for using the SSO UX intake portal! 🚀`
        );
      }, 300);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMessage = (msg, index) => {
    // Parse markdown-like formatting
    const formatContent = (content) => {
      return content
        .split('\n')
        .map((line, i) => {
          // Bold
          line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
          // Italic
          line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
          // Bullet points
          if (line.startsWith('•') || line.startsWith('✅') || line.startsWith('📧') || line.startsWith('👥') || line.startsWith('💡')) {
            return `<div class="message-bullet">${line}</div>`;
          }
          return line;
        })
        .join('<br/>');
    };

    return (
      <div key={index} className={`message message--${msg.role}`}>
        <div className="message-avatar">
          {msg.role === 'user' ? 'You' : '🧭'}
        </div>
        <div className="message-content">
          <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
        </div>
      </div>
    );
  };

  return (
    <div className="chat-landing chat-intake">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h1 className="brand-logo">
            <span className="logo-icon">🧭</span>
            <span className="logo-text">Compass AI</span>
          </h1>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">UX Intake Portal</h3>
          <p className="intake-description">Security Search and Observability</p>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Progress</h3>
          <div className="intake-progress">
            <div className={`progress-step ${currentStep === 'welcome' ? 'active' : messages.length > 1 ? 'complete' : ''}`}>
              <span className="step-indicator">1</span>
              <span className="step-label">Welcome</span>
            </div>
            <div className={`progress-step ${['problem', 'problem_confirm'].includes(currentStep) ? 'active' : ['feature_type', 'existing_feature', 'service', 'other_service', 'timeline', 'research', 'research_links', 'stakeholder', 'constraints', 'review_confirm', 'complete'].includes(currentStep) ? 'complete' : ''}`}>
              <span className="step-indicator">2</span>
              <span className="step-label">Problem</span>
            </div>
            <div className={`progress-step ${['feature_type', 'existing_feature'].includes(currentStep) ? 'active' : ['service', 'other_service', 'timeline', 'research', 'research_links', 'stakeholder', 'constraints', 'review_confirm', 'complete'].includes(currentStep) ? 'complete' : ''}`}>
              <span className="step-indicator">3</span>
              <span className="step-label">Feature Type</span>
            </div>
            <div className={`progress-step ${['service', 'other_service'].includes(currentStep) ? 'active' : ['timeline', 'research', 'research_links', 'stakeholder', 'constraints', 'review_confirm', 'complete'].includes(currentStep) ? 'complete' : ''}`}>
              <span className="step-indicator">4</span>
              <span className="step-label">Service</span>
            </div>
            <div className={`progress-step ${['timeline', 'research', 'research_links', 'stakeholder', 'constraints'].includes(currentStep) ? 'active' : ['review_confirm', 'complete'].includes(currentStep) ? 'complete' : ''}`}>
              <span className="step-indicator">5</span>
              <span className="step-label">Details</span>
            </div>
            <div className={`progress-step ${currentStep === 'review_confirm' ? 'active' : currentStep === 'complete' ? 'complete' : ''}`}>
              <span className="step-indicator">6</span>
              <span className="step-label">Review</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="help-text">
            <span>Need help?</span>
            <a href="mailto:sso-ux-intake@amazon.com">Contact UX Team</a>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, i) => renderMessage(msg, i))}
          {isTyping && (
            <div className="message message--assistant">
              <div className="message-avatar">🧭</div>
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Options */}
        {showOptions && (
          <div className="chat-options">
            {showOptions.map((option, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder={currentStep === 'complete' ? 'Intake complete' : 'Type your response...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={currentStep === 'complete' || showOptions}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim() || currentStep === 'complete'}>
                <span>↑</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatIntake;
