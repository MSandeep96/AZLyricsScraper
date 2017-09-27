var cheerio = require('cheerio');
var request = require('request');

/**
 * Persistent properties
 * name
 * link
 * lyrics
 */
class Song {


	constructor(name, link) {
		this.name = name;
		this.link = link;
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

			var lyricsDiv = $('.ringtone')[0].next;
			while (!check(lyricsDiv)) {
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