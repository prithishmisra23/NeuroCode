const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
        case 'update':
            updateDashboard(message.data);
            break;
    }
});

function updateDashboard(data) {
    const riskList = document.getElementById('risk-list');
    riskList.innerHTML = '';
    
    let highRiskCount = 0;
    data.risks.forEach(risk => {
        if (risk.riskLevel === 'High') highRiskCount++;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${risk.file}</span>
            <span class="risk-tag risk-${risk.riskLevel.toLowerCase()}">${risk.riskLevel}</span>
        `;
        riskList.appendChild(li);
    });

    document.getElementById('risk-summary').innerText = highRiskCount > 0 ? 'High' : 'Low';
    
    // Populate suggestions panel
    const suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = '';
    const suggestions = [
        { title: 'Simplify Complex Logic', file: data.risks[0]?.file || 'unknown' },
        { title: 'Extract Component', file: data.risks[1]?.file || 'unknown' },
        { title: 'Optimize Imports', file: data.risks[2]?.file || 'unknown' }
    ];

    suggestions.forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="padding: 10px;">
                <div style="font-weight: bold;">${s.title}</div>
                <div style="font-size: 0.8em; color: #8b949e;">${s.file}</div>
            </div>
        `;
        suggestionList.appendChild(li);
    });

    initGraph(data.graph);
}

function initGraph(graphData) {
    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            ...graphData.nodes.map(n => ({ data: { id: n.id, label: n.label } })),
            ...graphData.edges.map(e => ({ data: { source: e.source, target: e.target } }))
        ],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#58a6ff',
                    'label': 'data(label)',
                    'color': '#c9d1d9',
                    'font-size': '10px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#30363d',
                    'target-arrow-color': '#30363d',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],
        layout: {
            name: 'cose',
            animate: true
        }
    });

    cy.on('tap', 'node', function(evt){
        const node = evt.target;
        vscode.postMessage({
            type: 'openFile',
            file: node.id()
        });
    });
}
