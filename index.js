const http = require('http');
const fs = require('fs');
const tm = require('text-miner');
const d3 = require('d3');

const hostname = '127.0.0.1';
const port = 3000;

global.fetch = require("node-fetch");

let all_data;
let csv_data;
let dataByKeyword;

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == "/data") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(JSON.stringify(all_data));
        res.end();
    }
});

server.listen(port, hostname, () => {

    fs.readFile('data.csv', 'utf8', function(err, data) {
        csv_data = d3.csvParse(data);

        let keymap = new Array();

        for (var i = 0; i < csv_data.length; i++) {
            var my_corpus = new tm.Corpus([]);

            // my_corpus.addDoc(csv_data[i].Summary);
            // my_corpus.addDoc(csv_data[i].Title);
            my_corpus.addDoc(csv_data[i].Keywords);
            my_corpus.trim().toLower().removeWords(tm.STOPWORDS.EN).removeInterpunctuation().removeDigits().removeNewlines().clean();

            var terms = new tm.DocumentTermMatrix(my_corpus);

            for (let j = 0; j < terms.vocabulary.length; j++) {
                keymap.push({ video: csv_data[i], keyword: terms.vocabulary[j] });
            }

        };

        dataByKeyword = d3.nest()
            // .key(d => d.data.MainLevel)
            .key(d => d.keyword)
            // .key(d => d.data.Date.split("-")[2])
            .entries(keymap);

        dataByKeyword = dataByKeyword.filter(d => d.values.length > 2);

        for (var i = 0; i < dataByKeyword.length; i++) {
            console.log(dataByKeyword[i].key + " " + dataByKeyword[i].values.length);
            // str = "";
            // for (var j = 0; j < dataByKeyword[i].values.length; j++) {
            //     str = str + data[dataByKeyword[i].values[j].id].Title + ", ";
            // }
            // console.log(str);
            // console.log()
        }

        all_data = { csv_data: csv_data, dataByKeyword: dataByKeyword };

    });

    console.log(`Server running at http://${hostname}:${port}/`);
});