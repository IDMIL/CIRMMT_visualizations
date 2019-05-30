import * as d3 from 'd3';
import data from './data.csv';

const width = 700;
const height = 700;

function showKeywordView(clicked) {
    let list = document.getElementsByClassName('graph');
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    let color = d3.scaleOrdinal().range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]).domain([40, 60]);

    let nodes = {};
    let links = [];

    data.forEach(function(d) {
        nodes[d.MainLevel] = { id: d.MainLevel, value: 60 };
        if (nodes[d.Level1] != undefined) {
            nodes[d.Level1].value += 3;
        } else {
            nodes[d.Level1] = { id: d.Level1, value: 35 };
        }

        let l = {};
        l.source = d.MainLevel;
        l.target = d.Level1;
        links.push(l);
    });

    nodes = Object.values(nodes);

    console.log(nodes);

    let simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(60).strength(1));


    let svg = d3.select('#container').append('svg')
        // .attr('width', width)
        // .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        // .attr('preserveAspectRatio', 'xMidYMid')
        .attr('class', 'graph');

    let link = svg.append('g')
        .attr('stroke', '#CCC')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 4);

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

    node.append('circle')
        .attr('stroke', '#CCC')
        .attr('stroke-width', 4)
        .attr('r', d => d.value)
        .attr('fill', d => color(d.value));

    node.append('foreignObject')
        .attr('class', 'nodeTextBox')
        .attr('x', d => -d.value)
        .attr('y', d => -d.value)
        .attr('width', d => d.value * 2)
        .attr('height', d => d.value * 2)
        .append('xhtml:body')
        .attr('class', 'nodeTextBoxBody')
        .html(d => d.id);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        node
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });

    node.on('click', d => {
        clicked(d.id);
    });
};

export default showKeywordView;