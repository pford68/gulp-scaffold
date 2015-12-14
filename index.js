/**
 *
 */

var process = require('process'),
    fs = require('fs'),
    path = require('path'),
    readline = require('readline'),
    ncp = require('ncp').ncp,
    program = require('commander'),
    fileName = "/.scaffold",
    project = {};


function wizard() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var _this = {
        cursor: 0,
        items: [],
        next: function () {
            ++this.cursor;
            rl.setPrompt(this.items[this.cursor].msg);
            rl.prompt();
        },
        add: function (msg, item) {
            this.items.push({ msg: msg, action: item.bind(this) });
            return this;
        },
        start: function() {
            this.cursor = 0;
            rl.setPrompt(this.items[this.cursor].msg);
            rl.prompt();
        },
        close: function(){
            rl.close();
        },
        save: function(){
            var cwd = process.cwd();
            console.log(cwd, __dirname);

            // Delete current contents, if any.
            rmDir(cwd);

            // Copy contents of this module's resources directory to the CWD.
            ncp(path.join(__dirname, "resources"), cwd, function(err){
                if (err){
                    console.log("Could not copy resources to " + cwd, err);
                    this.close();
                }
                fs.writeFile(cwd + "/" + fileName, JSON.stringify(project), function(err){
                    if (err) {
                        console.log("Could not write to .scaffold", err, project);
                        this.close();
                    }
                    program.command('exec npm install').action(function(cmd){
                        console.log("npm install:", cmd)
                        this.close();
                    }.bind(this));
                }.bind(this))
            }.bind(this));
        }
    };

    rl.on('close', function(){
        process.exit();
    });

    rl.on("line", function(answer) {
        // Executes the current action when a line of input is entered.
        this.items[this.cursor].action(answer);
    }.bind(_this));

    return _this;
}


function rmDir(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    console.log(files);
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath, files[i]);
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    }
    if (dirPath != process.cwd()){
        fs.rmdirSync(dirPath);
    }
};




program
    .version('1.0.0')
    .option('-p, --project', 'The project name')
    .parse(process.argv);




wizard().add("What is the name of the project (the context)?  ", function(answer) {
    if (answer.trim().length > 0) {
        project.name = answer;
        project.context = "/" + answer;
        this.next();
    } else {
        this.start();
    }
}).add("You can give the project a separate display name:[Press Enter to skip]  ", function(answer) {
    project.displayName = answer;
    console.log(project);
    this.next();
}).add("Looks good?  ", function(answer){
    if (answer.match(/yes|y|''/i)){
        this.save();
    } else {
        this.start();
    }
}).start();



