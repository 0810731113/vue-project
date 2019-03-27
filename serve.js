var express = require('express')
var bodyParser =require('body-parser') ;
var history = require('connect-history-api-fallback');
var path = require('path')
var fs = require('fs')
var etag = require('etag')


var app = module.exports = express() ;

//app.use(express.static(__dirname + '/dist')) ;
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

app.get(/\/*\.js$/,function(req,res) {
    console.log(req.path)
    var reqpath = req.path
    var realpath = reqpath.split('/').pop()
    console.log(realpath)
    var extname = path.extname(reqpath)
    console.log(extname)
    var expires = new Date();
    expires.setTime(expires.getTime() + 5)
    res.setHeader('Expires', expires.toUTCString())
    res.setHeader('Cache-Control', "max-age=" + 1);

    var realp = path.resolve(__dirname, 'dist', realpath).toString()
    console.log(realp)
    var fileinfo = fs.statSync(realp)
    console.log(fileinfo)

   /* //LastModified 在google里调试不显示if-modified-since
    var lastModifid = fileinfo.mtime.toUTCString()
    res.setHeader('Last-Modified',lastModifid)
    console.log("**********************")
    console.log(lastModifid)
    console.log(req.get('if-modified-since'))
    //console.log(req.get['if-modified-since'])
    console.log("**********************")
    if(req.get('if-modified-since') && lastModifid == req.get('if-modified-since')){

        res.writeHead(304,'Not Modified')
        res.end();
    }else{
        fs.exists(realp,function(exists){
            if(!exists){
                res.writeHead(404,{
                    'Content-Type':'text/plain'
                })
                res.write('这个url ' + req.path + ' 不存在')
                res.end()
            }else{
                fs.readFile(realp,'binary',function(err,file){
                    if(err){
                        res.writeHead(500,{
                            'Content-Type':'text/plain'
                        })
                        res.end()
                    }else{
                        res.writeHead(200,{
                            'Content-Type':'text/plain'
                        })
                        res.write(file,'binary')
                        res.end()
                    }
                })
            }
        })
    }*/

   try {
       //Etag
       if(fs.existsSync(realp)){
           var readf = fs.readFileSync(realp)
           console.log("***************************")
           console.log(readf)
           var fetag = etag(readf)
           res.setHeader('ETag',fetag)

           var reqetag = req.get('if-none-match')
           console.log("***************************")
           console.log(reqetag)
           console.log(fetag)
           console.log("***************************")
           if(!!reqetag && reqetag === fetag){
               res.writeHead(304,'Not Modified')
               res.end();
           }else{
               console.log(2)
               res.writeHead(200,{'Content-Type':'text/plain'})
               res.write(readf,'binary')
               res.end()
           }
       }else{
           console.log(3)
           res.writeHead(404,{'Content-Type':'text/plain'})
           res.write('这个url ' + req.path + ' 不存在')
           res.end()

       }
   }catch(err){
        console.log(4)
       // res.writeHead(500,{'Content-Type':'text/plain'})
       // res.end()
       //res.send(null)
   }
   //Etag
    //res.setHeader('Last-Modified',lastModifid)
    // var readf = fs.readFileSync(realp)
    // console.log("***************************")
    // console.log(readf)
    //var fetag = etag()

    // console.log("**********************")
    // console.log(lastModifid)
    // console.log(req.get('if-modified-since'))
    // //console.log(req.get['if-modified-since'])
    // console.log("**********************")
    // if(req.get('if-modified-since') && lastModifid == req.get('if-modified-since')){
    //
    //     res.writeHead(304,'Not Modified')
    //     res.end();
    // }else{
    //     fs.exists(realp,function(exists){
    //         if(!exists){
    //             res.writeHead(404,{
    //                 'Content-Type':'text/plain'
    //             })
    //             res.write('这个url ' + req.path + ' 不存在')
    //             res.end()
    //         }else{
    //             fs.readFile(realp,'binary',function(err,file){
    //                 if(err){
    //                     res.writeHead(500,{
    //                         'Content-Type':'text/plain'
    //                     })
    //                     res.end()
    //                 }else{
    //                     res.writeHead(200,{
    //                         'Content-Type':'text/plain'
    //                     })
    //                     res.write(file,'binary')
    //                     res.end()
    //                 }
    //             })
    //         }
    //     })
    // }




    //res.send("var b = 0;")
})

app.get('/*.html',function(req,res){
    var reqpath = req.path
    var realpath = reqpath.split('/').pop()
    res.sendfile(__dirname + '/dist/' +realpath );
})

if (!module.parent) {
    app.listen(8888);
    console.log('Express started on port 8888');
}
