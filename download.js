const fs = require('fs');
const request = require('request');
const progressBar = require('progress');

var processData = process.argv;
var url = processData[2];
var ex = url.split('.');
ex = ex.pop();
var totalBytes;
var bar;
var downloadIMG = request.get(url);
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
        downloadIMG.pipe(fs.createWriteStream('Image.'+ex))
            .on('finish',function(){
                console.timeEnd('download');
            })
            .on('error', function (err) {
                console.log("Error: " + err);
            });
    }
});


