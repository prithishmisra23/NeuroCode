import * as vscode from 'vscode';
import { suggestRefactor } from '../ai/refactorEngine';

export async function refactorCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (!text) {
        vscode.window.showErrorMessage('No code selected');
        return;
    }

    const apiKey = vscode.workspace.getConfiguration('neurocode').get<string>('apiKey');
    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your OpenAI API key in settings');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "NeuroCode: Refactoring code...",
        cancellable: false
    }, async (progress) => {
        try {
            const suggestion = await suggestRefactor(text, apiKey);
            
            const choice = await vscode.window.showInformationMessage(
                `AI suggested refactor (${suggestion.risk_level} risk). Preview changes?`,
                'View Explanation', 'Preview Diff', 'Cancel'
            );

            if (choice === 'View Explanation') {
                vscode.window.showInformationMessage(suggestion.explanation);
            } else if (choice === 'Preview Diff') {
                // Create virtual documents for diffing
                const originalUri = vscode.Uri.parse(`neurocode-preview:/original?${text}`);
                const refactoredUri = vscode.Uri.parse(`neurocode-preview:/refactored?${suggestion.refactored_code}`);
                
                await vscode.commands.executeCommand('vscode.diff', originalUri, refactoredUri, 'NeuroCode Refactor Preview');
                
                const applyChoice = await vscode.window.showInformationMessage(
                    "Apply these changes?", "Apply", "Discard"
                );

                if (applyChoice === "Apply") {
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, suggestion.refactored_code);
                    });
                    vscode.window.showInformationMessage('Refactor applied successfully!');
                }
            }
        } catch (e: any) {
            vscode.window.showErrorMessage(`Refactor failed: ${e.message}`);
        }
    });
}
