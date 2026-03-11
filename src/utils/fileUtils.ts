import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getProjectRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
}

export async function getAllFiles(dir: string, extensions: string[]): Promise<string[]> {
    const ignoreFolders = ['node_modules', '.git', 'dist', 'build', 'coverage', '.vscode', 'out'];
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (let file of list) {
        const baseName = file;
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            if (!ignoreFolders.includes(baseName)) {
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
