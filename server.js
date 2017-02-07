var express = require('express');
var path = require('path');
var app = express();
var api = require('./image-search.js');
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;

mongo.connect(url, function(err,db){
    if(err) throw err;
    
    db.createCollection('img-search',{
        capped: true,
        size: 2000000,
        max: 10
    });
    
    api(app,db);
    
    
    
    
    app.listen(process.env.PORT|| 8080, function(){
        console.log('port is 8080!');
    });
});
