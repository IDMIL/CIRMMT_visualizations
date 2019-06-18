import './style.css';
import DataView from './DataView';
import SideBar from './SideBar';


function videoClicked(node) {
    SideBar.showVideo(node);
    let container = document.getElementById('container');
    container.style.width = '55%';
}

function backButtonClicked() {
    SideBar.showDefaultMode();
    DataView.showKeywordView(nodeClicked);
    container.style.width = '65%';
}

function nodeClicked(id, isResearchAxis) {
    if (isResearchAxis) {
        DataView.showResearchAxisView(
            id,
            videoClicked,
            DataView.showVideoView,
            backButtonClicked);
    } else {
        DataView.showVideoView(id, videoClicked, backButtonClicked);
    }
}

function onSearch(results) {
    DataView.showSearchResults(results);
}

DataView.showKeywordView(nodeClicked);
SideBar.createSideBar(backButtonClicked, onSearch);