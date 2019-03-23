var express = require('express')
var bodyParser =require('body-parser') ;
var history = require('connect-history-api-fallback');


var app = module.exports = express() ;

app.use(express.static(__dirname + '/dist')) ;
app.use(bodyParser.urlencoded({
    extended : false
}))

// app.use(history({
//     index: './dist/index.html',
//     rewrites: [
//         {
//             from: /^\/.*$/,
//             to: function(context) {
//                 return '/';
//             }
//         }
//     ]
// }));

app.get('/*',function(req,res){
    res.sendfile(__dirname + '/dist' +'/index.html' );
})

if (!module.parent) {
    app.listen(8888);
    console.log('Express started on port 8888');
}
