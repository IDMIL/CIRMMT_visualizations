require('!style-loader!css-loader!video.js/dist/video-js.css');
import videojs from 'video.js';
import 'videojs-youtube';
// import 'video-js.min.css'

let element;
let SideBar = {};

SideBar.createSideBar = function(backButtonClicked) {
    element = document.createElement('div');
    element.classList.add('sideBar');
    document.body.appendChild(element);

    let backButton = document.createElement('div');
    backButton.classList.add('button');
    backButton.innerHTML = 'Back';
    backButton.onclick = backButtonClicked;
    element.appendChild(backButton);
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

    let videoTitle = document.createElement('div');
    videoTitle.classList.add('videoTitle');
    videoTitle.innerHTML = node.id;
    videoContainer.appendChild(videoTitle);

    let video = document.createElement('video');
    video.classList.add('video-js');
    video.classList.add('vjs-default-skin');
    video.setAttribute('controls', '');
    video.setAttribute('autoplay', '');
    videoContainer.appendChild(video);

    let videoSummary = document.createElement('div');
    videoSummary.classList.add('videoSummary');
    videoSummary.innerHTML = node.Summary;
    videoContainer.appendChild(videoSummary);

    element.appendChild(videoContainer);

    let player = videojs(video, {
        techOrder: ["youtube"],
        sources: [{
            "type": "video/youtube",
            "src": node.YouTube,
            "youtube": { "ytControls": 2 }
        }]
    }, function() {});
}

export default SideBar;