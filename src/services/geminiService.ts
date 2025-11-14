

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async processEmailBody(email) {
    if (!this.apiKey) {
      console.warn('Gemini API key not provided. Returning original email.');
      return { ...email };
    }

    try {
      const prompt = `
        Please analyze the following email and extract the main message in a clear, concise format.
        Focus on:
        1. The main purpose or request
        2. Key information or details
        3. Any action items required
        4. Important deadlines or dates
        5. The overall tone and context

        Present the information in a well-structured, easy-to-read format using bullet points or clear paragraphs.
        Remove any unnecessary formatting, signatures, or irrelevant content.

        Email content:
        ${email.body}

        Please provide only the processed content without any additional commentary.
      `;

      const response = await fetch(
        `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const processedContent = data.candidates[0].content.parts[0].text;

      return {
        ...email,
        processedBody: processedContent.trim()
      };

    } catch (error) {
      console.error('Error processing email with Gemini:', error);
      throw new Error('Failed to process email with AI. Please try again later.');
    }
  }

  async generateEmailSummary(email) {
    if (!this.apiKey) {
      return 'AI summary not available - API key not configured';
    }

    try {
      const prompt = `
        Please provide a brief summary (2-3 sentences) of the following email:
        
        Subject: ${email.subject}
        From: ${email.sender}
        Content: ${email.body}
      `;

      const response = await fetch(
        `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 1,
              topP: 1,
              maxOutputTokens: 256,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();

    } catch (error) {
      console.error('Error generating email summary:', error);
      return 'Unable to generate summary';
    }
  }
}