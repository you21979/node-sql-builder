var parseString = require("xml2js").parseString;
var squel = require("squel");
var fs = require("fs");

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

var swig  = require('swig');
var Generator = function(root){
    this.root = root
    this.sql = {
        uint64 : "BIGINT",
        uint32 : "INT",
        uint16 : "MIDIUM",
        string : "VARCHAR",
        double : "DOUBLE",
        time : "TIMESTAMP",
    }
}
Generator.prototype.generate = function(){
    return swig.renderFile('./tmpl/x.js.tmpl', this);
}

var main = function(){
    var x = fs.readFileSync("fixture/ex1.xml", "utf8");
    parseString(x, function (err, result) {
        var g = new Generator(new Root(result.root));
        console.log(g.generate());
    });
}

main();
