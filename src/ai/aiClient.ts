import OpenAI from 'openai';

let openai: OpenAI | undefined;

export function getAIClient(apiKey: string): OpenAI {
    if (!openai) {
        openai = new OpenAI({ apiKey });
    }
    return openai;
}

export async function askAI(prompt: string, apiKey: string) {
    const client = getAIClient(apiKey);
    const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
}
