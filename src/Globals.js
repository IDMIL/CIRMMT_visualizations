import rawData from './data.csv';
import rawTopicsData from './topics.csv'
let data = rawData.filter(d => d.Title);
let topicsData = rawTopicsData.filter(d => d.ResearchAxis);
let topicsDict = {};

data.forEach(d => {
    if (topicsDict[d.Topic]) {
        ++topicsDict[d.Topic]['count'];
    } else {
        topicsDict[d.Topic] = { 'count': 1 };
    }
});

export { data, topicsData, topicsDict };