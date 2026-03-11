import { ProjectData } from './repoScanner';
import * as graphlib from 'graphlib';

export interface GraphData {
    nodes: { id: string; label: string }[];
    edges: { source: string; target: string }[];
}

export function buildDependencyGraph(projectData: ProjectData): GraphData {
    const g = new graphlib.Graph();

    projectData.files.forEach(file => {
        g.setNode(file, { label: file });
    });

    projectData.dependencies.forEach(dep => {
        // Only add edge if target is within our modules (simplified)
        // In a real app, we'd resolve the path
        g.setEdge(dep.source, dep.target);
    });

    const nodes = g.nodes().map(n => ({
        id: n,
        label: n
    }));

    const edges = g.edges().map(e => ({
        source: e.v,
        target: e.w
    }));

    return { nodes, edges };
}
