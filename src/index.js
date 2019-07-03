import './index.css';
import data from './data.csv';

import DataView from './DataView';
import SideBar from './SideBar';
import QueryString from 'query-string';

// Load YouTube Player API code asynchronously.
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ViewMode = {
    DEFAULT: 'default',
    TOPIC: 'topic',
    RESEARCH_AXIS: 'researchAxis',
    VIDEO: 'video'
}

let state = {
    mode: ViewMode.DEFAULT,
    node: null,
};

function createURLFromState() {
    return `?mode=${state.mode}&node=${state.node}`;
}

function videoClicked(selectedNode) {
    state.mode = ViewMode.VIDEO;
    state.node = selectedNode.id;
    window.history.replaceState(state, null, createURLFromState());
    // document.title = 
    // console.log(node);
    update();
}

function backButtonClicked() {
    state.mode = ViewMode.DEFAULT;
    window.history.replaceState(state, null, window.location.pathname);
    update();
}

function nodeClicked(selectedNode) {
    if (selectedNode.nodeType == DataView.RESEARCH_AXIS) {
        state.mode = ViewMode.RESEARCH_AXIS;
        state.node = selectedNode.id;
        window.history.replaceState(state, null, createURLFromState());
    } else {
        state.mode = ViewMode.TOPIC;
        state.node = selectedNode.id;
        window.history.replaceState(state, null, createURLFromState());
    }
    update();
}

function onSearch(results) {}

function onListItemClicked(url) {
    state.mode = ViewMode.VIDEO;
    state.node = url;
    window.history.replaceState(state, null, createURLFromState());
    update();
}

function update() {
    if (state.mode == ViewMode.DEFAULT) {
        SideBar.showDefaultMode();
        DataView.showDefaultView(nodeClicked);
        document.getElementById('container').style.width = '65%';
    } else if (state.mode == ViewMode.TOPIC) {
        SideBar.showDefaultMode();
        DataView.showTopicView(state.node, videoClicked, backButtonClicked);
        document.getElementById('container').style.width = '65%';
    } else if (state.mode == ViewMode.RESEARCH_AXIS) {
        DataView.showResearchAxisView(
            state.node,
            videoClicked,
            nodeClicked,
            backButtonClicked);
    } else if (state.mode == ViewMode.VIDEO) {
        SideBar.showVideo(state.node);
        document.getElementById('container').style.width = '55%';
    }
}

window.onpopstate = function(event) {
    if (event.state) { state = event.state; }
    update();
}

let queryState = QueryString.parse(location.search);
if (queryState.mode && queryState.node) {
    state = queryState;
    if (state.mode == ViewMode.VIDEO) {
        DataView.showDefaultView(nodeClicked);
    }
}

window.history.replaceState(state, null, '');

SideBar.createSideBar(backButtonClicked, onSearch, onListItemClicked);
update();