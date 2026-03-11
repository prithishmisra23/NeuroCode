import * as vscode from 'vscode';
import { analyzeFile } from '../analyzers/complexityAnalyzer';
import { predictRisk } from '../analyzers/smellDetector';

export async function predictBugs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const filePath = editor.document.fileName;
    const analysis = analyzeFile(filePath);
    const risk = predictRisk(filePath, analysis);

    const message = `Risk Level: ${risk.riskLevel} (Score: ${risk.riskScore})\nReason: ${risk.reason}`;
    
    if (risk.riskLevel === 'High') {
        vscode.window.showWarningMessage(message);
    } else {
        vscode.window.showInformationMessage(message);
    }
}
