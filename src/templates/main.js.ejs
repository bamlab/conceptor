const style = [
  {
    selector: 'node',
    style: {
      shape: 'round-rectangle',
      height: <%- style.crcCard.height %>,
      width: <%- style.crcCard.width %>,
      color: 'red',
      'background-color': 'white',
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: '[id *= ":title"]',
    style: {
      label: 'data(label)',
      'font-size': 20,
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: '[id *= ":responsibility"]',
    style: {
      label: 'data(label)',
      'font-size': 20,
    },
  },
  {
    selector: 'edge',
    style: {
      'target-arrow-shape': 'vee',
    },
  },
];

var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: {
      nodes: [<%- nodes.map(JSON.stringify).join(',') %>],
      edges: [<%- edges.map(JSON.stringify).join(',') %>]
  },
  <% if (layout) { %>
    layout: { name: <%- JSON.stringify(layout) %> },
  <% } %>
  style: style
});

<% nodes.forEach((node) => { %>
    cy.nodeHtmlLabel([{
        query: 'node[id = "' + <%- JSON.stringify(node.data.id) %> + '"]',
        valign: "center",
        halign: "center",
        valignBox: "center",
        halignBox: "center",
        cssClass: 'crc_content',
        tpl: () => <%- JSON.stringify(node.data.content) %>
      }]);
<%});%>
