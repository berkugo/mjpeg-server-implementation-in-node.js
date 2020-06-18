const fs = require('fs');
const { createServer } = require('http');
const { EventEmitter } = require('events');
var currentIndex = 0
const bufferArrayHolder = []
const emitter = new EventEmitter();


const bufferReloder = async () => {

    const flagFile = fs.existsSync("./images/tr/.true")
    if (flagFile) {
        var bufferHolder = []
        for (var i = 1; i <= 100; i++) {
            const bf = fs.readFileSync(`./images/tr/1/${i}.jpg`)
            bufferHolder.push(bf)
        }
        bufferArrayHolder.pop()
        bufferArrayHolder.push(bufferHolder)
        fs.unlinkSync("./images/tr/.true");
        return true
    }
    else {
        if (bufferArrayHolder.length == 0) {
            var bufferHolder = []
            const bf = fs.readFileSync(`./images/tr/1/1.jpg`)
            bufferHolder.push(bf)
            bufferArrayHolder.push(bufferHolder)
            return false
        }
        else
            return false;

    }
}



const server = createServer((req, res) => {
    res.writeHead(200, {
        'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
        Pragma: 'no-cache',
        Connection: 'close',
        'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary'
    });

    const writeFrame = () => {
        const buffer = bufferArrayHolder[0][currentIndex]
        res.write(`--myboundary\nContent-Type: image/jpg\nContent-length: ${buffer.length}\n\n`);
        res.write(buffer);
    };
    emitter.addListener("frame", writeFrame)
});


setInterval(async () => {
    currentBuffer = await bufferReloder()
    if (currentBuffer) {
        if (currentIndex == bufferArrayHolder[0].length) currentIndex = 0
        emitter.emit("frame")
        currentIndex++
    }
    else {
        if (bufferArrayHolder.length != 0) {
            if (currentIndex == bufferArrayHolder[0].length) currentIndex = 0
            emitter.emit("frame")
            currentIndex++

        }
    }

}, 1000);



server.listen(3000);






