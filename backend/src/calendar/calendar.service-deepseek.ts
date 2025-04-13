import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CalendarService {
  private readonly apiKey: string = 'YOUR_DEEPSEEK_API_KEY'; // Replace with your DeepSeek API key
  private readonly apiUrl: string =
    'https://api.deepseek.com/v1/chat/completions'; // Example DeepSeek API endpoint

  async generateCalendar(userInput: any): Promise<any> {
    const prompt = `You are a calendar planning assistant. Based on the user's input, generate a detailed calendar for the month with events and activities. Here are the user's answers:

1. **Who is this calendar for?**  
   Answer: ${userInput.forWhom}

2. **What is the primary focus or theme of the month?**  
   Answer: ${userInput.theme}

3. **What type of content or activities should be included?**  
   Answer: ${userInput.contentTypes}

4. **What are the key dates or deadlines?**  
   Answer: Product Launch on ${userInput.keyDates}

5. **Do you have a website or platform to integrate with?**  
   Answer: ${userInput.website}

Based on this information, generate a calendar with the following details:
- **Event Titles**: Use descriptive titles that align with the theme and content type.
- **Event Dates**: Schedule events on appropriate dates, considering deadlines and key dates.
- **Event Descriptions**: Provide a brief description of each event (e.g., "Blog Post on AI Trends").
- **Event Types**: Categorize events by type (e.g., Blog, Social Media Post, Webinar).

Return the calendar in the following JSON format:
{
  "month": "November 2023",
  "theme": "[Theme]",
  "events": [
    {
      "title": "[Event Title]",
      "date": "[Event Date]",
      "description": "[Event Description]",
      "type": "[Event Type]"
    }
  ]
}`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat', // Replace with the correct DeepSeek model name
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      // Extract the generated calendar from the response
      const generatedCalendar = JSON.parse(
        response.data.choices[0].message.content,
      );
      return generatedCalendar;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw new Error('Failed to generate calendar');
    }
  }
}
