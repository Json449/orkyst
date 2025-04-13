"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let CalendarService = class CalendarService {
    constructor() {
        this.apiKey = 'YOUR_DEEPSEEK_API_KEY';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
    }
    async generateCalendar(userInput) {
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
            const response = await axios_1.default.post(this.apiUrl, {
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const generatedCalendar = JSON.parse(response.data.choices[0].message.content);
            return generatedCalendar;
        }
        catch (error) {
            console.error('Error calling DeepSeek API:', error);
            throw new Error('Failed to generate calendar');
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)()
], CalendarService);
//# sourceMappingURL=calendar.service-deepseek.js.map