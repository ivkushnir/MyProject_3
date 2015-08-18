var http = require("http"),
    fs = require("fs");

var methods = Object.create(null);

http.createServer(function (request, response) {
    function respond(code, body, type) {
        if (!type) type = "text/plain";
        response.writeHead(code, {"Content-Type": type, 'Access-Control-Allow-Origin': '*'});
        if (body && body.pipe)
            body.pipe(response);
        else
            response.end(body);
    }

    if (request.method in methods)
        methods[request.method](urlToPath(request.url),
            respond, request);
    else
        respond(405, "Method " + request.method +
            " not allowed.");

}).listen(8000);

//path decoding
function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    var str = decodeURIComponent(path).toString();
    return str;
}
//two keeping tracks of current address for 2 windows
var track1;
var track2;

methods.GET = function (path, respond) {

    //if we got GetDirContent1 from 1 window
    if (path.substring(0, "/GetDirContent1".length) == "/GetDirContent1") {

        var item_name = path.substring("/GetDirContent1/".length);
        //if we got name of root list (disk C in our server)
        if (item_name == 'C') track1 = 'C://';

        //if we need content of parent directory
        else if (item_name == '{parent-dir}') {

            if (track1 == 'C://') {
                track1 = 'C://';
            }
            else {
                //rise to upper directory
                var track0 = track1.substring(0, track1.length - 1);
                var i = track0.lastIndexOf('/');
                track1 = track0.substring(0, i + 1);
            }

        }
        //if we need content of any directory
        else {
            track1 = track1 + item_name + '/';
        }

        //answer creating in json format
        fs.stat(track1, function (error, stats) {
            console.log("get " + track1);
            if (error && error.code == "ENOENT")
                respond(404, "File not found");
            else if (error)
                respond(500, error.toString());
            else if (stats.isDirectory())
                fs.readdir(track1, function (error, files) {
                    if (error)
                        respond(500, error.toString());
                    else {
                        var result = [];
                        files.forEach(function (file) {
                            if (fs.existsSync(track1 + file)) {
                                var obj = {};
                                obj['name'] = file;
                                var sts = fs.statSync(track1 + file).isFile();
                                obj['isFile'] = sts;
                                result.push(obj);
                            }

                        });
                        respond(200, JSON.stringify(result));
                    }
                });

            else
                respond(200, fs.createReadStream(track1),
                    require("mime").lookup(track1));
        });
    }
    ;
    //for 2 window
    if (path.substring(0, "/GetDirContent2".length) == "/GetDirContent2") {

        var item_name = path.substring("/GetDirContent2/".length);
        if (item_name == 'C') track2 = 'C://';

        else if (item_name == '{parent-dir}') {

            if (track2 == 'C://') {
                track2 = 'C://';
            }
            else {
                var track0 = track2.substring(0, track2.length - 1);
                var i = track0.lastIndexOf('/');
                track2 = track0.substring(0, i + 1);
            }

        }
        else {
            track2 = track2 + item_name + '/';
        }

        fs.stat(track2, function (error, stats) {
            console.log("get " + track2);
            if (error && error.code == "ENOENT")
                respond(404, "File not found");
            else if (error)
                respond(500, error.toString());
            else if (stats.isDirectory())
                fs.readdir(track2, function (error, files) {
                    if (error)
                        respond(500, error.toString());
                    else {
                        var result = [];
                        files.forEach(function (file) {
                            if (fs.existsSync(track2 + file)) {
                                var obj = {};
                                obj['name'] = file;
                                var sts = fs.statSync(track2 + file).isFile();
                                obj['isFile'] = sts;
                                result.push(obj);
                            }

                        });
                        respond(200, JSON.stringify(result));
                    }
                });

            else
                respond(200, fs.createReadStream(track2),
                    require("mime").lookup(track2));
        });
    }
};




