import './style.css';
import showKeywordView from './KeywordView';
import showVideoView from './VideoView';
import createSideBar from './SideBar';

function nodeClicked(id) {
    showVideoView(id, backButtonClicked);
}

function backButtonClicked() {
    showKeywordView(nodeClicked);
}

showKeywordView(nodeClicked);

createSideBar(backButtonClicked);