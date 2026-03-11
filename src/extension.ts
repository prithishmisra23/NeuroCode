import * as vscode from 'vscode';
import { scanRepo } from './commands/scanRepo';
import { refactorCode } from './commands/refactorCode';
import { predictBugs } from './commands/predictBugs';
import { openDashboard } from './commands/openDashboard';

export function activate(context: vscode.ExtensionContext) {
    console.log('NeuroCode is now active!');

    // Status Bar Integration
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.text = "$(circuit-board) NeuroCode: Ready";
    statusBar.tooltip = "NeuroCode AI is active";
    statusBar.show();
    context.subscriptions.push(statusBar);

    // API Key Validation Check
    const config = vscode.workspace.getConfiguration("neurocode");
    const apiKey = config.get<string>("apiKey");
    if (!apiKey) {
        vscode.window.showWarningMessage("NeuroCode API key not set. AI features will be disabled. Add it in Settings.");
    }

    const commands = [
        vscode.commands.registerCommand('NeuroCode.scanRepository', scanRepo),
        vscode.commands.registerCommand('NeuroCode.refactorSelection', refactorCode),
        vscode.commands.registerCommand('NeuroCode.predictBugs', predictBugs),
        vscode.commands.registerCommand('NeuroCode.openDashboard', () => openDashboard(context))
    ];

    context.subscriptions.push(...commands);

    // Register Preview Provider
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('neurocode-preview', new (class implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(uri: vscode.Uri): string {
            return uri.query || '';
        }
    })()));
}

export function deactivate() {}
