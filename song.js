var cheerio = require('cheerio');
var request = require('request');

class Song{

	url = 'https://www.azlyrics.com';

	constructor(name,link){
		this.name = name;
		this.link = formatLink(link);
		this.getLyrics.bind(this); 
	}

	formatLink(link){
		return url + link.substring(2);
	}

	check(lyricsDiv){
		return lyricsDiv.type==='tag' && lyricsDiv.name==='div';
	}

	getLyrics(callback){
		request(link,(err,resp,html)=>{
			
			if(err){
				callback(false);
				return;
			}

			var lyricsDiv = $('.ringtone')[0].next;
			while(!check(lyricsDiv)){
				lyricsDiv = lyricsDiv.next;
			}

			var link = "";
			var isIgnore = false;
			
			lyricsDiv.children.forEach((element)=>{
				if(element.type==='tag' && element.name==='i'){
					isIgnore = !isIgnore;
					return;
				}
		
				if(isIgnore){
					return;
				}
		
				if(element.type==='text'){
					link += element.data;
				}
			});
			
			this.link = link;
			
			callback(true);
		});
	}
}

module.exports = Song;