import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getProjectRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
}

export async function getAllFiles(dir: string, extensions: string[]): Promise<string[]> {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (let file of list) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(await getAllFiles(file, extensions));
            }
        } else {
            if (extensions.some(ext => file.endsWith(ext))) {
                results.push(file);
            }
        }
    }
    return results;
}

export function readFileContent(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
}
