
var cheerio = require('cheerio'),
    request = require('request'),
    moment = require('moment');


exports.getTimetable = function(user, callback) {

    getPage(user, 'http://crypt.ncl.ac.uk/exam-timetable/index.php', function(error, $)
    {
        if(error)
            return callback(error);

        var exams = [];

        $('table tr').each(function() {

            if($(this).children('th').length > 0)
                return;

            var tds = $(this).children('td');

            exams.push({
                module: $(tds[0]).text().trim(),
                title: $(tds[1]).text().trim(),
                date: new Date(moment($(tds[2]).text().trim() + ' ' + $(tds[3]).text().trim(), 'D MMM YYYY h:mm A')),
                duration: $(tds[4]).text().trim()
            });
        }); 

        console.log(exams);
    });
}

function getPage(user, url, callback)
{
    if(user.dev) {
        var fs = require('fs');
        var filename = url.split('?')[0].substring(23).replace(/\//g, '-');
        var file = fs.readFileSync('testHTML/' + filename, 'utf8');
        var $ = cheerio.load(file);
        callback(null, $);
    }
    else {
        if(!user.cookie)
            callback({error: 401}, null);
        else {
            var headers = {
                'Cookie': user.cookie
            };
            request.get({
              url: url,
              headers: headers
            }, function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    var $ = cheerio.load(body);

                    callback(null, $);
                }
                else
                {
                    callback(error || { error: 401 }, null);
                }
            });
        }
    }
}



