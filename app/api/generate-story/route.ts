import { NextResponse } from 'next/server';

const STORY_PROMPTS = {
  colonel: {
    title: "The Colonel's Journey",
    prompt: "Write a calming, 3-paragraph bedtime story about Colonel Sanders' journey to creating KFC. Focus on his perseverance, traveling from restaurant to restaurant with his secret recipe, and finally achieving his dream. Make it warm, inspirational, and suitable for bedtime. Keep it under 200 words."
  },
  recipe: {
    title: "The Secret Recipe Mystery",
    prompt: "Write a gentle, 3-paragraph bedtime story about the mystery of KFC's secret recipe with 11 herbs and spices. Make it whimsical and calming, talking about how it's kept safe in a vault and how each ingredient plays its special role. Keep it under 200 words."
  },
  farm: {
    title: "From Farm to Bucket",
    prompt: "Write a soothing, 3-paragraph bedtime story about the journey of KFC chicken from happy farms to the bucket. Focus on care, quality, and the love that goes into preparing each meal. Make it peaceful and comforting. Keep it under 200 words."
  },
  world: {
    title: "KFC Around the World",
    prompt: "Write a calming, 3-paragraph bedtime story about KFC's presence around the world, how different countries enjoy it in their own special ways, bringing people together. Make it heartwarming and peaceful. Keep it under 200 words."
  },
};

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    
    if (!category || !STORY_PROMPTS[category as keyof typeof STORY_PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid story category' },
        { status: 400 }
      );
    }

    const storyConfig = STORY_PROMPTS[category as keyof typeof STORY_PROMPTS];

    // Make request to Azure OpenAI
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-08-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY || '',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a creative bedtime storyteller. Write calming, gentle stories suitable for winding down at night.'
            },
            {
              role: 'user',
              content: storyConfig.prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Azure OpenAI request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({
      title: storyConfig.title,
      content: content,
    });

  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}