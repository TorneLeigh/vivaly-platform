import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CareRecommendationInput {
  childAge?: number;
  careType: 'nanny' | 'childcare' | 'elderly' | 'disability' | 'companionship';
  location: string;
  specialNeeds?: string;
  budget?: number;
  schedule?: string;
  experience?: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  caregiverIds?: number[];
  followUpQuestions?: string[];
}

export class AIService {
  
  async getCareRecommendations(input: CareRecommendationInput): Promise<AIResponse> {
    const systemPrompt = `You are VIVALY's AI care consultant, helping Australian families find the perfect care services. 
    
    Your role is to:
    - Provide personalized care recommendations
    - Ask clarifying questions to better understand needs
    - Suggest specific care types and requirements
    - Be warm, professional, and supportive
    
    Always focus on safety, qualifications, and matching families with the right care providers.`;

    const userPrompt = `I need help finding care services with these details:
    - Care Type: ${input.careType}
    - Location: ${input.location}
    ${input.childAge ? `- Child Age: ${input.childAge} years` : ''}
    ${input.specialNeeds ? `- Special Needs: ${input.specialNeeds}` : ''}
    ${input.budget ? `- Budget: $${input.budget}/hour` : ''}
    ${input.schedule ? `- Schedule: ${input.schedule}` : ''}
    ${input.experience ? `- Experience Required: ${input.experience}` : ''}
    
    Please provide personalized recommendations and ask any clarifying questions that would help me find the best care.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        message: response.message || "I'd be happy to help you find the perfect care service.",
        suggestions: response.suggestions || [],
        followUpQuestions: response.followUpQuestions || []
      };
    } catch (error: any) {
      console.error('AI Service Error:', error);
      
      // Always return demo recommendations when OpenAI API fails
      console.log('OpenAI API error, falling back to demo recommendations');
      return this.getDemoCareRecommendations(input);
    }
  }

  private getDemoCareRecommendations(input: CareRecommendationInput): AIResponse {
    const { careType, location, childAge, budget, specialNeeds } = input;
    
    let message = `Based on your needs for ${careType} care in ${location}, here are my recommendations:\n\n`;
    let suggestions: string[] = [];
    let followUpQuestions: string[] = [];

    if (careType === 'nanny') {
      message += `For nanny services${childAge ? ` for your ${childAge}-year-old` : ''}, I recommend:\n\n`;
      suggestions = [
        "Look for nannies with WWCC and first aid certification",
        "Consider experience with your child's age group",
        "Check references from other families",
        "Arrange a meet-and-greet before booking",
        `Budget range: ${budget ? `$${budget}` : '$25-40'}/hour is typical in ${location}`
      ];
      
      if (specialNeeds) {
        suggestions.push(`Ensure the nanny has experience with ${specialNeeds}`);
      }
      
      followUpQuestions = [
        "What days and hours do you need care?",
        "Do you prefer live-in or live-out arrangements?",
        "Are there any specific activities you'd like included?",
        "Do you need help with meal preparation or light housework?"
      ];
    } else if (careType === 'childcare') {
      message += `For childcare center options${childAge ? ` for your ${childAge}-year-old` : ''}, I suggest:\n\n`;
      suggestions = [
        "Visit centers to assess facilities and staff",
        "Check National Quality Standard ratings",
        "Inquire about educator-to-child ratios",
        "Ask about curriculum and learning programs",
        "Consider location and operating hours"
      ];
      
      followUpQuestions = [
        "How many days per week do you need care?",
        "What are your preferred drop-off and pick-up times?",
        "Are there specific educational approaches you prefer?",
        "Do you need holiday care services?"
      ];
    } else if (careType === 'elderly' || careType === 'aged care') {
      message += `For aged care support in ${location}, I recommend:\n\n`;
      suggestions = [
        "Choose carers with aged care experience and training",
        "Ensure they have current first aid and medication training",
        "Look for compassionate, patient personalities",
        "Consider both companionship and practical care needs",
        "Check insurance and background verification"
      ];
      
      followUpQuestions = [
        "What level of care assistance is needed?",
        "Are there any specific medical conditions to consider?",
        "What are the preferred days and times for care?",
        "Is transport to appointments needed?"
      ];
    } else {
      suggestions = [
        "Verify all carers have appropriate background checks",
        "Read reviews from other families carefully",
        "Arrange initial consultations before committing",
        "Ensure clear communication about expectations",
        "Confirm insurance coverage and emergency procedures"
      ];
      
      followUpQuestions = [
        "What specific care requirements do you have?",
        "What is your preferred schedule?",
        "Are there any special considerations I should know about?"
      ];
    }

    message += `*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;

    return {
      message,
      suggestions,
      followUpQuestions
    };
  }

  async provideChatSupport(messages: ChatMessage[]): Promise<string> {
    const systemPrompt = `You are VIVALY's customer support AI assistant for Australia's leading care marketplace. 
    
    You help with:
    - Finding care services (nannies, childcare, elderly care, disability support, companionship)
    - Booking and scheduling questions
    - Safety and verification information
    - Platform navigation and features
    - Emergency contact procedures
    
    Always be:
    - Warm and empathetic
    - Professional and knowledgeable
    - Focused on safety and quality care
    - Helpful with specific actionable advice
    
    If you cannot help with something, direct users to contact human support.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.6,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "I'm here to help! How can I assist you with your care needs today?";
    } catch (error: any) {
      console.error('Chat Support Error:', error);
      
      // Check if it's a quota/billing error and provide demo response
      if (error?.status === 429 || error?.code === 'insufficient_quota' || 
          (error?.message && (error.message.includes('quota') || error.message.includes('billing')))) {
        console.log('OpenAI quota exceeded, using demo response');
        return this.getDemoResponse(messages);
      }
      
      // For other errors, return the demo response as well for now
      console.log('OpenAI API error, falling back to demo response');
      return this.getDemoResponse(messages);
    }
  }

  private getDemoResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    if (lastMessage.includes('nanny') || lastMessage.includes('babysitter')) {
      return `I'd be happy to help you find a nanny! Here are some key things to consider:

• **Background checks**: All VIVALY nannies undergo comprehensive WWCC and police checks
• **Experience level**: We can match you with nannies who have experience with your child's age group
• **Location**: We have qualified nannies across Sydney, Melbourne, Brisbane, and other major cities
• **Scheduling**: From casual babysitting to full-time care arrangements

Would you like me to help you search for nannies in your area? I can also provide safety tips for interviewing potential caregivers.

*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;
    }
    
    if (lastMessage.includes('childcare') || lastMessage.includes('daycare')) {
      return `Great question about childcare options! Here's what VIVALY offers:

• **Licensed centers**: We partner with fully accredited childcare facilities
• **Age-appropriate programs**: From infant care to school-age programs
• **Flexible scheduling**: Full-time, part-time, or casual care options
• **Quality assurance**: All centers meet Australian National Quality Standards

I can help you find centers in your area and explain our enrollment process. What age is your child and which suburb are you looking in?

*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;
    }
    
    if (lastMessage.includes('elderly') || lastMessage.includes('aged care')) {
      return `I understand you're looking for elderly care services. VIVALY offers:

• **Companion care**: Social interaction and light assistance
• **Personal care**: Help with daily activities and mobility
• **Respite care**: Support for family caregivers
• **24/7 availability**: Emergency and overnight care options

All our aged care providers are trained, insured, and background-checked. Would you like information about services in your area?

*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;
    }
    
    if (lastMessage.includes('safety') || lastMessage.includes('verification')) {
      return `Safety is our top priority at VIVALY. Here's how we ensure secure care:

• **Thorough screening**: Working with Children Checks, police clearances, and reference verification
• **Insurance coverage**: All caregivers carry professional indemnity insurance
• **Real-time updates**: GPS tracking and regular check-ins during care sessions
• **24/7 support**: Emergency helpline always available
• **Review system**: Transparent feedback from other families

Would you like specific safety tips for interviewing caregivers or setting up care arrangements?

*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;
    }
    
    // Default helpful response
    return `Hello! I'm VIVALY's AI assistant. I'm here to help you with:

• Finding qualified nannies and caregivers
• Exploring childcare center options
• Understanding our safety and verification processes
• Booking and scheduling care services
• Emergency care arrangements

What specific care needs can I help you with today? Just let me know your location and the type of care you're looking for.

*Note: This is a demo response. Full AI features will be available once OpenAI billing is configured.*`;
  }

  async generateCaregiverProfile(caregiverData: {
    name: string;
    experience: string;
    specialties: string[];
    certifications: string[];
    personality?: string;
  }): Promise<string> {
    const prompt = `Create a warm, professional bio for this caregiver on VIVALY's platform:
    
    Name: ${caregiverData.name}
    Experience: ${caregiverData.experience}
    Specialties: ${caregiverData.specialties.join(', ')}
    Certifications: ${caregiverData.certifications.join(', ')}
    ${caregiverData.personality ? `Personality: ${caregiverData.personality}` : ''}
    
    Write a 2-3 paragraph bio that highlights their qualifications, experience, and what makes them special. 
    Make it personal and trustworthy for Australian families.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0].message.content || "Experienced and caring professional ready to provide exceptional care services.";
    } catch (error) {
      console.error('Profile Generation Error:', error);
      throw new Error('Unable to generate profile at this time.');
    }
  }

  async analyzeFeedback(feedback: string, rating: number): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
    improvementSuggestions?: string[];
  }> {
    const prompt = `Analyze this care service feedback and provide insights in JSON format:
    
    Rating: ${rating}/5 stars
    Feedback: "${feedback}"
    
    Please analyze and return:
    {
      "sentiment": "positive/neutral/negative",
      "keyThemes": ["theme1", "theme2", ...],
      "improvementSuggestions": ["suggestion1", "suggestion2", ...] (only if negative/neutral)
    }`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        sentiment: analysis.sentiment || 'neutral',
        keyThemes: analysis.keyThemes || [],
        improvementSuggestions: analysis.improvementSuggestions || []
      };
    } catch (error) {
      console.error('Feedback Analysis Error:', error);
      return {
        sentiment: 'neutral',
        keyThemes: ['Unable to analyze'],
        improvementSuggestions: []
      };
    }
  }

  async generateSafetyTips(careType: string, childAge?: number): Promise<string[]> {
    const prompt = `Generate 5-7 important safety tips for ${careType} care${childAge ? ` for ${childAge}-year-old children` : ''}.
    
    Focus on practical, actionable advice that caregivers and families should know.
    Return as a JSON array of strings.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return response.tips || [
        "Always verify caregiver credentials and references",
        "Establish clear emergency procedures and contacts",
        "Maintain open communication throughout care sessions"
      ];
    } catch (error) {
      console.error('Safety Tips Error:', error);
      return [
        "Always verify caregiver credentials and references",
        "Establish clear emergency procedures and contacts",
        "Maintain open communication throughout care sessions"
      ];
    }
  }
}

export const aiService = new AIService();