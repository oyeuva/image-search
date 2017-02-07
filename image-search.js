
//var https = require('https');
var request = require('request');
{
    module.exports = function(app,db){
        app.get('/imagesearch/:tags', function(req,res){
            var tags = req.params.tags;
            var offset = req.query.offset || 10;
            var option = 
            {uri: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q='+ tags +'&count='+ offset+'&offset=3&mkt=en-us&safeSearch=Moderate',
            headers: {'User-Agent': 'request',
                    'Ocp-Apim-Subscription-Key': process.env.BING_SUB_KEY}
                };
            //api.datamarket.azure.com/Bing/SearchWeb/v1/Web?Query=%27xbox%27&$top=10&$format=JSON';
            var http = request( option, function(err, resp, body){
                if (err) throw err;
                var a = JSON.parse(body);
                saveHistory(tags);
                var result = [];
                a['value'].forEach(function(e,i){
                    var temp = {
                        url: e.contentUrl,
                        snippet: e.name,
                        thumbnail: e.thumbnailUrl,
                        context: e.hostPageDisplayUrl
                    };
                    result.push(temp);
                });
                res.send(result);
            });
        });
        app.get('/latest', function(req,res){
            var collection = db.collection('img-search');
            collection.find().toArray(function(err,docs){
                if(err) throw err;
                docs.forEach(function(e,i){
                    delete e['_id'];
                });
                
                res.end(JSON.stringify(docs));
                console.log('res history: '+ docs);
            });
        });
        function saveHistory(q){
            var collection = db.collection('img-search');
            var curr = new Date();
            var history = {
                query: q,
                when: curr
            };
            collection.insert(history, function(err,data){
                if(err) throw err;
                console.log('historysaved: '+ JSON.stringify(history));
            });
        }
    };
}