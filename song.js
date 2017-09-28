var cheerio = require('cheerio');
var request = require('request');

/**
 * Persistent properties
 * @param name {String} song's name.
 * @param link {String} song's relative link
 * @property lyrics {String} song's lyrics
 */
class Song {


	constructor(name, link) {
		this.name = name;
		this.link = this.formatLink(link);
		this.getLyrics.bind(this);
	}

	formatLink(link) {
		return 'https://www.azlyrics.com' + link.substring(2);
	}

	check(lyricsDiv) {
		return lyricsDiv.type === 'tag' && lyricsDiv.name === 'div';
	}

	getLyrics(callback) {
		request(this.link, (err, resp, html) => {

			if (err) {
				console.log("Failed to fetch " + this.name + " from " + this.link + "\n");
				callback(false);
				return;
			}
			const $ = cheerio.load(html);
			
			if(!$('.ringtone')[0]){
				console.log("Failed to parse " + this.name + " from " + this.link + "\n");
				callback(false);
				return;
			}
			var lyricsDiv = $('.ringtone')[0].next;
			while (!this.check(lyricsDiv)) {
				lyricsDiv = lyricsDiv.next;
			}

			var lyrics = "";
			var isIgnore = false;

			lyricsDiv.children.forEach((element) => {
				if (element.type === 'tag' && element.name === 'i') {
					isIgnore = !isIgnore;
					return;
				}

				if (isIgnore) {
					return;
				}

				if (element.type === 'text') {
					lyrics += element.data;
				}
			});

			this.lyrics = lyrics;
			console.log("Successfully fetched " + this.name + " from " + this.link + "\n");
			callback(true);
		});
	}
}

module.exports = Song;