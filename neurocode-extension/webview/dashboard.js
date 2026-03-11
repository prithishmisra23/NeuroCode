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
    document.getElementById('module-count').innerText = data.files.length;
    
    const riskList = document.getElementById('risk-list');
    riskList.innerHTML = '';
    
    data.risks.forEach(risk => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${risk.file}</span>
            <span class="risk-tag risk-${risk.riskLevel.toLowerCase()}">${risk.riskLevel}</span>
        `;
        riskList.appendChild(li);
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
