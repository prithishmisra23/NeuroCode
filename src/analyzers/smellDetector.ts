import { AnalysisReport } from './complexityAnalyzer';
import * as fs from 'fs';

export interface RiskReport {
    file: string;
    riskScore: number;
    riskLevel: "Low" | "Medium" | "High";
    reason: string;
}

export function predictRisk(filePath: string, analysis: AnalysisReport): RiskReport {
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;
    
    // We base commitFrequency and dependencyDepth on existing metrics or defaults
    const mockCommitFrequency = 5; // In a real app, this comes from Git analysis
    const mockDependencyDepth = analysis.smells.filter(s => s.includes('dependency')).length + 1;

    // Weighted Risk Scoring Formula
    // complexity (0.4) + frequency (0.3) + depth (0.2) + size (0.1)
    const riskScore = (analysis.complexityScore * 0.4) + 
                      (mockCommitFrequency * 0.3) + 
                      (mockDependencyDepth * 0.2) + 
                      (fileSizeKB * 0.1);

    // Normalize or scale the score to 0-10 range for easier visualization
    const normalizedScore = Math.min(10, riskScore);

    let riskLevel: "Low" | "Medium" | "High" = "Low";
    if (normalizedScore > 7) riskLevel = "High";
    else if (normalizedScore > 4) riskLevel = "Medium";

    let reason = "File metrics are within safe thresholds.";
    if (riskLevel === "High") {
        reason = "High complexity and size combined with frequent changes.";
    } else if (riskLevel === "Medium") {
        reason = "Moderate complexity with some detected code smells.";
    }

    return {
        file: filePath,
        riskScore: Number(normalizedScore.toFixed(2)),
        riskLevel,
        reason
    };
}
