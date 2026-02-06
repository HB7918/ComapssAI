const API_BASE = 'http://localhost:3001/api';

export const intakeApi = {
  // Submit intake request
  async submitIntake(data) {
    const response = await fetch(`${API_BASE}/v1/intake/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerProblem: data.problem || data.customerProblem,
        featureType: data.featureType,
        enhancingFeature: data.existingFeature || data.enhancingFeature,
        service: data.service,
        timeline: data.timeline,
        hasResearch: data.hasResearch,
        researchLinks: data.researchLinks,
        stakeholder: data.stakeholder,
        additionalContext: data.constraints || data.additionalContext,
        sessionId: data.sessionId,
        userEmail: data.userEmail
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  // Save draft
  async saveDraft(sessionId, formData, currentStep) {
    const response = await fetch(`${API_BASE}/v1/intake/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, formData, currentStep }),
    });
    return response.json();
  },

  // Get draft
  async getDraft(sessionId) {
    const response = await fetch(`${API_BASE}/v1/intake/draft/${sessionId}`);
    if (!response.ok) return null;
    return response.json();
  },

  // Get services list
  async getServices() {
    const response = await fetch(`${API_BASE}/v1/intake/services`);
    return response.json();
  },

  // Get intake by reference
  async getIntakeByRef(refNumber) {
    const response = await fetch(`${API_BASE}/v1/intake/${refNumber}`);
    return response.json();
  },

  // Get all intakes
  async getAllIntakes() {
    const response = await fetch(`${API_BASE}/v1/intakes`);
    return response.json();
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.json();
    } catch {
      return { status: 'error' };
    }
  }
};

export default intakeApi;
