import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { getProjectRoot, getAllFiles, readFileContent } from '../utils/fileUtils';
import * as path from 'path';

export interface ProjectData {
    files: string[];
    dependencies: { source: string; target: string }[];
    modules: string[];
}

export async function scanRepository(): Promise<ProjectData> {
    const root = getProjectRoot();
    if (!root) {
        throw new Error('No project root found');
    }

    const files = await getAllFiles(root, ['.ts', '.js', '.py', '.java']);
    const dependencies: { source: string; target: string }[] = [];
    const modules: string[] = files.map(f => path.relative(root, f));

    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const imports = parseFileImports(file);
            imports.forEach(imp => {
                dependencies.push({
                    source: path.relative(root, file),
                    target: imp
                });
            });
        }
    }

    return {
        files: modules,
        dependencies,
        modules
    };
}

function parseFileImports(filePath: string): string[] {
    const content = readFileContent(filePath);
    const imports: string[] = [];

    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'decorators-legacy']
        });

        traverse(ast, {
            ImportDeclaration({ node }) {
                imports.push(node.source.value);
            },
            CallExpression({ node }) {
                if (
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' &&
                    node.arguments.length > 0 &&
                    node.arguments[0].type === 'StringLiteral'
                ) {
                    imports.push(node.arguments[0].value);
                }
            }
        });
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
    }

    return imports;
}
