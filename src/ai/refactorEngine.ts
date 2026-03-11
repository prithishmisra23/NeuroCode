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
        You are a senior software engineer. 
        Refactor the following code for better readability, performance, and lower complexity.
        
        Rules:
        - Maintain functionality strictly.
        - Reduce cyclomatic complexity.
        - Follow industry best practices (SOLID, DRY).
        - Avoid breaking changes.
        - Return the response in JSON format.

        JSON structure:
        {
            "refactored_code": "the refactored code string",
            "explanation": "concise explanation of changes",
            "complexity_before": number,
            "complexity_after": number,
            "risk_level": "low|medium|high"
        }
        
        Code to refactor:
        ${code}
    `;

    return await askAI(prompt, apiKey) as RefactorResponse;
}
