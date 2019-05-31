import * as d3 from 'd3';
import data from './data.csv';

const width = 700;
const height = 700;

function showVideoView(selectedNode, videoClicked, keywordNodeClicked) {
    let list = document.getElementsByClassName('graph');
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    let color = d3.scaleOrdinal().range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]).domain([40, 60]);

    let nodes = {};
    let links = [];

    data.forEach(function(d) {
        if (d.Topic == selectedNode) {
            nodes[d.Topic] = { id: d.Topic, value: 60 };
            nodes[d.Title] = {
                id: d.Title,
                value: 30,
                Lecturer: d.Lecturer,
                YouTube: d.YouTube,
                Summary: d.Summary
            };
            let l = {};
            l.source = d.Topic;
            l.target = d.Title;
            links.push(l);
        }
    });

    nodes = Object.values(nodes);

    let simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(250))
        .force('charge', d3.forceManyBody().strength(-2000))
        .force('center', d3.forceCenter(width / 3, height / 2))
        .force('collide', d3.forceCollide(60).strength(0.4));

    let svg = d3.select('#container').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
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

    // let title = node.append('text')
    //     .text(d => {
    //         if (d.Lecturer) {
    //             return d.Lecturer;
    //         } else {
    //             return d.id;
    //         }
    //     })
    //     .attr('class', 'nodeText')
    //     .attr('text-anchor', d => {
    //         if (d.Lecturer) {
    //             return 'left';
    //         } else {
    //             return 'middle';
    //         }
    //     });


    node.append('foreignObject')
        .attr('class', d => {
            if (d.Lecturer) {
                return 'noBox';
            } else {
                return 'nodeTextBox';
            }
        })
        .attr('x', d => -d.value)
        .attr('y', d => -d.value)
        .attr('width', d => d.value * 2)
        .attr('height', d => d.value * 2)
        .append('xhtml:body')
        .attr('class', 'nodeTextBoxBody')
        .html(d => d.id);

    let title = node.append('foreignObject')
        .attr('class', d => {
            if (d.Lecturer) {
                return 'nodeTitleBox';
            } else {
                return 'noBox';
            }
        })
        .attr('x', d => d.value + 8)
        .attr('y', d => -d.value)
        .attr('width', 150)
        .attr('height', 200);

    title.append('xhtml:div')
        .attr('class', 'nodeLecturer')
        .html(d => {
            if (d.Lecturer) {
                return d.Lecturer;
            }
        });

    title.append('xhtml:div')
        .attr('class', 'nodeTitle')
        .html(d => {
            if (d.Lecturer) {
                return d.id;
            }
        });

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
        if (d.Lecturer) {
            videoClicked(d);
        } else {
            keywordNodeClicked();
        }
    })
}

export default showVideoView;