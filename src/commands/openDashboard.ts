import * as vscode from 'vscode';
import * as path from 'path';
import { scanRepository } from '../analyzers/repoScanner';
import { buildDependencyGraph } from '../analyzers/dependencyGraph';
import { analyzeFile } from '../analyzers/complexityAnalyzer';
import { predictRisk } from '../analyzers/smellDetector';
import * as fs from 'fs';

export async function openDashboard(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'neurocodeDashboard',
        'NeuroCode Dashboard',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'webview'))]
        }
    );

    const htmlPath = path.join(context.extensionPath, 'webview', 'dashboard.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Resolve resource URIs
    const cssUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webview', 'dashboard.css')));
    const jsUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webview', 'dashboard.js')));

    html = html.replace('dashboard.css', cssUri.toString());
    html = html.replace('dashboard.js', jsUri.toString());

    panel.webview.html = html;

    // Load data with Progress
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "NeuroCode: Generating dashboard metrics...",
        cancellable: false
    }, async () => {
        const projectData = await scanRepository();
        const graph = buildDependencyGraph(projectData);
        const risks = projectData.files.slice(0, 10).map(file => {
            const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;
            const fullPath = path.isAbsolute(file) ? file : path.join(workspaceRoot, file);
            const analysis = analyzeFile(fullPath);
            return predictRisk(file, analysis);
        });

        panel.webview.postMessage({
            type: 'update',
            data: {
                files: projectData.files,
                graph,
                risks
            }
        });
    });

    panel.webview.onDidReceiveMessage(message => {
        if (message.type === 'openFile') {
            const fullPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, message.file);
            vscode.workspace.openTextDocument(fullPath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        }
    });
}
