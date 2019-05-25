import * as d3 from 'd3';
import data from './data.csv';

const width = 1280;
const height = 650;

function showOverviewMode() {
    let color = d3.scaleOrdinal().range(["LightCyan", "LightGreen"]).domain([40, 60]);

    let nodes = {};
    let links = [];

    data.forEach(function(d) {
        nodes[d.MainLevel] = { id: d.MainLevel, value: 60 };
        nodes[d.Level1] = { id: d.Level1, value: 40 };
        let l = {};
        l.source = d.MainLevel;
        l.target = d.Level1;
        links.push(l);
    });

    nodes = Object.values(nodes);

    // console.log(data);
    // console.log(links);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(60).strength(0.3));


    const svg = d3.select("#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "10pt sans-serif")
        .attr("class", "graph");

    const link = svg.append("g")
        .attr("stroke", "Thistle")
        // .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 4);

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
        .attr("stroke", "Thistle")
        .attr("stroke-width", 4)
        .attr("r", d => d.value)
        .attr("fill", d => color(d.value));

    node.append("text")
        .text(d => d.id)
        .attr("text-anchor", "middle")
        .attr("fill", "#000");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    });

    // d3.selectAll("foreignObject").attr("x", -38).attr("y", -20);

};

// function showVideoMode() {
//     d3.csv("data/data.csv").then(function(data) {
//         let selectedNode = "Perception";
//         let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 10));

//         let nodes = {};
//         let links = [];

//         data.forEach(function(d) {
//             if (d.Level1 == selectedNode) {
//                 nodes[d.Level1] = { id: d.Level1, value: 10 };
//                 nodes[d.Title] = { id: d.Title, value: 25, Lecturer: d.Lecturer };
//                 let l = {};
//                 l.source = d.Level1;
//                 l.target = d.Title;
//                 links.push(l);
//             }
//         });

//         nodes = Object.values(nodes);

//         const simulation = d3.forceSimulation(nodes)
//             .force("link", d3.forceLink(links).id(d => d.id).strength(-0.018))
//             .force("charge", d3.forceManyBody())
//             .force("center", d3.forceCenter(width / 2, height / 2));

//         const svg = d3.select("body").append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .style("font", "12px sans-serif");

//         const link = svg.append("g")
//             .attr("stroke", "#CCC")
//             .selectAll("line")
//             .data(links)
//             .join("line")
//             .attr("stroke-width", 1);

//         const node = svg.append("g")
//             .selectAll("g")
//             .data(nodes)
//             .join("g")
//             .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

//         node.append("circle")
//             .attr("stroke", "#AAA")
//             .attr("stroke-width", 1.5)
//             .attr("r", d => d.value)
//             .attr("fill", d => color(d.value));

//         node.append("text")
//             .text(d => {
//                 if (d.Lecturer) {
//                     return d.Lecturer + ": " + d.id;
//                 } else {
//                     return d.id;
//                 }
//             })
//             .attr("fill", "#000")
//             .attr("transform", d => "translate(" + (d.value + 4) + "," + 3 + ")");

//         simulation.on("tick", () => {
//             link
//                 .attr("x1", d => d.source.x)
//                 .attr("y1", d => d.source.y)
//                 .attr("x2", d => d.target.x)
//                 .attr("y2", d => d.target.y);
//             node
//                 .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
//         });
// }

showOverviewMode();