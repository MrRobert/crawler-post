// This is the main file of our chat app. It initializes a new 
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'node app.js' in your terminal

var express = require('express'),
    app = express();

var port = process.env.PORT || 4000;
app.listen(port);

var Crawler = require("crawler");

require('./config')(app);
require('./util');
require('./siteMap');

app.get('/', function (req, res) {
    res.set("Access-Control-Allow-Origin","http://localhost:4000");
    res.render('home');
});

app.get('/crawler', function (req, res) {
    var path = req.query.path;
    var pathPage = getPathOfPage(path);
    var homePage = getHomePage(path);
    var siteRule = Site.siteMap;

    console.log("HOme Page == " + homePage);
    console.log("Path Page == " + pathPage);

    var isReturn = false;

    var resultMap = new HashMap();
    var c = new Crawler({
        retryTimeout: 10000,
        maxSizeResult: 50,
        maxConnections: 20,
        skipDuplicates: true,
        // This will be called for each crawled page
        callback: function (error, result, $) {
            try{
                // checking result with key DOM & optimsize body
                if (result) {
                    var bodyObject = {};
                    bodyObject.bodySummary = getBodySummary($);
                    bodyObject.bodyContent = getBodyContent(result.body, siteRule);

                    if (resultMap.size() <= c.options.maxSizeResult) {
                        var title = getTitle(result);
                        resultMap.put(title, bodyObject);
                    }
                }
                if ($ != undefined) {
                    var atags = $('a');
                    if (atags != undefined && atags.length > 0) {
                        for (var i = 0; i < atags.length; i++) {
                            var toQueueUrl;
                            if (atags[i] != undefined && $(atags[i]) != undefined) {
                                toQueueUrl = $(atags[i]).attr('href');

                                // TODO : detect category & post Form key DOM
                                if (toQueueUrl != undefined && toQueueUrl.length > 0 &&
                                    toQueueUrl.indexOf(pathPage) >= 0 ) {

                                    //checking rule of page
                                    var rules = siteRule.get(homePage);
                                    var finalUrl;

                                    // checking categories or post
                                    if(!isThisPageIsAPost(result.body, rules)){
                                        finalUrl = constructFinalUrl(homePage, toQueueUrl, rules.queryRule);
                                        console.log(finalUrl);

                                        if (resultMap.size() < c.options.maxSizeResult) {
                                            c.queue(finalUrl);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }catch(err){
                console.log("ERRROR =====================" +err);
            }
        },
        onDrain: function () {
            console.log("=================RESPONSE AT END============");
            if(isReturn == false) {
                isReturn = true;
                res.status(200).json(resultMap);
            }
        }
    });
    c.queue(path);
});

function constructFinalUrl(homePage, queryURL, queryRules){
    // TODO: construct final URL with query Rules

    // remove search query page link
    if(queryURL.indexOf(".html") > 0){
        queryURL = queryURL.substring(0, queryURL.indexOf(".html") + 5);
    }
    var finalUrl = homePage + queryURL;
    if(finalUrl.indexOf("http://") != 0 || finalUrl.indexOf("https://") != 0){
        finalUrl = "http://" + finalUrl;
    }
    return finalUrl;
}


function getBodyContent(resultBody, siteRule){
    // TODO: get body content here
    return "";
}

function isThisPageIsAPost(resultBody, rules){
    // TODO: check is result is a Post or Categories
    return false;
}

function getHomePage(path) {
    // remove http if existed
    if (path.indexOf("//") > 0) {
        path = path.substring(path.indexOf("//") + 2);
    }

    var index = path.indexOf('/');
    if (index < 0) return "";
    return path.substring(0, index);
}

function getPathOfPage(path) {
    // remove http if existed
    if (path.indexOf("//") > 0) {
        path = path.substring(path.indexOf("//") + 2);
    }
    var index = path.indexOf('/');
    if (index < 0) return "";
    return path.substring(index);
}

function getTitle(result) {
    var body = result.body;
    var start = body.indexOf("<title>") + 7;
    var end = body.indexOf("</title>");
    return '<a href="' + result.request.href + '">' + body.substring(start, end) + '</a>';
}

function getBodySummary($) {
    var result = '';
    if ($ != undefined) {
        var metas = $('meta');
        if (metas != undefined && metas != null && metas.length > 0) {
            for (var i = 0; i < metas.length; i++) {
                if (metas[i] != undefined && $(metas[i]) != undefined) {
                    var name = $(metas[i]).attr('name');
                    if (name != undefined && name.length > 0 && (name == 'description' || name == 'keywords')) {
                        var tmp = $(metas[i]).attr('content');
                        if (tmp != undefined && tmp.length > 0) {
                            result += '<span>' + tmp + '</span><br>';
                        }
                    }
                }
            }
        }
    }
    return result;
}

console.log('Your application is running on http://localhost:' + port);
