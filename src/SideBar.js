import './SideBar.css';
import data from './data.csv';
import Fuse from 'fuse.js';
import logo from './logo.png';

let SideBar = {};

let element;
let sideBarFrontContainer;
let searchBar;
let videoList;

const Mode = {
    DEFAULT: 0,
    VIDEO: 1
}

let mode = Mode.DEFAULT;

function updateVideoList(list, onListItemClicked) {
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
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
    element.classList.add('sideBar');

    sideBarFrontContainer = document.createElement('div');
    element.appendChild(sideBarFrontContainer);

    // let sideBarTop = document.createElement('div');
    // sideBarTop.classList.add('sideBarTop');
    // sideBarFrontContainer.appendChild(sideBarTop);

    // Logo
    // const sideBarLogo = new Image();
    // sideBarLogo.src = logo;
    // sideBarLogo.style.width = '15%';
    // sideBarTop.appendChild(sideBarLogo);

    // Title
    // let sideBarTitle = document.createElement('div');
    // sideBarTitle.classList.add('sideBarTitle');
    // let title1 = document.createElement('div');
    // title1.classList.add('sideBarTitleSpacing');
    // title1.innerHTML = '<span>D</span><span>I</span><span>S</span><span>T</span><span>I</span><span>N</span><span>G</span><span>U</span><span>I</span><span>S</span><span>H</span><span>E</span><span>D</span>';
    // sideBarTitle.appendChild(title1);
    // let title2 = document.createElement('div');
    // title2.classList.add('sideBarTitleSpacing');
    // title2.innerHTML = '<span>L</span><span>E</span><span>C</span><span>T</span><span>U</span><span>R</span><span>E</span><span>S</span>';
    // sideBarTitle.appendChild(title2);

    // sideBarTitle.innerHTML = 'Centre for Interdisciplinary Research in Music Media and Technology';
    // sideBarTop.appendChild(sideBarTitle);

    // let sideBarSubTitle = document.createElement('div');
    // sideBarSubTitle.classList.add('sideBarSubTitle');
    // sideBarSubTitle.innerHTML = 'Speaker Series Video Browser';
    // sideBarFrontContainer.appendChild(sideBarSubTitle);

    // Search bar
    let searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('searchBarContainer');
    sideBarFrontContainer.appendChild(searchBarContainer);

    searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search';
    searchBar.classList.add('searchBar');
    searchBarContainer.appendChild(searchBar);

    document.body.appendChild(element);

    let timeout = null;

    searchBar.onkeyup = function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (searchBar.value != '') {
                var options = {
                    shouldSort: true,
                    threshold: 0.1,
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
                        'Affiliation'
                    ]
                };
                var fuse = new Fuse(data, options);
                updateVideoList(fuse.search(searchBar.value), onListItemClicked);
            }
        }, 400);
    }

    searchBar.focus();

    // Video list
    videoList = document.createElement('div');
    videoList.id = 'videoList';
    sideBarFrontContainer.appendChild(videoList);

    updateVideoList(data.filter(d => d.Title).slice(-5), onListItemClicked);
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
    })

    let elem = document.getElementById('playerContainer');
    if (elem) {
        elem.parentNode.removeChild(elem);
    }

    let playerContainer = document.createElement('div');
    playerContainer.id = 'playerContainer';

    let playerLecturer = document.createElement('div');
    playerLecturer.classList.add('playerLecturer');
    playerLecturer.innerHTML = node.Lecturer;
    playerContainer.appendChild(playerLecturer);

    let playerAffiliation = document.createElement('div');
    playerAffiliation.classList.add('playerAffiliation');
    playerAffiliation.innerHTML = node.Affiliation;
    playerContainer.appendChild(playerAffiliation);

    let playerTitle = document.createElement('div');
    playerTitle.classList.add('playerTitle');
    playerTitle.innerHTML = node.Title;
    playerContainer.appendChild(playerTitle);

    let playerDate = document.createElement('div');
    let dateObj = new Date(node.Date);
    playerDate.classList.add('playerDate');
    playerDate.innerHTML = node.Type + ', ' + dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    playerContainer.appendChild(playerDate);

    let player = document.createElement('player');
    playerContainer.appendChild(player);
    player.id = 'ytvideo';

    let playerSummary = document.createElement('div');
    playerSummary.classList.add('playerSummary');
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