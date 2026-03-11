import { AnalysisReport } from './complexityAnalyzer';
import * as fs from 'fs';

export interface RiskReport {
    file: string;
    riskScore: number;
    riskLevel: "Low" | "Medium" | "High";
    reason: string;
}

export function predictRisk(filePath: string, analysis: AnalysisReport): RiskReport {
    let riskScore = analysis.complexityScore;
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;

    if (fileSizeKB > 50) riskScore += 5;
    if (analysis.smells.length > 5) riskScore += 10;

    let riskLevel: "Low" | "Medium" | "High" = "Low";
    if (riskScore > 20) riskLevel = "High";
    else if (riskScore > 10) riskLevel = "Medium";

    let reason = "Complexity and size are within normal limits.";
    if (riskLevel === "High") {
        reason = "High complexity and large file size detected.";
    } else if (riskLevel === "Medium") {
        reason = "Moderate complexity with some code smells.";
    }

    return {
        file: filePath,
        riskScore,
        riskLevel,
        reason
    };
}
