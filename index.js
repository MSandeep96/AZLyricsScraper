var request = require('request');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');
const fs = require('fs');

//change artist in json file
const artist = require('./artist.json');
var Song = require('./song.js');

//create data folder if it doesn't exist
var dir = './data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// create csvWriters
var writer = csvWriter({ headers: ['name', 'link', 'lyrics'] });
writer.pipe(fs.createWriteStream('data/' + artist.name + '_data.csv'));

// since url is of the form '/e/eminem.html'
var url = 'https://www.azlyrics.com/';
url += artist.name[0] + '/';
url += artist.name + '.html';

var count = 0, suc_count = 0;

//filter response to include only songs lyrics
var scrapeResp = (err, resp, html) => {
  if (err) {
    console.log("Internet error or check artist name\n");
    return;
  }

  const $ = cheerio.load(html);
  // all songs with their links + some noise
  var collection = $('#listAlbum')[0].children;
  collection = collection.filter((obj) => {
    return obj.type === 'tag' && obj.name === 'a' && !obj.attribs.id;
  });

  console.log("Start scraping.........\n");
  generateLyricsSync(collection, 0);
};

// extracts each song's lyrics in blocking fashion with random breaks
var generateLyricsSync = (collection, i) => {
  var relurl = collection[i].attribs.href;
  var songName = collection[i].children[0].data;
  var song = new Song(songName, relurl);
  song.getLyrics((success) => {
    if (success) {
      suc_count++;
      writer.write(song);
    }
    if (i == collection.length) {
      writer.end();
      console.log("Scraped " + suc_count + " out of " + collection.length + ".");
    }else{
      //call next iteration after a slight delay
      setTimeout(()=>{
        generateLyricsSync(collection,i+1);
      },Math.round(3000 * Math.random()));
    }
  })
}

// extracts each song's lyrics
var generateLyrics = (collection) => {
  var count = 0, suc_count = 0;
  console.log("Starting scraping.......\n")
  collection.forEach((element) => {
    var relurl = element.attribs.href;
    var songName = element.children[0].data
    var song = new Song(songName, relurl);
    song.getLyrics((success) => {
      if (success) {
        //store 
        suc_count++;
        writer.write(song);
      }
      count++;
      if (count == collection.length) {
        //clear resources 
        writer.end();
        console.log("Scraped " + suc_count + " out of " + collection.length + ".")
      }
    });
  });
};


//start request
request(url, scrapeResp);