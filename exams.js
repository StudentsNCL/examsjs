
var cheerio = require('cheerio'),
    request = require('request'),
    moment = require('moment'),
    ncl = require('ncl-connect');

exports.getTimetable = function(user, callback) {

    ncl.getPage(user, 'http://crypt.ncl.ac.uk/exam-timetable/index.php', function(error, $)
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

        callback(null, exams);
    });
}


