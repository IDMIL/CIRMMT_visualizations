import './style.css';
import showKeywordView from './KeywordView';
import showVideoView from './VideoView';
import SideBar from './SideBar';


function videoClicked(node) {
    SideBar.showVideo(node);
    let container = document.getElementById('container');
    container.style.width = '60%';
}

function backButtonClicked() {
    SideBar.showDefaultMode();
    showKeywordView(nodeClicked);
    container.style.width = '70%';
}

function nodeClicked(id) {
    showVideoView(id, videoClicked, backButtonClicked);
}

showKeywordView(nodeClicked);

SideBar.createSideBar(backButtonClicked);