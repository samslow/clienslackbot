//슬랙 봇 초기화하기
const { RTMClient } = require('@slack/client');
const token = 'xoxb-523635159010-535750723474-bwFv2yc0PzA3BZMNf1v8tKcD';
const rtm = new RTMClient(token);
rtm.start();

var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');	
var schedule = require('node-schedule');

console.log("스케줄러 시작 ")
var j = schedule.scheduleJob('*/1 * * * *', function(){
	var url = 'https://www.clien.net/service/board/jirum';
	request(url, function(error, response, html){
	    if (error) {throw error};

	    var $ = cheerio.load(html);
	    
	    var contents = $('.contents_jirum .list_item')
		var result = []
	    contents.each(function(index, ele){
	    	var view = $(this).find('.list_hit span').text()
	    	var title = $(this).find('.list_title span')[0].attribs.title
	    	var link = "https://www.clien.net" + $(this).find('.list_title a')[0].attribs.href
	    	if (view.includes('k')){
	    		view = parseFloat(view) * 1000
	    	}

	    	try {var comment = $(this).find('.rSymph05')[0].children[0].data}
			catch(error) {var comment = 0}
	        
		    if (view >= 4500 && comment >=15){
		    	result.push({title: title, view: Number(view), comment: Number(comment), link: link})
		    } 
	    });

		var readTitle = fs.readFileSync('alarm_title.txt','utf8');
		console.log(readTitle)

	    if (readTitle != result[0].title){
	    	console.log("새로운 인기글 등장!")
	    	var msg = result[0].title + "  \`" +result[0].view + "/" + result[0].comment +"\`\n" + result[0].link
	    	rtm.sendMessage("새로운 인기글이 떴어! 확인해봐", 'DFSPXHLNB')
			rtm.sendMessage(msg, 'DFSPXHLNB')
			fs.writeFileSync('alarm_title.txt', result[0].title);
	    }
	});
});	

