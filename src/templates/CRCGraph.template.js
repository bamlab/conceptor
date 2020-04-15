const UNIT = 10;
const CARD_HEADER_HEIGHT = 14 * UNIT;
const CARD_HEADER_WIDTH = 20 * UNIT;

const style = [
  {
    selector: 'node',
    style: {
      shape: 'round-rectangle',
      height: CARD_HEADER_HEIGHT,
      width: CARD_HEADER_WIDTH,
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
      'font-size': 2 * UNIT,
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: '[id *= ":responsibility"]',
    style: {
      label: 'data(label)',
      'font-size': UNIT,
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
