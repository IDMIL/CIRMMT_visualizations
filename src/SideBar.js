import './SideBar.css';
import data from './Globals';
import Fuse from 'fuse.js';

let SideBar = {};

let element;
let sideBarFrontContainer;
let sideBarFrontLabel;
let searchBar;
let videoList;

const Mode = {
    DEFAULT: 0,
    VIDEO: 1
}

let mode = Mode.DEFAULT;

const NUM_LATEST_VIDEOS = 5;

function updateVideoList(list, onListItemClicked, isSearchResults) {
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
    }

    if (isSearchResults) {
        sideBarFrontLabel.innerHTML = `Search results (${list.length} of ${data.length})`;
    } else {
        sideBarFrontLabel.innerHTML = `Latest videos (${list.length} of ${data.length})`;
    }

    list.forEach((d) => {
        let videoListItem = document.createElement('div');
        videoListItem.classList.add('videoListItem');
        videoListItem.onclick = function() {
            onListItemClicked(d.YouTube);
        }

        let videoListItemThumb = new Image();
        videoListItemThumb.classList.add('videoListItemThumb');
        videoListItemThumb.src = `http://img.youtube.com/vi/${d.YouTube}/3.jpg`;
        videoListItem.appendChild(videoListItemThumb);

        let videoListItemDescription = document.createElement('div');
        videoListItemDescription.classList.add('videoListItemDescription');
        videoListItem.appendChild(videoListItemDescription);

        let videoListItemLecturer = document.createElement('div');
        videoListItemLecturer.classList.add('videoListItemLecturer');
        videoListItemLecturer.innerHTML = d.Lecturer;
        videoListItemDescription.appendChild(videoListItemLecturer);

        let videoListItemDate = document.createElement('div');
        videoListItemDate.classList.add('videoListItemDate');
        let dateObj = new Date(d.Date);
        videoListItemDate.innerHTML = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        videoListItemDescription.appendChild(videoListItemDate);
        videoList.appendChild(videoListItem);

        let videoListItemTitle = document.createElement('div');
        videoListItemTitle.classList.add('videoListItemTitle');
        videoListItemTitle.innerHTML = d.Title;
        videoListItemDescription.appendChild(videoListItemTitle);
        videoList.appendChild(videoListItem);
    });
}

SideBar.createSideBar = function(backButtonClicked, onSearch, onListItemClicked) {
    element = document.createElement('div');
    element.id = 'sideBar';

    sideBarFrontContainer = document.createElement('div');
    sideBarFrontContainer.id = 'sideBarFrontContainer';
    element.appendChild(sideBarFrontContainer);

    // Search bar
    let searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('searchBarContainer');
    sideBarFrontContainer.appendChild(searchBarContainer);

    searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search for lecturers, topics, affiliation, country, etc.';
    searchBar.classList.add('searchBar');
    searchBarContainer.appendChild(searchBar);

    sideBarFrontLabel = document.createElement('div');
    sideBarFrontLabel.id = 'sideBarFrontLabel';
    sideBarFrontContainer.appendChild(sideBarFrontLabel);

    document.body.appendChild(element);

    let timeout = null;

    searchBar.onkeyup = function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (searchBar.value != '') {
                var options = {
                    shouldSort: true,
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    keys: [
                        'Title',
                        'Lecturer',
                        'Topic',
                        'Keywords',
                        'Summary',
                        'Affiliation',
                        'Country'
                    ]
                };
                var fuse = new Fuse(data, options);
                updateVideoList(fuse.search(searchBar.value), onListItemClicked, true);
            } else {
                updateVideoList(data.slice(-NUM_LATEST_VIDEOS), onListItemClicked, false);
            }
        }, 400);
    }

    searchBar.focus();

    // Video list
    videoList = document.createElement('div');
    videoList.id = 'videoList';
    sideBarFrontContainer.appendChild(videoList);

    updateVideoList(data.slice(-NUM_LATEST_VIDEOS), onListItemClicked, false);
}

SideBar.focus = function() {
    searchBar.focus();
}

SideBar.showDefaultMode = function() {
    element.style.width = '35%';

    let elem = document.getElementById('playerContainer');
    if (elem) {
        elem.parentNode.removeChild(elem);
    }

    setTimeout(() => {
        sideBarFrontContainer.style.display = 'block';
        mode = Mode.DEFAULT;
        searchBar.focus();
    }, 500);
}

SideBar.showVideo = function(url) {
    let node;
    data.forEach((d) => {
        if (d.YouTube == url) {
            node = d;
        }
    });

    document.title = node.Lecturer + ': ' + node.Title;

    let elem = document.getElementById('playerContainer');
    if (elem) {
        elem.parentNode.removeChild(elem);
    }

    let playerContainer = document.createElement('div');
    playerContainer.id = 'playerContainer';

    let playerLecturer = document.createElement('div');
    playerLecturer.id = 'playerLecturer';
    playerLecturer.innerHTML = node.Lecturer;
    playerContainer.appendChild(playerLecturer);

    let playerAffiliation = document.createElement('div');
    playerAffiliation.id = 'playerAffiliation';
    playerAffiliation.innerHTML = `${node.Affiliation}, ${node.Country}`;
    playerContainer.appendChild(playerAffiliation);

    let playerTitle = document.createElement('div');
    playerTitle.id = 'playerTitle';
    playerTitle.innerHTML = node.Title;
    playerContainer.appendChild(playerTitle);

    let playerDate = document.createElement('div');
    let dateObj = new Date(node.Date);
    playerDate.id = 'playerDate';
    playerDate.innerHTML = node.Type + ', ' + dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    playerContainer.appendChild(playerDate);

    let player = document.createElement('player');
    playerContainer.appendChild(player);
    player.id = 'ytvideo';

    let playerSummary = document.createElement('div');
    playerSummary.id = 'playerSummary';
    playerSummary.innerHTML = node.Summary;
    playerContainer.appendChild(playerSummary);

    sideBarFrontContainer.style.display = 'none';
    element.style.width = '45%';

    setTimeout(() => {
        element.appendChild(playerContainer);

        let player = new YT.Player('ytvideo', {
            height: '180',
            width: '320',
            videoId: node.YouTube
        });

        mode = Mode.VIDEO;
    }, mode == Mode.DEFAULT ? 500 : 0);
}

export default SideBar;