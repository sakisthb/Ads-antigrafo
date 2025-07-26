import Anthropic from '@anthropic-ai/sdk';

interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  confidence: number;
  responseTime: number;
  isFromAI: boolean;
}

class ClaudeAIService {
  private anthropic: Anthropic | null = null;
  private isInitialized = false;
  private apiKey: string | null = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    // Check for API key in environment or localStorage
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || 
                  localStorage.getItem('claude_api_key') || 
                  null;

    if (this.apiKey) {
      try {
        this.anthropic = new Anthropic({
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true // Only for development
        });
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize Claude API:', error);
        this.fallbackToMockMode();
      }
    } else {
      console.warn('Claude API key not found. Using mock responses.');
      this.fallbackToMockMode();
    }
  }

  private fallbackToMockMode() {
    this.isInitialized = false;
    this.anthropic = null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('claude_api_key', apiKey);
    this.initializeAPI();
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    if (!this.isInitialized || !this.anthropic) {
      return this.getMockResponse(request, startTime);
    }

    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(request);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const responseTime = Date.now() - startTime;
      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

      return {
        content,
        confidence: this.calculateConfidence(content),
        responseTime,
        isFromAI: true
      };

    } catch (error) {
      console.error('Claude API error:', error);
      return this.getMockResponse(request, startTime);
    }
  }

  private buildSystemPrompt(): string {
    return `Είσαι ένας expert media buyer και digital marketing strategist με πάνω από 15 χρόνια εμπειρία. 

ΕΙΔΙΚΟΤΗΤΕΣ ΣΟΥ:
• Facebook Ads, Google Ads, Instagram, TikTok, LinkedIn advertising
• Campaign optimization και performance analysis
• Budget allocation και scaling strategies
• Creative testing και A/B testing methodologies
• Audience research και targeting optimization
• ROI optimization και conversion tracking
• Platform algorithm understanding
• Market trend analysis και competitive intelligence

ΣΤΥΛ ΕΠΙΚΟΙΝΩΝΙΑΣ:
• Απαντάς στα Ελληνικά
• Χρησιμοποιείς emojis για καλύτερη κατανόηση
• Δίνεις concrete, actionable recommendations
• Αναφέρεις συγκεκριμένα metrics και KPIs
• Εξηγείς το "γιατί" πίσω από κάθε σύσταση
• Μιλάς με την εμπειρία 15+ χρόνων στο χώρο

ΟΔΗΓΙΕΣ:
• Να είσαι specific και actionable
• Να προτείνεις concrete steps
• Να αναφέρεις expected results
• Να δίνεις realistic timeframes
• Να εξηγείς τη στρατηγική πίσω από κάθε πρόταση`;
  }

  private buildUserPrompt(request: AIRequest): string {
    const context = request.context ? `\n\nΣΥΓΚΕΚΡΙΜΕΝΟ CONTEXT:\n${request.context}` : '';
    
    return `${request.prompt}${context}

Παρακαλώ απάντησε ως expert media buyer με πάνω από 15 χρόνια εμπειρία. Δώσε concrete, actionable recommendations.`;
  }

  private calculateConfidence(content: string): number {
    // Simple confidence calculation based on response characteristics
    let confidence = 85; // Base confidence for Claude responses

    // Increase confidence for detailed responses
    if (content.length > 200) confidence += 5;
    if (content.includes('€') || content.includes('%')) confidence += 3;
    if (content.includes('campaign') || content.includes('καμπάνια')) confidence += 2;
    if (content.includes('ROAS') || content.includes('ROI')) confidence += 3;

    return Math.min(confidence, 97); // Cap at 97%
  }

  private getMockResponse(request: AIRequest, startTime: number): AIResponse {
    const mockResponses = this.getExpertMockResponses();
    const lowerPrompt = request.prompt.toLowerCase();
    
    let selectedResponse = mockResponses.find(response => 
      response.triggers.some(trigger => lowerPrompt.includes(trigger))
    )?.response || mockResponses[0].response;

    const responseTime = Date.now() - startTime + Math.random() * 1000; // Simulate API delay

    return {
      content: selectedResponse,
      confidence: 75 + Math.random() * 15, // 75-90% for mock responses
      responseTime,
      isFromAI: false
    };
  }

  private getExpertMockResponses() {
    return [
      {
        triggers: ['budget', 'scaling', 'αύξηση', 'scale'],
        response: `💡 **Expert Budget Scaling Strategy:**

🎯 **Για σωστό budget scaling:**
• Αύξηση μέχρι 20% κάθε 3 ημέρες (20% rule)
• Monitor ROAS για 48-72 ώρες μετά από κάθε αύξηση
• Εάν ROAS μένει stable ή βελτιώνεται → συνέχισε scaling
• Εάν ROAS πέφτει >15% → επιστροφή στο προηγούμενο budget

📊 **Βάσει της εμπειρίας μου:**
• Sweet spot: ROAS >3.5x για aggressive scaling
• Conservative scaling: ROAS 2.5-3.5x
• Σταμάτα scaling: ROAS <2.0x

⚡ **Next Steps:**
1. Ξεκίνα με +20% αύξηση
2. Monitor performance 72 ώρες
3. Εάν stable → επόμενη αύξηση 20%
4. Target: 3x current budget σε 3 εβδομάδες`
      },
      {
        triggers: ['creative', 'fatigue', 'ads', 'διαφημίσεις'],
        response: `🎨 **Creative Fatigue Analysis & Strategy:**

🚨 **Σημάδια Creative Fatigue:**
• CTR μείωση >20% σε 7 ημέρες
• CPM αύξηση >25%
• Frequency >4-5 impressions per user
• Comment quality degradation

💡 **Expert Solution (15+ χρόνια εμπειρία):**
• Rotate creatives κάθε 7-10 ημέρες
• 5-7 νέα creative variants εβδομαδιαίως
• UGC approach: +40% higher convert rates
• Video content: 3x higher engagement

🎯 **Immediate Action Plan:**
1. Pause underperforming creatives (CTR <1.5%)
2. Launch 3 νέα UGC-style videos
3. Test 2 image variations
4. Implement automatic creative rotation`
      },
      {
        triggers: ['audience', 'targeting', 'κοινό', 'lookalike'],
        response: `🎯 **Advanced Audience Targeting Strategy:**

👥 **Optimal Audience Mix (proven formula):**
• Lookalike 1-3%: 60% του budget
• Interest-based: 25% του budget  
• Retargeting: 15% του budget

🧠 **Expert Insights:**
• Lookalike >5%: ποιότητα drops dramatically
• Custom Audiences: highest ROAS αλλά limited scale
• Broad targeting + automatic placements = 2024 gold standard

📊 **Implementation Strategy:**
1. Create Lookalike 1% (core customers)
2. Expand σε 2-3% όταν 1% saturated
3. Layer behavior-based interests
4. Always exclude existing customers

⚡ **Expected Results:**
• 30-50% lower CPA
• 2x larger potential reach
• More stable performance`
      },
      {
        triggers: ['roas', 'performance', 'απόδοση', 'roi'],
        response: `📈 **Performance Optimization Expert Analysis:**

🎯 **ROAS Benchmarks (βάσει 15ετούς εμπειρίας):**
• Excellent: >4.0x ROAS
• Good: 2.5-4.0x ROAS  
• Acceptable: 2.0-2.5x ROAS
• Needs work: <2.0x ROAS

⚡ **Performance Boost Strategy:**
• Optimize top 20% campaigns: +60% budget
• Pause bottom 20%: redistribute budget
• Focus σε high-intent keywords/audiences
• Implement dynamic product ads

🚀 **Next Level Tactics:**
1. Multi-touch attribution analysis
2. Customer lifetime value optimization
3. Cross-platform remarketing sequences
4. Automated bid adjustments

💰 **Expected Impact:**
• 25-40% ROAS improvement σε 30 ημέρες
• 50% budget efficiency gain
• Sustainable long-term growth`
      },
      {
        triggers: ['platform', 'facebook', 'google', 'meta', 'πλατφόρμα'],
        response: `🌐 **Multi-Platform Strategy (15+ χρόνια εμπειρία):**

📱 **Platform Allocation Blueprint:**
• Facebook/Meta: 50-60% (awareness + retargeting)
• Google Ads: 25-30% (high-intent search)
• TikTok: 10-15% (younger demographics)
• LinkedIn: 5-10% (B2B targeting)

🎯 **Platform-Specific Strategies:**

**Facebook/Meta:**
• Broad targeting με automatic placements
• Video content prioritization
• Stories + Reels για younger audience

**Google Ads:**
• Search campaigns: exact match keywords
• Shopping campaigns: product-focused
• YouTube ads: brand awareness

**TikTok:**
• Native, entertaining content
• Trend-based creative strategy
• Younger demographic focus

💡 **Pro Tip:**
Unified tracking across platforms για accurate attribution!`
      }
    ];
  }

  // Campaign analysis with Claude
  async analyzeCampaignPerformance(campaignData: any): Promise<AIResponse> {
    const context = `
Campaign Data:
- ROAS: ${campaignData.roas || 'N/A'}
- CTR: ${campaignData.ctr || 'N/A'}%
- CPC: €${campaignData.cpc || 'N/A'}
- Conversions: ${campaignData.conversions || 'N/A'}
- Spend: €${campaignData.spend || 'N/A'}
- Platform: ${campaignData.platform || 'Mixed'}
    `;

    return this.generateResponse({
      prompt: 'Αναλύζω την απόδοση αυτής της καμπάνιας. Τι προτείνεις για βελτιστοποίηση;',
      context,
      maxTokens: 800
    });
  }

  // Budget optimization with Claude
  async optimizeBudget(budgetData: any): Promise<AIResponse> {
    const context = `
Current Budget Allocation:
${Object.entries(budgetData).map(([platform, budget]) => 
  `- ${platform}: €${budget}`
).join('\n')}
    `;

    return this.generateResponse({
      prompt: 'Βάσει αυτής της budget allocation, πώς μπορώ να βελτιστοποιήσω για καλύτερο ROI;',
      context,
      maxTokens: 1000
    });
  }

  // Creative analysis with Claude
  async analyzeCreatives(creativeData: any[]): Promise<AIResponse> {
    const context = `
Creative Performance Data:
${creativeData.map((creative, index) => 
  `${index + 1}. ${creative.name}: CTR ${creative.ctr}%, CPC €${creative.cpc}`
).join('\n')}
    `;

    return this.generateResponse({
      prompt: 'Αναλύζω την απόδοση αυτών των creatives. Ποια χρειάζονται αντικατάσταση και τι νέα creatives προτείνεις;',
      context,
      maxTokens: 800
    });
  }

  isConnected(): boolean {
    return this.isInitialized && this.anthropic !== null;
  }

  getConnectionStatus(): string {
    if (this.isConnected()) {
      return 'Συνδεδεμένο με Claude AI ✅';
    } else if (this.apiKey) {
      return 'Σφάλμα σύνδεσης με Claude AI ❌';
    } else {
      return 'Claude API key δεν έχει οριστεί 🔑';
    }
  }
}

// Singleton instance
export const claudeAI = new ClaudeAIService();
export default claudeAI;