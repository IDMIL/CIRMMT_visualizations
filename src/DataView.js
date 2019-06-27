import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceLink, forceCenter, forceManyBody, forceCollide } from 'd3-force';

import data from './data.csv';

const WIDTH = 700;
const HEIGHT = 700;

const MIN_SIZE = 38;
const MAX_SIZE = 55;

let DataView = {};

DataView.RESEARCH_AXIS = 0;
DataView.TOPIC = 1;
DataView.VIDEO = 2;

var defaultViewCreated = false;

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

    data.forEach(function(d) {
        if (d.Title) {
            nodes[d.ResearchAxis] = {
                id: d.ResearchAxis,
                value: MAX_SIZE,
                color: '#e4e8b9',
                nodeType: DataView.RESEARCH_AXIS,
                researchAxis: d.ResearchAxis
            };
            if (nodes[d.Topic] != undefined) {
                nodes[d.Topic].value += 3;
            } else {
                nodes[d.Topic] = {
                    id: d.Topic,
                    value: MIN_SIZE,
                    color: '#c2e8dc',
                    nodeType: DataView.TOPIC,
                    researchAxis: d.ResearchAxis
                };
            }
            let l = {};
            l.source = d.ResearchAxis;
            l.target = d.Topic;
            l.draw = false;
            links[`${d.ResearchAxis}->${d.Topic}`] = l;
        }
    });

    let nodes_list = Object.values(nodes);
    let links_list = Object.values(links);

    let simulation = forceSimulation(nodes_list)
        .force('link', forceLink(links_list).id(d => d.id))
        .force('charge', forceManyBody().strength(d => -d.value * 4))
        .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
        .force('collide', forceCollide().strength(0.95).radius(d => d.value * 1.08));


    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('id', 'topicView');

    let link = svg.append('g');

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes_list)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .on("mouseover", function(d) {
            let keys = Object.keys(links);
            keys.forEach((k) => {
                if (k.includes(d.researchAxis)) {
                    let l = links[k];
                    link.append('line')
                        .data([l])
                        .attr('class', 'link')
                        .attr('stroke-width', 3)
                        .attr('stroke', '#e4e8b9')
                        .attr('x1', l.source.x)
                        .attr('y1', l.source.y)
                        .attr('x2', l.target.x)
                        .attr('y2', l.target.y);
                }
            });
        })
        .on("mouseout", function(d) {
            selectAll('.link')
                .remove();
        });

    node.append('circle')
        .attr('stroke', '#DDD')
        .attr('stroke-width', d => d.value > 10 ? 1 : 0)
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on("mouseover", function(d) {
            select(this)
                .attr('fill', '#a5e2ff');
        })
        .on("mouseout", function(d) {
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
            .attr('transform', d => 'translate(' + Math.max(d.value, Math.min(WIDTH - d.value, d.x)) + ',' + Math.max(d.value, Math.min(HEIGHT - d.value, d.y)) + ')');
    });

    node.on('click', d => {
        clicked(d.id, d.nodeType);
    });

    defaultViewCreated = true;
};

DataView.showResearchAxisView = function(researchAxis, videoClicked, topicClicked, researchAxisClicked) {
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
        if (d.ResearchAxis == researchAxis) {
            nodes[d.ResearchAxis] = {
                id: d.ResearchAxis,
                nodeType: DataView.RESEARCH_AXIS,
                value: MAX_SIZE,
                color: '#e4e8b9'
            };
            if (nodes[d.Topic] != undefined) {
                nodes[d.Topic].value += 2;
            } else {
                nodes[d.Topic] = {
                    id: d.Topic,
                    nodeType: DataView.TOPIC,
                    value: MIN_SIZE,
                    color: '#c2e8dc',
                };
            }
            nodes[d.Title] = {
                id: d.Title,
                value: 30,
                nodeType: DataView.VIDEO,
                Lecturer: d.Lecturer,
                YouTube: d.YouTube,
                Summary: d.Summary,
                Affiliation: d.Affiliation,
                Date: d.Date,
                Type: d.Type,
                color: '#d6e8d5'
            };
            let l = {};
            l.source = d.ResearchAxis;
            l.target = d.Topic;
            l.draw = false;
            links[`${d.ResearchAxis}->${d.Topic}`] = l;
            l = {};
            l.source = d.Title;
            l.target = d.Topic;
            l.draw = false;
            links[`${d.Title}->${d.Topic}`] = l;
        }
    });

    nodes = Object.values(nodes);
    links = Object.values(links);

    let simulation = forceSimulation(nodes)
        .force('link', forceLink(links).id(d => d.id))
        .force('charge', forceManyBody().strength(d => -d.value * 3))
        .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
        .force('collide', forceCollide().strength(0.95).radius(d => d.value * 1.05));

    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('class', 'graph');

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .on('mouseover', function(d) {
            if (d.nodeType == DataView.VIDEO) {
                node.sort(function(a, b) { // select the parent and sort the path's
                    if (a.id != d.id) return -1; // a is not the hovered element, send "a" to the back
                    else return 1;
                });

                let title = select(this).append('foreignObject')
                    .attr('id', 'nodeTitle')
                    .attr('class', 'nodeTitleBox_')
                    .attr('x', d.value + 8)
                    .attr('y', -d.value)
                    .attr('width', 150)
                    .attr('height', 200);

                title.append('xhtml:div')
                    .attr('class', 'nodeLecturer')
                    .html(d.Lecturer);

                title.append('xhtml:div')
                    .attr('class', 'nodeTitle')
                    .html(d.id);

                node.filter(q => q.id != d.id)
                    .style('opacity', 0.25);
            }
        })
        .on('mouseout', (d, i) => {
            if (d.nodeType == DataView.VIDEO) {
                node.style('opacity', 1.0);
                select('#nodeTitle').remove();
            }
        })

    node.append('circle')
        .attr('stroke', '#DDD')
        .attr('stroke-width', d => d.value > 10 ? 1 : 0)
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on("mouseover", function(d) {
            select(this)
                .attr('fill', '#a5e2ff');
        })
        .on("mouseout", function(d) {
            select(this)
                .attr('fill', d.color);
        });

    node.append('foreignObject')
        .filter(d => d.nodeType != DataView.VIDEO)
        .attr('class', 'nodeTextBox')
        .attr('x', d => -d.value)
        .attr('y', d => -d.value)
        .attr('width', d => d.value * 2)
        .attr('height', d => d.value * 2)
        .append('xhtml:body')
        .attr('class', 'nodeTextBoxBody')
        .html(d => d.id);

    simulation.on('tick', () => {
        node
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });

    node.on('click', d => {
        if (d.nodeType == DataView.RESEARCH_AXIS) {
            researchAxisClicked();
        } else if (d.nodeType == DataView.TOPIC) {
            topicClicked(d.id, videoClicked, researchAxisClicked);
        } else {
            videoClicked(d.YouTube)
        }
    });
}

DataView.showTopicView = function(selectedNode, videoClicked, keywordNodeClicked) {
    let list = document.getElementsByClassName('graph');
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    if (defaultViewCreated) {
        let topicView = document.getElementById('topicView');
        topicView.style.display = 'none';
    }

    let nodes = {};
    let links = [];

    data.forEach(function(d) {
        if (d.Topic == selectedNode) {
            nodes[d.Topic] = {
                id: d.Topic,
                value: 50,
                color: '#e4e8b9',
                nodeType: DataView.TOPIC
            };
            nodes[d.Title] = {
                id: d.Title,
                value: 20,
                Lecturer: d.Lecturer,
                YouTube: d.YouTube,
                Summary: d.Summary,
                Affiliation: d.Affiliation,
                Date: d.Date,
                Type: d.Type,
                color: '#c2e8dc',
                nodeType: DataView.VIDEO
            };
            let l = {};
            l.source = d.Topic;
            l.target = d.Title;
            links.push(l);
        }
    });

    nodes = Object.values(nodes);

    let simulation = forceSimulation(nodes)
        .force('link', forceLink(links).id(d => d.id).distance(200))
        .force('charge', forceManyBody().strength(-2000))
        .force('center', forceCenter(WIDTH * 0.4, HEIGHT / 2))
        .force('collide', forceCollide(60).strength(2.0));

    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('class', 'graph');


    let link = svg.append('g')
        .attr('stroke', '#e4e8b9')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 1.5);

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

    node.append('circle')
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on("mouseover", function(d) {
            select(this)
                .attr('fill', '#a5e2ff');
        })
        .on("mouseout", function(d) {
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

    let title = node.append('foreignObject')
        .filter(d => d.nodeType == DataView.VIDEO)
        .attr('class', 'nodeTitleBox')
        .attr('x', d => d.value + 8)
        .attr('y', d => -d.value)
        .attr('width', 150)
        .attr('height', 100);

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
        if (d.nodeType == DataView.VIDEO) {
            videoClicked(d.YouTube);
        } else {
            keywordNodeClicked();
        }
    })
}

DataView.showSearchResults = function(results) {
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

    results.forEach(function(d) {
        nodes[d.ResearchAxis] = {
            id: d.ResearchAxis,
            nodeType: DataView.RESEARCH_AXIS,
            value: MAX_SIZE,
            color: '#e4e8b9'
        };
        if (nodes[d.Topic] != undefined) {
            nodes[d.Topic].value += 2;
        } else {
            nodes[d.Topic] = {
                id: d.Topic,
                nodeType: DataView.TOPIC,
                value: MIN_SIZE,
                color: '#c2e8dc',
            };
        }
        nodes[d.Title] = {
            id: d.Title,
            value: 30,
            nodeType: DataView.VIDEO,
            Lecturer: d.Lecturer,
            YouTube: d.YouTube,
            Summary: d.Summary,
            Affiliation: d.Affiliation,
            Date: d.Date,
            Type: d.Type,
            color: '#d6e8d5'
        };
        let l = {};
        l.source = d.ResearchAxis;
        l.target = d.Topic;
        l.draw = false;
        links[`${d.ResearchAxis}->${d.Topic}`] = l;
        l = {};
        l.source = d.Title;
        l.target = d.Topic;
        l.draw = false;
        links[`${d.Title}->${d.Topic}`] = l;
    });

    nodes = Object.values(nodes);
    links = Object.values(links);

    let simulation = forceSimulation(nodes)
        .force('link', forceLink(links).id(d => d.id))
        .force('charge', forceManyBody().strength(-100))
        .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
        .force('collide', forceCollide().strength(0.5).radius(d => d.value * 1.05));

    let svg = select('#container').append('svg')
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .attr('class', 'graph');

    let node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .on('mouseover', function(d) {
            if (d.nodeType == DataView.VIDEO) {
                node.sort(function(a, b) { // select the parent and sort the path's
                    if (a.id != d.id) return -1; // a is not the hovered element, send "a" to the back
                    else return 1;
                });

                let title = select(this).append('foreignObject')
                    .attr('id', 'nodeTitle')
                    .attr('class', 'nodeTitleBox_')
                    .attr('x', d.value + 8)
                    .attr('y', -d.value)
                    .attr('width', 150)
                    .attr('height', 200);

                title.append('xhtml:div')
                    .attr('class', 'nodeLecturer')
                    .html(d.Lecturer);

                title.append('xhtml:div')
                    .attr('class', 'nodeTitle')
                    .html(d.id);

                node.filter(q => q.id != d.id)
                    .style('opacity', 0.25);
            }
        })
        .on('mouseout', (d, i) => {
            if (d.nodeType == DataView.VIDEO) {
                node.style('opacity', 1.0);
                select('#nodeTitle').remove();
            }
        })

    node.append('circle')
        .attr('stroke', '#DDD')
        .attr('stroke-width', d => d.value > 10 ? 1 : 0)
        .attr('r', d => d.value)
        .attr('fill', d => d.color)
        .on("mouseover", function(d) {
            select(this)
                .attr('fill', '#a5e2ff');
        })
        .on("mouseout", function(d) {
            select(this)
                .attr('fill', d.color);
        });

    node.append('foreignObject')
        .filter(d => d.nodeType != DataView.VIDEO)
        .attr('class', 'nodeTextBox')
        .attr('x', d => -d.value)
        .attr('y', d => -d.value)
        .attr('width', d => d.value * 2)
        .attr('height', d => d.value * 2)
        .append('xhtml:body')
        .attr('class', 'nodeTextBoxBody')
        .html(d => d.id);

    simulation.on('tick', () => {
        node
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
    });
}

export default DataView;