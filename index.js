var request = require('request');
var cheerio = require('cheerio');
var Song = require('song.js');
// edit details in the json file
var artist = require('./artist.json');

var url = 'https://www.azlyrics.com/';
url += artist.name[0] + '/';
url += artist.name + '.html';
// since url is of the form '/e/eminem.html'

var scrapeResp = (err, resp, html) => {
  if (err) {
    console.log("Internet error");
    return;
  }

  const $ = cheerio.load(html);
  // all songs with their links + some noise
  const collection = $('#listAlbum')[0].children;
  collection = collection.filter((obj) => {
    return obj.type === 'tag' && obj.name === 'a' && !obj.attribs.id;
  });

  generateLyrics(collection);
};

var generateLyrics = (collection) => {
  collection.foreach((element) => {
    var relurl = element.attribs.href;
    var songName = element.children[0].data
    var song = new Song(songName, relurl);
    song.getLyrics((success) => {
      if (success) {
        //store
      }
    });
  });
};

request(url, scrapeResp);