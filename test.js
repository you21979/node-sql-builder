var parseString = require("xml2js").parseString;
var fs = require("fs");
var x = fs.readFileSync("fixture/ex1.xml", "utf8");

var Column = function(v){
    this.name = v.$.name
    this.type = v.$.type
    this.attr = v.$.attr || ""
}

var Table = function(v){
    this.name = v.$.name
    this.columns = v.column.map(function(v){ return new Column(v) })
}

var Include = function(v){
    this.name = v.$.name;
    this.type = v.$.type;
}

var Root = function(v){
    this.consts = [];
    this.tables = [];
    this.includes = [];

    var initialize = function(self,v){
        v.table.map(function(v){ return new Table(v) }).forEach(function(v){
            self.tables.push(v);
        })
        v.include.map(function(v){ return new Include(v) }).forEach(function(v){
            self.includes.push(v);
        })
    }
    initialize(this,v);
}

var Generator = function(data){
    this.define = data
}
Generator.prototype.generate = function(){
    
}

var main = function(){
    parseString(x, function (err, result) {
        var g = new Generator(new Root(result.root));
        console.log(g);
    });
}

main();
