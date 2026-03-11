import OpenAI from 'openai';

let openai: OpenAI | undefined;

export function getAIClient(apiKey: string): OpenAI {
    if (!openai) {
        openai = new OpenAI({ 
            apiKey,
            baseURL: 'https://api.groq.com/openai/v1'
        });
    }
    return openai;
}

export async function askAI(prompt: string, apiKey: string) {
    const client = getAIClient(apiKey);
    const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
}
