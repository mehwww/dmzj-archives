var path = require('path');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;

var cheerio = require('cheerio');
var request = require('request');

var host = 'manhua.dmzj.com';
var comics = require('../comics.json')
var siteUrl = url.format({
  protocol: 'http',
  host: host
});

Object.keys(comics).forEach(function (name) {
  var file = path.join(__dirname, '..', name + '.md');
  var comicUrl = url.resolve(siteUrl, comics[name])

  request(comicUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(body);
      var $lis = $('.cartoon_online_border').find('li a')
      if ($lis.length == 0) return console.log(comicUrl, ' have no pages');

      var writeStream = fs.createWriteStream(file);
      writeStream.write('# ' + name + ' #' + '\n')
      $lis.each(function (i, elem) {
        var pageUrl = url.resolve(siteUrl, $(this).attr('href'));
        writeStream.write('* ' + $(this).text() + '  [' + pageUrl + ']' + '(' + pageUrl + ')' + '\n')
        if (i == $lis.length - 1) {
          console.log(comicUrl, ' update ' + $lis.length + ' pages');
          writeStream.end();
        }
      })
    } else {
      console.log(comicUrl, '  404');
    }
  });

});
