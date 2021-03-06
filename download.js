const fs = require('fs');
const request = require('request');
const progressBar = require('progress');

var processData = process.argv;
var url = processData[2];

var arrEx = ['png','jpeg','jpg','gif','tiff'];
var totalBytes;
var bar;

downloadImage(url);

function Contain(ex){
    for(var i = 0 ; i < arrEx.length ; i++)
    {
        if(ex == arrEx[i])
        {
            return true;
        }
    }
    return false;
};


function downloadImage(url){
    if(!url)
    {
            return console.log("URL null...!");

    }
    else {
            var ex = url.split('.');
            ex = ex.pop();
            var downloadIMG = request.get(url);
            console.time('download');
            downloadIMG.on('error', function (err) {
                return console.log("Download Error ", err);
            });
            downloadIMG.on('response', function (response) {
                if (response.statusCode != 200) {
                    console.log("Error " + response.statusCode);
                    return;
                }
                else {
                    if (Contain(ex) === true) {
                        totalBytes = parseInt(response.headers['content-length'], 10);
                        console.log("Status Code:  " + response.statusCode);
                        bar = new progressBar('downloading [:bar] :percent :etas', {
                            complete: '*',
                            incomplete: ' ',
                            width: 50,
                            total: totalBytes
                        });
                        downloadIMG.on('data', function (chunk) {
                            bar.tick(chunk.length);
                        });
                        downloadIMG.pipe(fs.createWriteStream('Image.' + ex))
                            .on('finish', function () {
                                return console.timeEnd('download');
                            })
                            .on('error', function (err) {
                                return console.log("Error: " + err);
                            });
                    }
                    else
                    {
                        return console.log("ULR khong dan toi file anh");

                    }
                }
            });
        }
}


