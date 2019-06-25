import './style.css';
import DataView from './DataView';
import SideBar from './SideBar';

// Load YouTube Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onpopstate = function(event) {
    console.log(window.location);
};

let ViewMode = {
    DEFAULT: 0,
    TOPIC: 1,
    RESEARCH_AXIS: 2,
    VIDEO: 3
}

let state = {
    mode: ViewMode.DEFAULT,
    node: null,
};

function videoClicked(node) {
    state.mode = ViewMode.VIDEO;
    state.node = node;
    window.history.pushState(state, null, '');
    render();
}

function backButtonClicked() {
    window.history.back();
}

function nodeClicked(node) {
    if (node.nodeType == DataView.RESEARCH_AXIS) {
        state.mode = ViewMode.RESEARCH_AXIS;
        state.node = node;
        window.history.pushState(state, null, '');
    } else {
        state.mode = ViewMode.TOPIC;
        state.node = node;
        window.history.pushState(state, null, '');
    }
    render();
}

function onSearch(results) {
    DataView.showSearchResults(results);
}

function render() {
    if (state.mode == ViewMode.DEFAULT) {
        SideBar.showDefaultMode();
        DataView.showDefaultView(nodeClicked);
        document.getElementById('container').style.width = '65%';
    } else if (state.mode == ViewMode.TOPIC) {
        SideBar.showDefaultMode();
        DataView.showTopicView(state.node.id, videoClicked, backButtonClicked);
        document.getElementById('container').style.width = '65%';
    } else if (state.mode == ViewMode.RESEARCH_AXIS) {
        console.log('RESEARCH_AXIS');
        DataView.showResearchAxisView(
            state.node.id,
            videoClicked,
            DataView.showVideoView,
            backButtonClicked);
    } else if (state.mode == ViewMode.VIDEO) {
        SideBar.showVideo(state.node);
        document.getElementById('container').style.width = '55%';
    }
}

window.onpopstate = function(event) {
    if (event.state) { state = event.state; }
    render();
}

window.history.replaceState(state, null, '');
SideBar.createSideBar(backButtonClicked, onSearch);
render();