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
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Unable to process your request at the moment. Please try again.');
    }
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
    } catch (error) {
      console.error('Chat Support Error:', error);
      throw new Error('I apologize, but I\'m having trouble responding right now. Please contact our human support team for immediate assistance.');
    }
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