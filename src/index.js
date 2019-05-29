import './style.css';
import showKeywordView from './KeywordView';
import showVideoView from './VideoView';
import SideBar from './SideBar';

function videoClicked(node) {
    SideBar.showVideo(node);
}

function nodeClicked(id) {
    showVideoView(id, videoClicked, backButtonClicked);
}

function backButtonClicked() {
    showKeywordView(nodeClicked);
}

showKeywordView(nodeClicked);

SideBar.createSideBar(backButtonClicked);