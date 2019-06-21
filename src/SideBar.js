import Fuse from 'fuse.js';
import data from './data.csv';
import logo from './logo.png';

let element;
let sideBarFrontContainer;
let SideBar = {};
let searchBar;

const Mode = {
    DEFAULT: 0,
    VIDEO: 1
}

let mode = Mode.DEFAULT;

SideBar.createSideBar = function(backButtonClicked, onSearch) {
    element = document.createElement('div');
    element.classList.add('sideBar');

    sideBarFrontContainer = document.createElement('div');
    element.appendChild(sideBarFrontContainer);

    let sideBarTop = document.createElement('div');
    sideBarTop.classList.add('sideBarTop');
    sideBarFrontContainer.appendChild(sideBarTop);

    const sideBarLogo = new Image();
    sideBarLogo.src = logo;
    sideBarLogo.style.width = '25%';
    sideBarTop.appendChild(sideBarLogo);

    let sideBarTitle = document.createElement('div');
    sideBarTitle.classList.add('sideBarTitle');
    let title1 = document.createElement('div');
    title1.classList.add('sideBarTitleSpacing');
    title1.innerHTML = '<span>D</span><span>I</span><span>S</span><span>T</span><span>I</span><span>N</span><span>G</span><span>U</span><span>I</span><span>S</span><span>H</span><span>E</span><span>D</span>';
    sideBarTitle.appendChild(title1);
    let title2 = document.createElement('div');
    title2.classList.add('sideBarTitleSpacing');
    title2.innerHTML = '<span>L</span><span>E</span><span>C</span><span>T</span><span>U</span><span>R</span><span>E</span><span>S</span>';
    sideBarTitle.appendChild(title2);
    // sideBarTitle
    // sideBarTitle.classList.add('sideBarTitle');
    // sideBarTitle.innerHTML = 'Distinguished Lectures';
    sideBarTop.appendChild(sideBarTitle);

    let searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('searchBarContainer');
    sideBarFrontContainer.appendChild(searchBarContainer);

    searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search';
    searchBar.classList.add('searchBar');
    searchBarContainer.appendChild(searchBar);

    document.body.appendChild(element);

    searchBar.focus();

    searchBar.onkeyup = function() {
        var options = {
            shouldSort: true,
            threshold: 0.1,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                'Title',
                'Lecturer'
            ]
        };
        var fuse = new Fuse(data, options);
        // onSearch(fuse.search(searchBar.value));
    }

    // let backButton = document.createElement('div');
    // backButton.classList.add('button');
    // backButton.innerHTML = 'Back';
    // backButton.onclick = backButtonClicked;
    // element.appendChild(backButton);
}

SideBar.showDefaultMode = function() {
    element.style.width = '35%';

    let elem = document.getElementById('videoContainer');
    if (elem) {
        elem.parentNode.removeChild(elem);
    }

    setTimeout(() => {
        sideBarFrontContainer.style.display = 'block';
        mode = Mode.DEFAULT;
        searchBar.focus();
    }, 500);
}

SideBar.showVideo = function(node) {
    let elem = document.getElementById('videoContainer');
    if (elem) {
        elem.parentNode.removeChild(elem);
    }

    let videoContainer = document.createElement('div');
    videoContainer.id = 'videoContainer';

    let videoLecturer = document.createElement('div');
    videoLecturer.classList.add('videoLecturer');
    videoLecturer.innerHTML = node.Lecturer;
    videoContainer.appendChild(videoLecturer);

    let videoAffiliation = document.createElement('div');
    videoAffiliation.classList.add('videoAffiliation');
    videoAffiliation.innerHTML = node.Affiliation;
    videoContainer.appendChild(videoAffiliation);

    let videoTitle = document.createElement('div');
    videoTitle.classList.add('videoTitle');
    videoTitle.innerHTML = node.id;
    videoContainer.appendChild(videoTitle);

    let videoDate = document.createElement('div');
    let dateObj = new Date(node.Date);
    videoDate.classList.add('videoDate');
    videoDate.innerHTML = node.Type + ', ' + dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    videoContainer.appendChild(videoDate);

    let video = document.createElement('video');
    videoContainer.appendChild(video);
    video.id = 'ytvideo';

    let videoSummary = document.createElement('div');
    videoSummary.classList.add('videoSummary');
    videoSummary.innerHTML = node.Summary;
    videoContainer.appendChild(videoSummary);

    sideBarFrontContainer.style.display = 'none';
    element.style.width = '45%';

    setTimeout(() => {
        element.appendChild(videoContainer);

        let player = new YT.Player('ytvideo', {
            height: '180',
            width: '320',
            videoId: node.YouTube
        });

        mode = Mode.VIDEO;
    }, mode == Mode.DEFAULT ? 500 : 0);
}

export default SideBar;