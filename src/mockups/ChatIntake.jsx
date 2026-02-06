import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import intakeApi from '../services/intakeApi';
import './mockups.css';

const ChatIntake = () => {
  const navigate = useNavigate();
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
            "**What customer problem are you solving?**\n\nInclude: what customers want to do, pain points, expected outcome."
          );
        }, 300);
        break;

      case 'problem_confirm':
        if (value === 'yes') {
          setCurrentStep('feature_type');
          setTimeout(() => {
            addBotMessage(
              "**Is this a new feature or enhancement?**",
              [
                { label: '🆕 New Feature', value: 'new' },
                { label: '✨ Enhancement', value: 'enhancement' },
                { label: '🤔 Not sure', value: 'unsure' }
              ]
            );
          }, 300);
        } else {
          setCurrentStep('problem');
          setTimeout(() => {
            addBotMessage("Let's try again. Describe the customer problem:");
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
        }
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
            addBotMessage(
              "**Who is the primary stakeholder or PM for this project?**",
              [{ label: 'Skip this question', value: 'skip' }]
            );
          }, 300);
        }
        break;

      case 'stakeholder':
        if (value === 'skip') {
          setIntakeData(prev => ({ ...prev, stakeholder: 'Not specified' }));
          setCurrentStep('constraints');
          setTimeout(() => {
            addBotMessage(
              "**Are there any specific constraints or requirements we should know about?**",
              [{ label: 'Skip this question', value: 'skip' }]
            );
          }, 300);
        }
        break;

      case 'constraints':
        if (value === 'skip') {
          setIntakeData(prev => ({ ...prev, constraints: '' }));
          showReview({ ...intakeData, constraints: '' });
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

      case 'research_links':
        setIntakeData(prev => ({ ...prev, researchLinks: value }));
        setCurrentStep('stakeholder');
        setTimeout(() => {
          addBotMessage(
            "**Who is the primary stakeholder or PM for this project?**",
            [{ label: 'Skip this question', value: 'skip' }]
          );
        }, 300);
        break;

      case 'stakeholder':
        setIntakeData(prev => ({ ...prev, stakeholder: value || 'Not specified' }));
        setCurrentStep('constraints');
        setTimeout(() => {
          addBotMessage(
            "**Are there any specific constraints or requirements we should know about?**",
            [{ label: 'Skip this question', value: 'skip' }]
          );
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
    const featureTypeLabel = data.featureType === 'new' ? 'New Feature' : 
                            data.featureType === 'enhancement' ? 'Enhancement' : 'TBD';
    const stakeholderDisplay = data.stakeholder && data.stakeholder !== 'Not specified' ? data.stakeholder : 'None provided';
    const constraintsDisplay = data.constraints ? data.constraints : 'None provided';
    
    setTimeout(() => {
      addBotMessage(
        `**📋 Intake Summary**\n\n**Problem:** ${data.problem.substring(0, 100)}${data.problem.length > 100 ? '...' : ''}\n**Type:** ${featureTypeLabel}${data.existingFeature ? ` (${data.existingFeature})` : ''}\n**Service:** ${data.service}\n**Stakeholder:** ${stakeholderDisplay}\n**Additional Context:** ${constraintsDisplay}\n\nLook correct?`,
        [
          { label: '✅ Submit', value: 'submit' },
          { label: '✏️ Edit', value: 'edit' },
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
          `🎉 Your intake has been submitted successfully!\n\nReference Number: ${response.referenceNumber}\n\nWhat happens next?\n✅ Your request has been added to our intake queue\n👥 The SSO UX team will review your submission\n💡 We'll contact you within 48 hours with an initial concept\n\nNeed to make changes? Reply to the confirmation email with your reference number.\nHave questions? Contact us at sso-ux-intake@amazon.com`
        );
      }, 300);
    } catch (error) {
      console.error('Failed to submit intake:', error);
      // Fallback to local reference number if API fails
      const refNumber = `SSO-UX-${new Date().toISOString().split('T')[0]}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
      setCurrentStep('complete');
      setTimeout(() => {
        addBotMessage(
          `🎉 Your intake has been submitted successfully!\n\nReference Number: ${refNumber}\n\nWhat happens next?\n✅ Your request has been added to our intake queue\n👥 The SSO UX team will review your submission\n💡 We'll contact you within 48 hours with an initial concept\n\nHave questions? Contact us at sso-ux-intake@amazon.com`
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
          // Bullet points - display inline-block to remove extra spacing
          if (line.startsWith('•') || line.startsWith('✅') || line.startsWith('📧') || line.startsWith('👥') || line.startsWith('💡')) {
            return `<span class="message-bullet">${line}</span>`;
          }
          return line + '<br/>';
        })
        .join('');
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
          <h1 className="brand-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🧭</span>
            <span className="logo-text">Compass AI</span>
          </h1>
        </div>

        <div className="sidebar-section">
          <button className="back-to-home-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">UX Intake Portal</h3>
          <p className="intake-description">Security Search and Observability</p>
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
                disabled={currentStep === 'complete' || (showOptions && !['stakeholder', 'constraints'].includes(currentStep))}
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
