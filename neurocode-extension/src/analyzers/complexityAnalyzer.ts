import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { readFileContent } from '../utils/fileUtils';

export interface AnalysisReport {
    smells: string[];
    complexityScore: number;
    healthGrade: "A" | "B" | "C" | "D";
}

export function analyzeFile(filePath: string): AnalysisReport {
    const content = readFileContent(filePath);
    const smells: string[] = [];
    let cyclomaticComplexity = 1;
    let functionCount = 0;
    let totalLineCount = content.split('\n').length;

    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript']
        });

        traverse(ast, {
            Function(path) {
                functionCount++;
                const loc = path.node.loc;
                if (loc && loc.end.line - loc.start.line > 50) {
                    smells.push(`Long function at line ${loc.start.line}`);
                }
            },
            IfStatement() { cyclomaticComplexity++; },
            ForStatement() { cyclomaticComplexity++; smells.push('Nested loop detected'); },
            WhileStatement() { cyclomaticComplexity++; },
            SwitchCase() { cyclomaticComplexity++; }
        });
    } catch (e) {
        console.error(`Error analyzing ${filePath}:`, e);
    }

    if (totalLineCount > 300) {
        smells.push('File is too long');
    }

    const healthGrade = calculateGrade(cyclomaticComplexity, smells.length);

    return {
        smells,
        complexityScore: cyclomaticComplexity,
        healthGrade
    };
}

function calculateGrade(complexity: number, smellCount: number): "A" | "B" | "C" | "D" {
    const score = complexity + smellCount * 2;
    if (score < 10) return "A";
    if (score < 20) return "B";
    if (score < 40) return "C";
    return "D";
}
