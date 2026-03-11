import { execSync } from 'child_process';
import { getProjectRoot } from './fileUtils';

export interface GitChange {
    year: number;
    change: string;
}

export function getGitHistory(): GitChange[] {
    const root = getProjectRoot();
    if (!root) return [];

    try {
        // Mocking or simple extraction
        const log = execSync('git log --pretty=format:"%ad : %s" --date=short -n 10', { cwd: root }).toString();
        return log.split('\n').map(line => {
            const date = line.split(' : ')[0];
            const year = new Date(date).getFullYear();
            return {
                year: isNaN(year) ? 2024 : year,
                change: line.split(' : ')[1]
            };
        });
    } catch (e) {
        console.error('Git not found or not a repo');
        return [{ year: 2024, change: "Initial commit (Git not detected)" }];
    }
}
