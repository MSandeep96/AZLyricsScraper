var Song = require('../song.js');
var assert = require('assert');

var url = "../lyrics/eminem/youcantbackdown.html";
var song = new Song("Some thing",url);

describe('Song object',()=>{
	it('should format the url properly',()=>{
		assert.strictEqual("https://www.azlyrics.com/lyrics/eminem/youcantbackdown.html",song.link);
	});

	it('should return the lyrics',(done)=>{
		song.getLyrics((success)=>{
			if(success)
				done();
			else
				throw Error("Failed to fetch");
		});
	});
});