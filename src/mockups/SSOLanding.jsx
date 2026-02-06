import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mockups.css';

const SSOLanding = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleGetStarted = () => {
    navigate('/intake');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "Who can use the SSO UX intake portal?", a: "Any PM, developer, or engineer working on Security Search and Observability services. If you're building customer-facing features, we're here to help." },
    { q: "What information do I need to submit a request?", a: "Just a clear description of the customer problem you're solving. Our chat will guide you through the rest—feature type, service name, timeline, and any supporting research." },
    { q: "How long does the intake process take?", a: "Most teams complete the conversational intake in 5 minutes or less. You can also save your progress and return later." },
    { q: "What happens after I submit?", a: "You'll receive an immediate confirmation with a reference number. The SSO UX team will review your submission and contact you within 48 hours with an initial concept or to schedule a deeper dive." },
    { q: "Can I attach files or links?", a: "Yes! You can upload research documents, customer feedback, or share links to existing work during the conversation." },
    { q: "What if I'm not sure if this is a new feature or enhancement?", a: "No problem! Select \"Not sure\" and our UX team will help you determine the right approach during the review." },
    { q: "Can I track my request after submission?", a: "Yes, you'll receive a unique reference number that you can use to track your request. You'll also get email updates when the UX team responds." },
    { q: "What if I need to make changes after submitting?", a: "Reply to your confirmation email with your reference number and the changes you'd like to make. We'll update your request." },
    { q: "What services do you support?", a: "We support Amazon OpenSearch Service, OpenSearch Project, CloudWatch, CloudTrail, Security Hub, and Security Lake." }
  ];

  return (
    <div className="sso-landing">
      {/* Navigation */}
      <nav className="sso-nav">
        <div className="sso-nav-brand">
          <span className="nav-logo">🧭</span>
          <span className="nav-title">SSO UX</span>
        </div>
        <div className="sso-nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="mailto:sso-ux-intake@amazon.com">Contact</a>
        </div>
        <button className="sso-nav-cta" onClick={handleGetStarted}>
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="sso-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">Security Search & Observability</p>
          <h1 className="hero-title">
            Meet Your <span className="gradient-text">UX Partner</span>
            <span className="hero-emoji">🧭</span>
          </h1>
          <p className="hero-subtitle">
            Turn your customer problems into UX concepts in 48 hours
          </p>
          <button className="hero-cta" onClick={handleGetStarted}>
            Get Started →
          </button>
          <p className="hero-note">Trusted by teams across Security Search and Observability</p>
        </div>

        {/* Floating badges */}
        <div className="hero-badges">
          <div className="badge badge-1">✨ AI-Powered</div>
          <div className="badge badge-2">⚡ 48hr Response</div>
          <div className="badge badge-3">🎯 Research-Driven</div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="sso-trusted">
        <div className="trusted-logos">
          <span>Amazon OpenSearch Service</span>
          <span>OpenSearch Project</span>
          <span>CloudWatch</span>
          <span>CloudTrail</span>
          <span>Security Hub</span>
          <span>Security Lake</span>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="sso-value" id="value">
        <h2 className="section-title">The last UX intake form you'll ever need</h2>
        <p className="section-subtitle">
          Skip the confusion of traditional intake forms. Our conversational experience guides you through the process, 
          asking the right questions at the right time. From problem statement to UX concept—all in one seamless conversation.
        </p>
      </section>

      {/* How It Works */}
      <section className="sso-how" id="how-it-works">
        <h2 className="section-title">How It Works - It's Simple</h2>

        <div className="how-steps-grid">
          <div className="how-step-card">
            <div className="step-number">1</div>
            <div className="step-icon">💬</div>
            <h3>Describe the Customer Problem</h3>
            <p>Tell us what your customers are trying to accomplish and where they're experiencing friction. Our chat guides you through providing the right context.</p>
          </div>
          
          <div className="how-step-card">
            <div className="step-number">2</div>
            <div className="step-icon">❓</div>
            <h3>Guided Conversation</h3>
            <p>We'll ask about feature type (new vs. enhancement), target service, timeline, and any existing research. No forms to fill out—just natural conversation.</p>
          </div>
          
          <div className="how-step-card">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>Confirm Your Request</h3>
            <p>Review your intake summary and submit. You'll receive a reference number and confirmation immediately.</p>
          </div>
          
          <div className="how-step-card">
            <div className="step-number">4</div>
            <div className="step-icon">🎨</div>
            <h3>UX Team Responds</h3>
            <p>Our SSO UX team will review your submission and reach out within 48 hours with an initial concept or next steps.</p>
          </div>
        </div>

        <div className="how-stats">
          <div className="stat">
            <span className="stat-number">48h</span>
            <span className="stat-label">Average response time</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Requests tracked</span>
          </div>
          <div className="stat">
            <span className="stat-number">5 min</span>
            <span className="stat-label">Average intake time</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="sso-features" id="features">
        <h2 className="section-title">Why Teams Love Our Intake Portal</h2>

        <div className="features-grid-large">
          <div className="feature-card">
            <span className="feature-icon-large">💬</span>
            <h3>Chat, Don't Fill Forms</h3>
            <p>Natural conversation flow makes submitting requests feel effortless. No more wondering which fields are required or what information to include.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon-large">🧠</span>
            <h3>We Ask the Right Questions</h3>
            <p>Our chat experience adapts based on your answers, asking follow-up questions only when needed. Get to submission faster.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon-large">⚡</span>
            <h3>Know Your Request is Tracked</h3>
            <p>Receive a reference number immediately. Track your request and get email updates when the UX team responds.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon-large">💾</span>
            <h3>Never Lose Your Work</h3>
            <p>Step away anytime. Your progress is automatically saved and you can return to complete your submission later.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon-large">📎</span>
            <h3>Share Supporting Materials</h3>
            <p>Upload customer feedback, research documents, or links to existing work. Help us understand the full context.</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon-large">⏱️</span>
            <h3>Clear Expectations</h3>
            <p>Know exactly when to expect a response. Our 48-hour commitment means you can plan your project timeline with confidence.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sso-testimonials">
        <h2 className="section-title">What SSO Teams Are Saying</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">"This is so much better than the old intake form. I actually enjoyed submitting my UX request!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <span className="author-name">PM</span>
                <span className="author-team">OpenSearch Service</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p className="testimonial-quote">"The conversational flow helped me articulate the customer problem better. The UX team had everything they needed."</p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <span className="author-name">Senior Developer</span>
                <span className="author-team">Security Lake</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p className="testimonial-quote">"48-hour turnaround is a game changer. We can move faster on customer-facing features now."</p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <span className="author-name">Engineering Manager</span>
                <span className="author-team">CloudWatch Logs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="sso-use-cases">
        <h2 className="section-title">Perfect For Every Stage</h2>
        
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">🆕</div>
            <h3>New Feature Development</h3>
            <p>Building something from scratch? Share your customer problem and we'll help you design the right experience from day one.</p>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-icon">✨</div>
            <h3>Enhancing Existing Features</h3>
            <p>Improving what's already there? Tell us what's not working and we'll help optimize the user experience.</p>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-icon">🎯</div>
            <h3>Customer Pain Points</h3>
            <p>Heard feedback from customers? Submit it through our portal and we'll help you translate it into actionable UX improvements.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="sso-faq" id="faq">
        <h2 className="section-title">Frequently Asked Questions</h2>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item-accordion ${openFaq === index ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="sso-cta-section">
        <div className="cta-glow"></div>
        <h2>Ready to Get Started?</h2>
        <p>Join the teams already using our conversational intake experience. Submit your first UX request in minutes.</p>
        <button className="hero-cta" onClick={handleGetStarted}>
          Start Your Request Now →
        </button>
        <p className="cta-alt">Have questions? <a href="mailto:sso-ux-intake@amazon.com">Contact us at sso-ux-intake@amazon.com</a></p>
      </section>

      {/* Footer */}
      <footer className="sso-footer-full">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:sso-ux-intake@amazon.com">Contact Us</a>
          </div>
          
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">SSO UX Wiki</a>
            <a href="#">Design Guidelines</a>
            <a href="#">UX Best Practices</a>
            <a href="#">Team Directory</a>
          </div>
          
          <div className="footer-col">
            <h4>Services We Support</h4>
            <a href="#">OpenSearch Service</a>
            <a href="#">OpenSearch Serverless</a>
            <a href="#">CloudWatch Logs</a>
            <a href="#">Security Services</a>
            <a href="#">View All Services</a>
          </div>
          
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="mailto:sso-ux-intake@amazon.com">sso-ux-intake@amazon.com</a>
            <a href="#">Slack: #sso-ux-intake</a>
            <a href="#">Wiki: w.amazon.com/bin/view/SSO-UX/</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-brand">
            <span className="nav-logo">🧭</span>
            <span>SSO UX Intake Portal</span>
          </div>
          <p className="footer-copy">© 2026 Amazon Web Services, Inc. | Security Search and Observability UX Team</p>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <button className="floating-chat-widget" onClick={handleGetStarted}>
        <span>💬</span>
        <span className="widget-tooltip">Start UX Request</span>
      </button>
    </div>
  );
};

export default SSOLanding;
