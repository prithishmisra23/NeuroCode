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
                `AI suggested refactor (${suggestion.risk_level} risk). Apply changes?`,
                'View Explanation', 'Apply', 'Cancel'
            );

            if (choice === 'View Explanation') {
                vscode.window.showInformationMessage(suggestion.explanation);
                // Recursive call to show buttons again or similar
            } else if (choice === 'Apply') {
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, suggestion.refactored_code);
                });
                vscode.window.showInformationMessage('Refactor applied successfully!');
            }
        } catch (e: any) {
            vscode.window.showErrorMessage(`Refactor failed: ${e.message}`);
        }
    });
}
