/* HTTP interface to JSLint.

   Takes roughly half the time to jslint something with this than to
   start up a new rhino instance on every invocation.

   Invoke from bash script like:

     curl --form source="<@{1}" ${JSLINT_URL}

   Adapted from https://github.com/keturn/lintnode
     by removing node module dependencies
*/

/*global require, process */
var http = require('http');
var fulljslint = require('./fulljslint');
var JSLINT = fulljslint.JSLINT;

/* copied from jslint's rhino.js */
var jslint_options = {
    bitwise: true,
    eqeqeq: true,
    immed: true,
    newcap: true,
    nomen: true,
    onevar: true,
    plusplus: true,
    regexp: true,
    rhino: true,
    undef: true,
    white: false
};

var jslintPort = 1337;

var outputErrors = function (errors) {
    var e, i, output = [];
    // debug("Handling " + errors.length + "errors" + '\n');
    function write(s) {
        output.push(s + '\n');
    }
    /* This formatting is copied from JSLint's rhino.js, to be compatible with
       the command-line invocation. */
    for (i = 0; i < errors.length; i += 1) {
        e = errors[i];
        if (e) {
            write('Lint at line ' + e.line + ' character ' +
                        e.character + ': ' + e.reason);
            write((e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            write('');
        }
    }
    return output.join('');
};


var doLint = function (sourcedata) {
    var passed, results;
    passed = JSLINT(sourcedata, jslint_options);
    if (passed) {
        results = "jslint: No problems found\n";
    } else {
        results = outputErrors(JSLINT.errors);
    }
    return results;
};

var jslint = function (req, res){
    var data = '';
    req.addListener("data", function (chunk) {
	data += chunk;
    });
    req.addListener("end", function() {
        data = data.substr(data.indexOf("\r\n\r\n") + 4);
	//Remove multi-part file upload data and headers
	var filtered = '';	
	data.split("\r\n").forEach(function(line){
	    if(!line.match(/^-----/)&&!line.match(/^Content-/)){
		filtered+=line+"\n";
	    }
	});
	var lintData = doLint(filtered);
	res.end(lintData);
    });
};

var parseCommandLine = function () {
    var port_index = process.ARGV.indexOf('--port');
    if (port_index > -1) {
        jslintPort = process.ARGV[port_index + 1];
    }
};

parseCommandLine();

var server = http.createServer(function (req, res) {
    jslint(req, res);
});

server.listen(jslintPort, "127.0.0.1");