import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceLink, forceCenter, forceManyBody, forceCollide } from 'd3-force';
import forceBoundary from 'd3-force-boundary';

import { data, topicsData, topicsDict } from './Globals';

const WIDTH = 650;
const HEIGHT = 650;

const MIN_SIZE = 40;
const MAX_SIZE = 55;

let DataView = {};

DataView.RESEARCH_AXIS = 0;
DataView.TOPIC = 1;
DataView.VIDEO = 2;

let DARK_COLOR = 'var(--darkColor)';
let MIDDLE_COLOR = 'var(--middleColor)';
let MIDDLE_COLOR2 = 'var(--middleColor2)';
let MIDDLE_COLOR3 = 'var(--middleColor3)';
let LIGHT_COLOR = 'var(--light_color)';

var defaultViewCreated = false;

DataView.show = function() {
    document.getElementById('container').style.display = 'block';
}

DataView.hide = function() {
    document.getElementById('container').style.display = 'none';
}

DataView.showDefaultView = function(clicked) {
    let list = document.getElementsByClassName('graph');
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    if (defaultViewCreated) {
        let topicView = document.getElementById('topicView');
        topicView.style.display = 'block';
        return;
    }

    let nodes = {};
    let links = {};

    topicsData.forEach(function(d) {
        nodes[d.ResearchAxis] = {
            id: d.ResearchAxis,
            value: MAX_SIZE,
            color: MIDDLE_COLOR,
            nodeType: DataView.RESEARCH_AXIS,
            researchAxis: d.ResearchAxis
        };
        nodes[d.Topic] = {
            id: d.Topic,
            value: MIN_SIZE + topicsDict[d.Topic]['count'] * 3,
            color: MIDDLE_COLOR2,
            nodeType: DataView.TOPIC,
            researchAxis: d.ResearchAxis
        };
        let l = {};
        l.source = d.ResearchAxis;
        l.target = d.Topic;
        links[`${d.ResearchAxis}->${d.Topic}`] = l;
    });

    let nodes_list = Object.values(nodes);
    let links_list = Object.values(links);

    let simulation = forceSimulation(nodes_list)
        .force('link', forceLink(links_list).id(d => d.id))
        .force('charge', forceManyBody().strength(d => -d.value * 4))
        .force('center', forceCenter(WIDTH * 0.5, HEIGHT * 0.5))
        .force('collide', forceCollide().strength(0.95).radius(d => d.value * 1.08))
        .force('boundary', forceBoundary(0, 0, WIDTH, HEIGHT).hardBoundary(true));

    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('id', 'topicView');

    let link = svg.append('g');

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes_list)
        .join('g')
        .attr('class', d => d.nodeType == DataView.TOPIC ? 'node' : 'nodeNonClickable')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .on('mouseover', function(d) {
            let createLink = function(l) {
                link.append('line')
                    .data([l])
                    .attr('class', 'link')
                    .attr('stroke-width', 3)
                    .attr('stroke', DARK_COLOR)
                    .attr('x1', l.source.x)
                    .attr('y1', l.source.y)
                    .attr('x2', l.target.x)
                    .attr('y2', l.target.y);
            }
            if (d.nodeType == DataView.RESEARCH_AXIS) {
                Object.keys(links).forEach((l) => {
                    if (links[l].source.id == d.id) {
                        createLink(links[l]);
                    }
                });
            } else if (d.nodeType == DataView.TOPIC) {
                Object.keys(links).forEach((l) => {
                    if (links[l].target.id == d.id) {
                        createLink(links[l]);
                    }
                });
            }
        })
        .on('mouseout', function(d) {
            selectAll('.link')
                .remove();
        });

    node.append('circle')
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on('mouseover', function(d) {
            select(this)
                .attr('fill', DARK_COLOR);
        })
        .on('mouseout', function(d) {
            select(this)
                .attr('fill', d.color);
        });

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
        selectAll('.link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        node
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });

    node.on('click', d => {
        clicked(d);
    });

    defaultViewCreated = true;
};

// DataView.showResearchAxisView = function(selectedNode, videoClicked, topicClicked, back) {
//     let list = document.getElementsByClassName('graph');
//     while (list[0]) {
//         list[0].parentNode.removeChild(list[0]);
//     }

//     if (defaultViewCreated) {
//         let topicView = document.getElementById('topicView');
//         topicView.style.display = 'none';
//     }

//     let nodes = {};
//     let links = {};

//     data.forEach(function(d) {
//         if (d.ResearchAxis == selectedNode) {
//             nodes[d.ResearchAxis] = {
//                 id: d.ResearchAxis,
//                 nodeType: DataView.RESEARCH_AXIS,
//                 value: MAX_SIZE,
//                 color: MIDDLE_COLOR
//             };
//             if (nodes[d.Topic] != undefined) {
//                 nodes[d.Topic].value += 2;
//             } else {
//                 nodes[d.Topic] = {
//                     id: d.Topic,
//                     nodeType: DataView.TOPIC,
//                     value: MIN_SIZE,
//                     color: MIDDLE_COLOR2,
//                 };
//             }
//             nodes[d.Title] = {
//                 id: d.YouTube,
//                 value: 30,
//                 nodeType: DataView.VIDEO,
//                 color: MIDDLE_COLOR3
//             };
//             Object.assign(nodes[d.Title], d);
//             let l = {};
//             l.source = d.ResearchAxis;
//             l.target = d.Topic;
//             links[`${d.ResearchAxis}->${d.Topic}`] = l;
//             l = {};
//             l.source = d.Topic;
//             l.target = d.YouTube;
//             links[`${d.YouTube}->${d.Topic}`] = l;
//         }
//     });

//     nodes = Object.values(nodes);
//     links = Object.values(links);

//     let simulation = forceSimulation(nodes)
//         .force('link', forceLink(links).id(d => d.id))
//         .force('charge', forceManyBody().strength(d => -d.value * 3))
//         .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
//         .force('collide', forceCollide().strength(0.95).radius(d => d.value * 1.05));

//     let svg = select('#container').append('svg')
//         .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
//         .attr('class', 'graph');

//     let node = svg.append('g')
//         .selectAll('g')
//         .data(nodes)
//         .join('g')
//         .attr('class', 'node')
//         .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
//         .on('mouseover', function(d) {
//             if (d.nodeType == DataView.VIDEO) {
//                 node.sort(function(a, b) { // select the parent and sort the path's
//                     if (a.id != d.id) return -1; // a is not the hovered element, send 'a' to the back
//                     else return 1;
//                 });

//                 let topicX;
//                 nodes.forEach((q) => {
//                     if (q.nodeType == DataView.TOPIC && q.id == d.Topic) {
//                         topicX = q.x;
//                     }
//                 });

//                 let title = select(this).append('foreignObject')
//                     .attr('id', 'nodeTitle')
//                     .attr('class', 'nodeTitleBox_')
//                     .attr('x', d.x >= topicX ? d.value + 8 : -d.value - 8 - 150)
//                     .attr('y', -d.value)
//                     .attr('width', 150)
//                     .attr('height', 200)
//                     .style('text-align', d.x >= topicX ? 'left' : 'right');

//                 title.append('xhtml:div')
//                     .attr('class', 'nodeLecturer')
//                     .html(d.Lecturer);

//                 title.append('xhtml:div')
//                     .attr('class', 'nodeTitle')
//                     .html(d.Title);

//                 node.filter(function(q) {
//                     return !(q.id == d.id ||
//                         (q.nodeType == DataView.TOPIC && q.id == d.Topic));
//                 }).style('opacity', 0.25);
//             }
//         })
//         .on('mouseout', (d, i) => {
//             if (d.nodeType == DataView.VIDEO) {
//                 node.style('opacity', 1.0);
//                 select('#nodeTitle').remove();
//             }
//         })

//     node.append('circle')
//         .attr('r', d => d.value)
//         .attr('fill', d => d.color)
//         .on('mouseover', function(d) {
//             select(this)
//                 .attr('fill', DARK_COLOR);
//         })
//         .on('mouseout', function(d) {
//             select(this)
//                 .attr('fill', d.color);
//         });

//     node.append('foreignObject')
//         .filter(d => d.nodeType != DataView.VIDEO)
//         .attr('class', 'nodeTextBox')
//         .attr('x', d => -d.value)
//         .attr('y', d => -d.value)
//         .attr('width', d => d.value * 2)
//         .attr('height', d => d.value * 2)
//         .append('xhtml:body')
//         .attr('class', 'nodeTextBoxBody')
//         .html(d => d.id);

//     simulation.on('tick', () => {
//         node
//             .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
//     });

//     node.on('click', d => {
//         if (d.nodeType == DataView.RESEARCH_AXIS) {
//             back();
//         } else if (d.nodeType == DataView.TOPIC) {
//             topicClicked(d, videoClicked, back);
//         } else {
//             videoClicked(d)
//         }
//     });
// }

DataView.showTopicView = function(selectedNode, videoClicked, back) {
    let list = document.getElementsByClassName('graph');
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    if (defaultViewCreated) {
        let topicView = document.getElementById('topicView');
        topicView.style.display = 'none';
    }

    let nodes = {};
    let links = {};

    data.forEach(function(d) {
        if (d.Topic == selectedNode) {
            nodes[d.Topic] = {
                id: d.Topic,
                value: MAX_SIZE,
                nodeType: DataView.TOPIC,
                color: MIDDLE_COLOR,
            };
            nodes[d.YouTube] = {
                id: d.YouTube,
                value: 15,
                nodeType: DataView.VIDEO,
                color: MIDDLE_COLOR2
            };
            Object.assign(nodes[d.YouTube], d);
            let l = {};
            l.source = d.Topic;
            l.target = d.YouTube;
            links[`${d.Topic}->${d.YouTube}`] = l;
        }
    });


    let nodes_list = Object.values(nodes);
    let links_list = Object.values(links);

    let simulation = forceSimulation(nodes_list)
        .force('link', forceLink(links_list).id(d => d.id).distance(225))
        .force('charge', forceManyBody().strength(-2000).theta(0.05))
        .force('center', forceCenter(WIDTH * 0.5, HEIGHT * 0.5))
        .force('boundary', forceBoundary(0, 0, WIDTH, HEIGHT).strength(0.2));

    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('class', 'graph');

    let link = svg.append('g')
        .attr('stroke', MIDDLE_COLOR2)
        .selectAll('line')
        .data(links_list)
        .join('line')
        .attr('stroke-width', 1.5);

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes_list)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

    node.append('circle')
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on('mouseover', function(d) {
            select(this)
                .attr('fill', DARK_COLOR);
        })
        .on('mouseout', function(d) {
            select(this)
                .attr('fill', d.color);
        });

    node.append('foreignObject')
        .filter(d => d.nodeType == DataView.TOPIC)
        .attr('class', 'nodeTextBox')
        .attr('x', d => -d.value)
        .attr('y', d => -d.value)
        .attr('width', d => d.value * 2)
        .attr('height', d => d.value * 2)
        .append('xhtml:body')
        .attr('class', 'nodeTextBoxBody')
        .html(d => d.id);

    var request = new XMLHttpRequest();

    let title = node.append('foreignObject')
        .filter(d => d.nodeType == DataView.VIDEO)
        .attr('class', 'nodeTitleBox')
        .attr('x', d => d.value + 8)
        .attr('y', d => -d.value)
        .attr('width', 115)
        .attr('height', 120);

    title.append('xhtml:div')
        .attr('class', 'nodeLecturer')
        .html(d => d.Lecturer);

    title.append('xhtml:div')
        .attr('class', 'nodeDate')
        .html(d => {
            let dateObj = new Date(d.Date);
            let viewCountStr = d.viewCount ? `, ${d.viewCount} views` : '';
            let dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
            return dateStr + viewCountStr;
        });

    title.append('xhtml:div')
        .attr('class', 'nodeTitle')
        .html(d => d.Title);

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
        if (d.nodeType == DataView.VIDEO) {
            videoClicked(d);
        } else {
            back();
        }
    })
}

export default DataView;