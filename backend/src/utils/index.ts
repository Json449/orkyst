export const twitterPrompt = (title, audienceFocus, theme, date) => {
  return `
      You are tasked with creating a concise and engaging Twitter post titled *"${title}"*. The post should educate and inspire ${audienceFocus} about the benefits and relevance of ${theme}. The content must be tailored to Twitter's platform, focusing on brevity, hashtags, mentions, and a strong call-to-action. Ensure the following:
          
          1. **Output Format:**
             - The response must be formatted as a JSON object with a single key "html".
             - The tweet should be no longer than 280 characters (including hashtags and mentions).
             - Use HTML tags for formatting (e.g., <p>, <strong>, <a>, <span>).
             - Use Tailwind CSS classes for styling (e.g., text-blue-600, font-bold).
             - Include hashtags relevant to the theme and audience (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).
             - Include a call-to-action (e.g., "Learn more:", "Join us:", "Share your thoughts:").
             - If applicable, mention relevant accounts (e.g., @YourBrand, @IndustryLeader).
          
          2. **Introduction:**
             - Start with a compelling hook that grabs attention and highlights the importance of ${theme} for ${audienceFocus}.
             - Keep it concise and engaging (1-2 sentences).
          
          3. **Key Message:**
             - Provide a clear and concise message about ${theme}.
             - Use simple language and avoid jargon.
             - Include a real-life example, analogy, or statistic if it fits within the character limit.
          
          4. **Call-to-Action (CTA):**
             - Encourage engagement (e.g., retweet, like, reply, or click a link).
             - Use action-oriented language (e.g., "Discover how", "Join the conversation", "Share your story").
          
          5. **Hashtags and Mentions:**
             - Include 2-3 relevant hashtags (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).
             - Mention relevant accounts if applicable (e.g., @YourBrand, @IndustryLeader).
          
          Here is the input data:
          - **Title:** ${title}
          - **Date:** ${date}
          - **Audience Focus:** ${audienceFocus}
          - **Type:** Twitter Post
          - **Theme:** ${theme}
          
          ### **Additional Rules:**
          - If the theme is non-business (e.g., Islamic, cultural, or personal development), focus on relatable stories, inspirational quotes, or actionable tips.
          - Ensure the tweet is concise, engaging, and optimized for Twitter's platform.
          
          ### **Output Format:**
          {
            "html": "[Your tweet here, formatted with HTML tags]"
          }
          `;
};

export const blogPostPrompt = (title, audienceFocus, theme, date) => {
  return `
   You are tasked with creating a detailed and insightful blog post titled *"${title}"*. The post should educate and inspire ${audienceFocus} about the benefits and relevance of ${theme}. The content must include real stories, examples, actionable insights, and a call-to-action, all tailored to the specified audience and theme. Ensure the following:

   1. **Output Format:**
      - The response must be formatted using HTML tags for headings, paragraphs, lists, and links.
      - Use Tailwind CSS classes for styling.
      - Use <h1 class="text-4xl font-bold mb-4"> for the main title.
      - Use <h2 class="text-3xl font-semibold mt-6 mb-2"> for section headings.
      - Use <p class="text-lg mb-4"> for paragraphs.
      - Use <ul class="list-disc list-inside mb-4"> for unordered lists.
      - Use <li class="mb-2"> for list items.
      - Use <a class="text-blue-600 hover:underline" href="[URL]"> for links.

   2. **Introduction:**
      - Start with a compelling hook that highlights the importance of ${theme} for ${audienceFocus}.
      - Briefly introduce the theme of the blog post.
      - State the purpose of the content (e.g., to inspire, educate, or provide actionable insights).

   3. **Real Stories and Examples:**
      - Include 2-3 real-life examples or analogies that align with the theme.
      - For each example, provide:
        - Context: The situation or challenge.
        - Solution: The approach or strategy used.
        - Results: The measurable or impactful outcomes achieved.
      - If the theme is non-business (e.g., Islamic, cultural, or personal development), use relatable stories, historical examples, or case studies.

   4. **Actionable Insights:**
      - Summarize the key takeaways from the examples.
      - Provide practical advice or steps that the audience can implement in their own lives or work.

   5. **Call-to-Action:**
      - Encourage readers to engage further (e.g., comment, share, or take specific steps).

   6. **Conclusion:**
      - Reinforce the importance of ${theme} for ${audienceFocus}.
      - End with an inspiring message about the future or a thought-provoking question.

   Here is the input data:
   - **Title:** ${title}
   - **Date:** ${date}
   - **Audience Focus:** ${audienceFocus}
   - **Type:** Blog Post
   - **Theme:** ${theme}

   ### **Additional Rules:**
   - If the theme is non-business (e.g., Islamic, cultural, or personal development), focus on relatable stories, historical examples, or inspirational narratives.
   - Format the output as a structured JSON object.

   ### **Output Format:**
   {
     "html": "[body]"
   }
 `;
};

export const linkedInPrompt = (title, audienceFocus, theme, date) => {
  return `
   You are tasked with creating a professional and engaging LinkedIn post titled *"${title}"*. The post should educate and inspire ${audienceFocus} about the benefits and relevance of ${theme}. The content must be tailored to LinkedIn's platform, focusing on professional insights, storytelling, and actionable advice. Ensure the following:
   
   1. **Output Format:**
      - The response must be formatted as a JSON object with a single key "html".
      - Use HTML tags for formatting (e.g., <h1>, <p>, <ul>, <li>, <a>).
      - Use Tailwind CSS classes for styling (e.g., text-xl, font-bold, text-blue-600, hover:underline).
      - Include a clear call-to-action (CTA) to encourage engagement (e.g., "Share your thoughts", "Comment below", "Let’s discuss").
      - If applicable, mention relevant hashtags (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).
   
   2. **Introduction:**
      - Start with a compelling hook that grabs attention and highlights the importance of ${theme} for ${audienceFocus}.
      - Briefly introduce the topic and its relevance to the audience.
   
   3. **Key Message:**
      - Provide a clear and professional message about ${theme}.
      - Use storytelling, data, or examples to make the post relatable and impactful.
      - Include actionable insights or advice that the audience can apply in their professional lives.
   
   4. **Call-to-Action (CTA):**
      - Encourage engagement by asking a question, inviting comments, or prompting shares.
      - Use professional language (e.g., "I’d love to hear your thoughts", "Let’s start a conversation", "What’s your take on this?").
   
   5. **Hashtags:**
      - Include 2-3 relevant hashtags (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).
      - Place hashtags at the end of the post for better readability.
   
   Here is the input data:
   - **Title:** ${title}
   - **Date:** ${date}
   - **Audience Focus:** ${audienceFocus}
   - **Type:** LinkedIn Post
   - **Theme:** ${theme}
   
   ### **Additional Rules:**
   - If the theme is non-business (e.g., personal development, cultural, or inspirational), focus on relatable stories, professional growth tips, or motivational insights.
   - Ensure the post is professional, engaging, and optimized for LinkedIn's platform.
   
   ### **Output Format:**
   {
     "html": "[Your LinkedIn post here, formatted with HTML tags]"
   }
   `;
};

export const defaultPrompt = (title, audienceFocus, theme, date, platform) => {
  return `
You are tasked with creating a social media post titled *"${title}"* for the platform *${platform}*. The post should educate and inspire ${audienceFocus} about the benefits and relevance of ${theme}. The content must be tailored to the platform's unique requirements, focusing on tone, structure, and engagement strategies. Ensure the following:

1. **Output Format:**
   - The response must be formatted as a JSON object with a single key "html".
   - Use HTML tags for formatting (e.g., <h1>, <p>, <ul>, <li>, <a>).
   - Use Tailwind CSS classes for styling (e.g., text-xl, font-bold, text-blue-600, hover:underline).
   - Include a clear call-to-action (CTA) to encourage engagement (e.g., "Share your thoughts", "Comment below", "Let’s discuss").
   - If applicable, mention relevant hashtags (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).

2. **Platform-Specific Guidelines:**
   - **Twitter**: Keep the post concise (280 characters max). Use hashtags and mentions strategically.
   - **LinkedIn**: Use a professional tone. Focus on storytelling, actionable insights, and professional growth.
   - **Instagram**: Use a visually appealing tone. Include emojis and focus on storytelling.
   - **Facebook**: Use a conversational tone. Focus on community engagement and relatability.
   - **Other Platforms**: Adapt the tone and structure to match the platform's audience and style.

3. **Introduction:**
   - Start with a compelling hook that grabs attention and highlights the importance of ${theme} for ${audienceFocus}.
   - Briefly introduce the topic and its relevance to the audience.

4. **Key Message:**
   - Provide a clear and platform-appropriate message about ${theme}.
   - Use storytelling, data, or examples to make the post relatable and impactful.
   - Include actionable insights or advice that the audience can apply.

5. **Call-to-Action (CTA):**
   - Encourage engagement by asking a question, inviting comments, or prompting shares.
   - Use platform-appropriate language (e.g., "What’s your take on this?", "Double-tap if you agree", "Let’s start a conversation").

6. **Hashtags and Mentions:**
   - Include 2-3 relevant hashtags (e.g., #${theme.replace(/\s+/g, '')}, #${audienceFocus.replace(/\s+/g, '')}).
   - Mention relevant accounts if applicable (e.g., @YourBrand, @IndustryLeader).

Here is the input data:
- **Title:** ${title}
- **Date:** ${date}
- **Audience Focus:** ${audienceFocus}
- **Platform:** ${platform}
- **Theme:** ${theme}

### **Additional Rules:**
- If the theme is non-business (e.g., personal development, cultural, or inspirational), focus on relatable stories, growth tips, or motivational insights.
- Ensure the post is optimized for the specified platform's tone, style, and audience.

### **Output Format:**
{
  "html": "[Your social media post here, formatted with HTML tags]"
}
`;
};

export const generateAdvancedCalendarPrompt = (
  input,
  currentMonth,
  currentYear,
) => {
  return `
    You are a **world-class content strategist and calendar planning expert**. Based on the user's detailed inputs, generate a **highly-targeted content calendar** for ${currentMonth} ${currentYear} with **engaging, platform-optimized content ideas**. Here are the user's specifications:
    
    ### Business Profile:
    1. **Who is this for?** 
       ${input.whoIsThisFor || 'Not specified'}
    
    2. **Business Type:** 
       ${input.businessType || 'Not specified'}
    
    3. **Target Audience:** 
       ${input.targetAudience || 'Not specified'}
    
    ### Marketing Strategy:
    4. **Primary Marketing Goals:** 
       ${input.marketingGoals?.join(', ') || 'Not specified'}
    
    5. **Content Platforms:** 
       ${input.domains?.join(', ') || 'Not specified'}
    
    6. **Posting Frequency:** 
       ${input.postingFrequency?.join(', ') || 'Not specified'}
    
    7. **Preferred Content Types:** 
       ${input.preferredContentType?.join(', ') || 'Not specified'}
    
    ### Content Strategy Framework:
    Develop content themes that combine:
    - **Business objectives** with **audience needs**
    - **Platform best practices** for each specified channel
    - **Cultural relevance** based on audience location
    - **Seasonal opportunities** for ${currentMonth}
    
    For each content piece, consider:
    1. **Platform-Specific Optimization**:
       - LinkedIn: Professional tone, industry insights
       - Facebook: Community-focused, shareable content
       - Instagram: Visual storytelling, reels/carousel posts
       - Blog Articles: SEO-optimized, long-form value
    
    2. **Content Pillars** (based on marketing goals):
       ${input.marketingGoals?.map((goal) => `- ${goal}: ${getContentApproach(goal)}`).join('\n   ') || 'Not specified'}
    
    3. **Posting Rhythm**:
       - Light (1-2x/week): Focus on high-impact pieces
       - Medium (3-4x/week): Mix of educational and promotional
       - Heavy (5+x/week): Include engagement-focused quick content
    
    ### Content Generation Guidelines:
    Create a detailed calendar with:
    - **Platform-specific** content tailored to each channel's strengths
    - **Goal-aligned** posts that drive measurable results
    - **Audience-centric** messaging that resonates
    - **Varied formats** to maintain engagement
    
    For each content piece include:
    1. **Title**: Platform-optimized, attention-grabbing (include emojis where appropriate)
    2. **Date**: In "YYYY-MM-DD" format with logical spacing between posts
    3. **Platform**: Specific platform with content type (e.g., "LinkedIn carousel")
    4. **Content Focus**: Primary goal this addresses
    5. **Key Message**: Core value proposition
    6. **Suggested Visuals**: Type of media to use
    7. **Call-to-Action**: Clear next step for audience

    - Format the output as a structured JSON object.
    ### Output Requirements:
    {
      "month": "${currentMonth}-${currentYear}",
      "contentStrategy": "[Brief overview of the monthly strategy]",
      "theme": "[Primary Theme (Regional Focus)]",
      "events": [
        {
          "title": "[Platform-specific optimized title]",
          "date": "YYYY-MM-DD",
          "type": "[Event Type]",
          "audienceFocus": "[Primary marketing goal addressed]",
          "theme": "[Core value proposition]",
        }
      ],
    }
    
    ### Special Considerations:
    - For B2B: Focus on thought leadership and case studies
    - For B2C: Emphasize benefits and emotional connection
    - Blend educational, promotional, and engagement content as specified
    - Maintain consistent branding across all platforms
    `;

  function getContentApproach(goal) {
    const approaches = {
      'Increase Brand awareness':
        'Storytelling, viral hooks, shareable content',
      'Generate more leads': 'Lead magnets, gated content, strong CTAs',
      'Increase social media engagement': 'Polls, questions, UGC prompts',
      'Boost sales/conversions': 'Product highlights, testimonials, offers',
      'Improve customers retention':
        'Loyalty content, how-tos, community building',
    };
    return approaches[goal] || 'Content that aligns with this objective';
  }
};

export const generateCalendarPrompt = (input, currentMonth, currentYear) => {
  return `
 You are a **creative content strategist and calendar planning assistant**. Based on the user's input, generate a **detailed content calendar** for the current month (${currentMonth}-${currentYear}) with **precise, engaging, and high-impact event titles**. Here are the user's answers:
 
 1. **Are you creating this content calendar for a company, personal brand, or another initiative?**
    Answer: ${input.whoIsThisFor}
 
 2. **What is the business type?**
    Answer: ${input.businessType}
 
 3. **What region is your audience located in, and are there any holidays or events this month you’d like to highlight?**
    Answer: ${input.targetAudience}
 
 4. **What is the primary theme or message you want to emphasize this month?**
    Answer: **[INTERACTIVE THEME GENERATION WITH REGIONAL RELEVANCE]**  
    To help you define a **unique and impactful theme**, please consider the following prompts:
    - **Emotionally Driven**: How do you want your audience to feel after seeing your content? (e.g., excited, motivated, inspired, curious)
    - **Challenge or Opportunity**: Is there a current trend or challenge your audience is facing in the **Middle East, US, or Europe** that you can address? Or, is there an opportunity you're providing that can help them solve a problem or meet a goal?
    - **Connection with Audience**: What kind of relationship do you want to build with your audience through your content? Do you want them to see you as an expert, a friend, a guide, or an advocate for their journey? (Consider regional nuances in communication style and needs)
    - **Seasonal or Time-Sensitive**: Is your theme related to a specific season, holiday, or time-bound event in the **Middle East, US, or Europe**? For example, Ramadan in the Middle East, Back-to-School in the US, or Summer Festivals in Europe?
    - **Cultural Relevance**: How does your theme align with the cultural norms, values, or current issues in the region? For example, AI adoption in SMBs in the US or the impact of AI on businesses in the Middle East.
    Answer with a **theme** that resonates deeply with the **specific region's mood, challenges, and opportunities**.
 
 5. **What types of content do you prefer to post? **
    Answer: ${input.domains?.join(', ')}
 
 6. **How often would you like to post? **
    Answer: ${input.postingFrequency?.join(', ')}
 
 7. **What are your primary marketing goals?**
    Answer: ${input.marketingGoals?.join(', ')}
 
 8. **What types of content do you prefer to create?**
    Answer: ${input.preferredContentType?.join(', ')}
 
 ### **Instructions:**
 - Generate a **detailed content calendar** for the current month (${currentMonth}-${currentYear}).
 - Ensure the **title is highly engaging, precise, and impactful** by following these guidelines:
   - **Attention-Grabbing**: Use strong, emotionally engaging words relevant to the **target region**.
   - **Concise Yet Meaningful**: Keep it short but informative and regionally tailored.
   - **Optimized for SEO & Social Sharing**: Ensure it resonates with the audience's needs in the **Middle East, US, or Europe**.
   - **Formatted for Maximum Impact**: Use power words, numbers, or thought-provoking questions where relevant to the cultural context of the region.
 
 - **For each post, include:**
   - **Title**: A compelling and optimized title for the event or post (e.g., "The Ultimate Guide to Ramadan Reflection: How to Make the Most of the Holy Month" for the Middle East, or "Leveraging AI for SMB Growth: U.S. Market Insights" for the US).(include emojis where appropriate)
   - **Date**: The specific date for the event in "YYYY-MM-DD" format.
   - **Type**: The type of content (e.g., blog post, LinkedIn post, Twitter post, Instagram reel, YouTube video, podcast, etc.).
   - **Audience Focus**: The region or audience to target (Middle East, US, Europe).
   - **Theme**: The primary theme or message for the event, considering the cultural nuances and regional relevance.
 
 ### **Additional Rules:**
 - Ensure that the **titles are unique, thought-provoking, and engaging** for the **specified region**.
 - Maintain the **posting frequency** according to the user’s preference.
 - Format the output as a structured JSON object.
 
 ### **Output Format:**
 {
   "month": "[Month and Year]",
   "theme": "[Primary Theme (Regional Focus)]",
   "events": [
     {
       "title": "[Highly Engaging & Optimized Event Title (with Regional Focus)]",
       "date": "[YYYY-MM-DD]",
       "type": "[Event Type]",
       "audienceFocus": "[Audience Region]",
       "theme": "[Event Theme]"
     }
   ]
 }
 `;
};

export const eventSuggestionPrompt = (event) => {
  return `
   You are a content optimization assistant specializing in social media, blogs, and event planning. Based on the following details about my content calendar, provide actionable tips to improve it. Here is the context:
   
   1. **Content Type**: The content is for ${event.type} (e.g., blog, Twitter, LinkedIn, or social post).
   2. **Audience Region**: The target audience is located in ${event.audienceFocus}.
   3. **Primary Theme**: The theme for this content is "${event.theme}".
   4. **Current Content**: The content description is: "${event.description}".
   
   **Instructions**:
   1. Analyze the content and suggest improvements to make it more engaging, effective, and aligned with the theme.
   2. Provide specific tips on:
      - Content variety and diversity.
      - Audience engagement strategies.
      - Timing and frequency of posts.
      - Incorporating trends, holidays, or relevant events.
      - Improving descriptions, titles, or calls-to-action for better appeal.
   3. Suggest additional content ideas or events that could enhance the calendar.
   4. Focus on actionable and practical tips.
   
   **Output Format**:
   - Provide only 3 tips in a structured JSON format.
   - Each tip should include a brief explanation of why it is beneficial.
   - Provide only JSON output, no extra text.
   
   ### **Output Format:**
   {
     "tips": [
       {
         "title": "[Tip 1 Title]",
         "description": "[Brief explanation of why this tip is beneficial]"
       },
       {
         "title": "[Tip 2 Title]",
         "description": "[Brief explanation of why this tip is beneficial]"
       },
       {
         "title": "[Tip 3 Title]",
         "description": "[Brief explanation of why this tip is beneficial]"
       }
     ]
   }
   `;
};

export const calendarSuggestionPrompt = (calendarInputs) => `
Analyze this ${calendarInputs.category} content calendar targeting ${calendarInputs.audience} with theme "${calendarInputs.theme}". 
Current content: ${calendarInputs.contentTypes} posted ${calendarInputs.posting}.

Provide exactly 3 high-impact, data-specific suggestions as a plain array. Each suggestion must:
1. Address visible gaps/opportunities
2. Be actionable within 1-2 lines
3. Leverage the ${calendarInputs.theme} theme
4. Consider ${calendarInputs.audience} preferences

**Output Format**:
- Provide only 3 tips in a structured JSON format.
- Each tip should include a brief explanation of why it is beneficial.
- Provide only JSON output, no extra text.

### **Output Format:**
{
  "tips": [
    {
      "description": "[Brief explanation of why this tip is beneficial]"
    },
    {
      "description": "[Brief explanation of why this tip is beneficial]"
    },
    {
      "description": "[Brief explanation of why this tip is beneficial]"
    }
  ]
}
`;
export const imageGenerationPrompt = (theme, audience, contentType) => {
  return `Create an image that reflects the theme of "${theme}" for an audience of ${audience}. The content type is focused on ${contentType}. The image should capture the essence of ${theme} while being engaging and suitable for a ${audience} audience.`;
};
