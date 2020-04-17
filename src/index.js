import './index.css';
import logo from './logo.png';

import { data } from './Globals';
import DataView from './DataView';
import SideBar from './SideBar';
import _ from 'lodash';

let ViewMode = {
    DEFAULT: 'default',
    TOPIC: 'topic',
    RESEARCH_AXIS: 'researchAxis'
}

let SideBarMode = {
    DEFAULT: 'default',
    VIDEO: 'video' 
}

const defaultState = {
    mode: ViewMode.DEFAULT,
    sidebar: SideBarMode.DEFAULT,
    node: "",
    topic: "",
    researchAxis: "",
    about: false
}

let state = Object.assign({}, defaultState);

let lastState = {
    mode: null,
    sidebar: null,
    node: null,
    topic: null,
    about: null,
};

function createTitle(parent) {
    let siteTitle = document.createElement('div');
    siteTitle.id = 'siteTitle';
    parent.appendChild(siteTitle);

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
    aboutContainer.style.opacity = 0;
    parent.appendChild(aboutContainer);

    let aboutContent = document.createElement('div');
    aboutContent.id = 'aboutContent';
    aboutContent.innerHTML = 'Developed at Input Devices and Music Interaction Laboratory (IDMIL) for <br>Centre for Interdisciplinary Research in Music Media and Technology (CIRMMT) by <br>Mathias Bredholt, Christian Frisson, and Marcelo Wanderley.<br><br>&copy; McGill University 2019';
    aboutContainer.appendChild(aboutContent);

    siteAbout.onclick = function() {
        state.about = true;
        window.history.pushState(state, null, createURLFromState());
        update();
    }

    aboutContainer.onclick = function() {
        state.about = false;
        window.history.pushState(state, null, createURLFromState());
        update();
    }

}

function createURLFromState() {
    let str = `?/${state.researchAxis}`;
    if (state.mode == ViewMode.RESEARCH_AXIS) {
        return str;
    } else if (state.mode == ViewMode.TOPIC) {
        str += `/${state.topic}`;
        if (state.sidebar == SideBarMode.VIDEO) {
            str += `/${state.node.Lecturer}`;
        }
        return str;
    } else {
        return '?';
    }
}

function videoClicked(node) {
    state.mode = ViewMode.TOPIC;
    state.sidebar = SideBarMode.VIDEO;
    state.node = node;
    state.topic = state.node.Topic;
    window.history.pushState(state, null, createURLFromState());
    update();
}

function nodeClicked(selectedNode) {
    if (selectedNode.nodeType == DataView.RESEARCH_AXIS) {
        state.mode = ViewMode.RESEARCH_AXIS;
        state.researchAxis = selectedNode.ResearchAxis;
        window.history.pushState(state, null, createURLFromState());
    } else {
        state.mode = ViewMode.TOPIC;
        state.topic = selectedNode.Topic;
        window.history.pushState(state, null, createURLFromState());
    }
    update();
}

function backButtonClicked() {
    state.mode = ViewMode.DEFAULT;
    state.sidebar = ViewMode.DEFAULT;
    window.history.pushState(state, null, createURLFromState());
    update();
}

function onSearch(results) {}

function update() {
    if (state.mode != lastState.mode) {
        if (state.mode == ViewMode.DEFAULT) {
            DataView.showDefaultView(nodeClicked);
            document.title = 'CIRMMT Distinguished Speaker Series Visualization';
        } else if (state.mode == ViewMode.RESEARCH_AXIS) {
            DataView.showResearchAxisView(state.researchAxis, nodeClicked, backButtonClicked);
            document.title = state.researchAxis;
        } else if (state.mode == ViewMode.TOPIC) {
            DataView.showTopicView(state.topic, videoClicked, backButtonClicked);
            document.title = state.topic;
        }
    }
    if (state.sidebar != lastState.sidebar ||
        state.node != lastState.node) {
        if (state.sidebar == SideBarMode.DEFAULT) {
            SideBar.showDefaultMode();
            document.getElementById('container').style.width = '65%';
        } else if (state.sidebar == SideBarMode.VIDEO) {
            SideBar.showVideo(state.node);
            document.getElementById('container').style.width = '55%';
        }
    }
    if (state.about != lastState.about) {
        if (state.about) {
            aboutContainer.style.opacity = 0.9;
            aboutContainer.style.visibility = 'visible';
        } else {
            aboutContainer.style.opacity = 0.0;
            aboutContainer.style.visibility = 'hidden';
        }
    }
    lastState = _.clone(state);
}

function loadYouTubeAPI() {
    window.gapi_onload = function() {
        gapi.client.setApiKey('AIzaSyC85M7HHPkTkhImeOapMjvEgFbkMeo570Y');
        gapi.client.load('youtube', 'v3', function() {
            let urls = data.map(d => d.YouTube);
            let groups = _.chunk(urls, 50);
            const num_requests = groups.length;
            let r = 0;
            groups.forEach(g => {
                gapi.client.youtube.videos.list({
                    'part': 'statistics',
                    'id': g.join(',')
                }).then(response => {
                    response.result.items.forEach(d => {
                        let v = data.find(q => q.YouTube == d.id);
                        if (v) {
                            v.viewCount = d.statistics.viewCount;
                        }
                    });
                    ++r;
                    if (r == num_requests) {
                        console.log('Retrieved data from YouTube API.');
                    }
                }, err => {
                    console.error('Execute error', err);
                });
            });
        });
    }
}

function parseStateFromURL() {
    state = Object.assign({}, defaultState);
    // Parse address string
    location.search.replace('?/','').split('/').filter(d => d != '').map((d, i) => {
        d = d.replace(/%20/g, ' ');
        if (i == 0) {
            state.mode = ViewMode.RESEARCH_AXIS;
            state.researchAxis = d;
        } else if (i == 1) {
            state.mode = ViewMode.TOPIC;
            state.topic = d;
        } else if (i == 2) {
            state.mode = ViewMode.TOPIC;
            state.sidebar = SideBarMode.VIDEO;
            state.node = data.find(v => v.Lecturer == d);
            state.topic = state.node.Topic;
        }
    });
}

function start() {
    let container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    createTitle(container);

    window.onpopstate = function(event) {
        parseStateFromURL();
        update();
    }

    siteLogo.onclick = e => backButtonClicked();

    SideBar.createSideBar(backButtonClicked, onSearch, videoClicked);

    parseStateFromURL();
    update();
    loadYouTubeAPI();
}

start();
