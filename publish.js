var ghpages = require('gh-pages');
var getRepoInfo = require('git-repo-info');

var info = getRepoInfo();
if (info.branch === null || info.branch === undefined) {
    const error = new Error('Branch name not detected.');
    throw (error);
}

var options = {};
options.message = info.commitMessage + " (" + info.branch + ' ' + info.abbreviatedSha+ ')'; 

function callback (err){
    if(err) { console.log('Error: ',err) }
    else { console.log('Done publishing: '+options.message) }
}

ghpages.publish('dist', options, callback);
