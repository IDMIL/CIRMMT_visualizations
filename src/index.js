import './index.css';
import logo from './logo.png';

import data from './Globals';
import DataView from './DataView';
import SideBar from './SideBar';
import QueryString from 'query-string';

let ViewMode = {
    DEFAULT: 'default',
    TOPIC: 'topic',
    RESEARCH_AXIS: 'researchAxis',
    VIDEO: 'video',
    ABOUT: 'about'
}

let state = {
    mode: ViewMode.DEFAULT,
    node: null,
};

let siteTitle = document.createElement('div');
siteTitle.id = 'siteTitle';
document.body.appendChild(siteTitle);

let siteLogo = new Image();
siteLogo.src = logo;
siteLogo.id = 'siteLogo';
siteTitle.appendChild(siteLogo);

let siteTitleText = document.createElement('div');
siteTitleText.id = 'siteTitleText';
siteTitleText.innerHTML = 'CIRMMT Distinguished Speaker Series Visualization';
siteTitle.appendChild(siteTitleText);

let siteAbout = document.createElement('div');
siteAbout.id = 'siteAbout';
siteAbout.innerHTML = 'about';
siteTitle.appendChild(siteAbout);

let aboutContainer = document.createElement('div');
aboutContainer.id = 'aboutContainer';
aboutContainer.style.display = 'none';
document.body.appendChild(aboutContainer);

let aboutContent = document.createElement('div');
aboutContent.id = 'aboutContent';
aboutContent.innerHTML = 'Developed at Input Devices and Music Interaction Laboratory (IDMIL) for <br>Centre for Interdisciplinary Research in Music Media and Technology (CIRMMT) by <br>Mathias Bredholt, Christian Frisson, and Marcelo Wanderley.<br><br>&copy; McGill University 2019';
aboutContainer.appendChild(aboutContent);

function showAbout() {
    aboutContainer.style.display = 'flex';
}

function hideAbout() {
    aboutContainer.style.display = 'none';
}

siteAbout.onclick = function() {
    if (state.mode != ViewMode.ABOUT) {
        state.mode = ViewMode.ABOUT;
        state.node = null;
        window.history.pushState(state, null, createURLFromState());
    } else {
        state.mode = ViewMode.DEFAULT;
        window.history.pushState(state, null, window.location.pathname);
    }
    update();
}

function createURLFromState() {
    return `?mode=${state.mode}&node=${state.node}`;
}

function videoClicked(selectedNode) {
    state.mode = ViewMode.VIDEO;
    state.node = selectedNode.id;
    window.history.pushState(state, null, createURLFromState());
    update();
}

function backButtonClicked() {
    state.mode = ViewMode.DEFAULT;
    window.history.pushState(state, null, window.location.pathname);
    update();
}

function nodeClicked(selectedNode) {
    if (selectedNode.nodeType == DataView.RESEARCH_AXIS) {
        // state.mode = ViewMode.RESEARCH_AXIS;
        // state.node = selectedNode.id;
        // window.history.pushState(state, null, createURLFromState());
        SideBar.focus();
    } else {
        state.mode = ViewMode.TOPIC;
        state.node = selectedNode.id;
        window.history.pushState(state, null, createURLFromState());
    }
    update();
}

function onSearch(results) {}

function onListItemClicked(url) {
    state.mode = ViewMode.VIDEO;
    state.node = url;
    window.history.pushState(state, null, createURLFromState());
    update();
}

function update() {
    if (state.mode == ViewMode.DEFAULT) {
        hideAbout();
        DataView.show();
        SideBar.showDefaultMode();
        DataView.showDefaultView(nodeClicked);
        document.getElementById('container').style.width = '65%';
        document.title = 'CIRMMT Distinguished Speaker Series Visualization';
    } else if (state.mode == ViewMode.TOPIC) {
        hideAbout();
        DataView.show();
        SideBar.showDefaultMode();
        DataView.showTopicView(state.node, videoClicked, backButtonClicked);
        document.getElementById('container').style.width = '65%';
        document.title = state.node;
        // } else if (state.mode == ViewMode.RESEARCH_AXIS) {
        //     DataView.show();
        //     hideAbout();
        //     DataView.showResearchAxisView(
        //         state.node,
        //         videoClicked,
        //         nodeClicked,
        //         backButtonClicked);
    } else if (state.mode == ViewMode.VIDEO) {
        hideAbout();
        DataView.show();
        SideBar.showVideo(state.node);
        document.getElementById('container').style.width = '55%';
    } else if (state.mode == ViewMode.ABOUT) {
        SideBar.showDefaultMode();
        DataView.hide();
        showAbout();
        document.getElementById('container').style.width = '65%';
        document.title = 'About';
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

function start() {
    SideBar.createSideBar(backButtonClicked, onSearch, onListItemClicked);
    update();
}

// Load YouTube Player API code asynchronously.
let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Load YouTube Data API code asynchronously.
tag = document.createElement('script');
tag.src = 'https://apis.google.com/js/client.js';
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.gapi_onload = function() {
    gapi.client.setApiKey('AIzaSyC85M7HHPkTkhImeOapMjvEgFbkMeo570Y');
    gapi.client.load('youtube', 'v3', function() {
        for (let i = 0; i < data.length; i++) {
            gapi.client.youtube.videos.list({
                'part': 'statistics',
                'id': data[i].YouTube
            }).then(response => {
                data[i].viewCount = response.result.items[0].statistics.viewCount;
                if (i == data.length - 1) {
                    start();
                }
            }, function(err) { console.error('Execute error', err); });
        }
    });
}