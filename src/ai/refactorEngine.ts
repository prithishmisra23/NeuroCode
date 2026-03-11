import { askAI } from './aiClient';

export interface RefactorResponse {
    refactored_code: string;
    explanation: string;
    complexity_before: number;
    complexity_after: number;
    risk_level: "low" | "medium" | "high";
}

export async function suggestRefactor(code: string, apiKey: string): Promise<RefactorResponse> {
    const prompt = `
        Refactor the following code for better readability, performance, and lower complexity.
        Return a JSON object with:
        {
            "refactored_code": "...",
            "explanation": "...",
            "complexity_before": number,
            "complexity_after": number,
            "risk_level": "low/medium/high"
        }
        
        Code:
        ${code}
    `;

    return await askAI(prompt, apiKey) as RefactorResponse;
}
