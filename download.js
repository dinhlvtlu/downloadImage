const fs = require('fs');
const request = require('request');
const progressBar = require('progress');


var totalBytes;
var bar;

var downloadIMG = request.get('https://unsplash.imgix.net/photo-1425235024244-b0e56d3cf907?fit=crop&fm=jpg&h=700&q=75&w=1050');
console.time('download');
downloadIMG.on('error',function(err){
    console.log("Download Error " , err);
});
downloadIMG.on('response',function(response){
    if(response.statusCode != 200)
    {
        console.log("Error " + response.statusCode);
        return;
    }
    else {
        totalBytes = parseInt(response.headers['content-length'], 10);
        //console.log("Total Bytes: " + totalBytes);
        //downloadedBytes = 0;
        bar = new progressBar('downloading [:bar] :percent :etas',{
           complete: '*',
            incomplete: ' ',
            width: 50,
            total : totalBytes
        });
        downloadIMG.on('data', function (chunk) {
            bar.tick(chunk.length);
        });
        downloadIMG.pipe(fs.createWriteStream('tho.png'))
            .on('finish',function(){
                console.timeEnd('download');
            })
            .on('error', function (err) {
                console.log("Error: " + err);
            });
    }
});


