import * as vscode from 'vscode';
import { scanRepo } from './commands/scanRepo';
import { refactorCode } from './commands/refactorCode';
import { predictBugs } from './commands/predictBugs';
import { openDashboard } from './commands/openDashboard';

export function activate(context: vscode.ExtensionContext) {
    console.log('NeuroCode is now active!');

    const commands = [
        vscode.commands.registerCommand('NeuroCode.scanRepository', scanRepo),
        vscode.commands.registerCommand('NeuroCode.refactorSelection', refactorCode),
        vscode.commands.registerCommand('NeuroCode.predictBugs', predictBugs),
        vscode.commands.registerCommand('NeuroCode.openDashboard', openDashboard)
    ];

    context.subscriptions.push(...commands);
}

export function deactivate() {}
