import * as d3 from 'd3';
import data from './data.csv';

const width = 700;
const height = 700;

function showVideoView(selectedNode, keywordNodeClicked) {
    let list = document.getElementsByClassName("graph");
    while (list[0]) {
        list[0].parentNode.removeChild(list[0]);
    }

    let color = d3.scaleOrdinal().range(["LightCyan", "LightGreen"]).domain([40, 60]);

    let nodes = {};
    let links = [];

    data.forEach(function(d) {
        if (d.Level1 == selectedNode) {
            nodes[d.Level1] = { id: d.Level1, value: 60 };
            nodes[d.Title] = { id: d.Title, value: 30, Lecturer: d.Lecturer };
            let l = {};
            l.source = d.Level1;
            l.target = d.Title;
            links.push(l);
        }
    });

    nodes = Object.values(nodes);

    let simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(200))
        .force("charge", d3.forceManyBody().strength(-2000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(60).strength(0.4));

    let svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("class", "graph");

    let link = svg.append("g")
        .attr("stroke", "Thistle")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 4);

    let node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
        .attr("stroke", "Thistle")
        .attr("stroke-width", 4)
        .attr("r", d => d.value)
        .attr("fill", d => color(d.value));

    let title = node.append("text")
        .text(d => {
            if (d.Lecturer) {
                return d.Lecturer;
            } else {
                return d.id;
            }
        })
        .attr("class", "nodeText")
        .attr("text-anchor", d => {
            if (d.Lecturer) {
                return "left";
            } else {
                return "middle";
            }
        });
    // .attr("transform", d => "translate(" + (d.value + 4) + "," + 3 + ")");


    title.append("tspan")
        .text(d => {
            if (d.Lecturer) {
                return d.id;
            }
        })
        .attr("class", "nodeText")
        .attr("x", 0)
        .attr("dy", "1em");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    });

    node.on("click", d => {
        if (d.Lecturer) {
            // keywordNodeClicked();
        } else {
            keywordNodeClicked();
        }
    })
}

export default showVideoView;