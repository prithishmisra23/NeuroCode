import * as vscode from 'vscode';
import { scanRepository } from '../analyzers/repoScanner';

export async function scanRepo() {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "NeuroCode: Scanning project...",
        cancellable: false
    }, async (progress) => {
        try {
            const data = await scanRepository();
            vscode.window.showInformationMessage(`Scan complete! Found ${data.files.length} files and ${data.dependencies.length} dependencies.`);
        } catch (e: any) {
            vscode.window.showErrorMessage(`Scan failed: ${e.message}`);
        }
    });
}
