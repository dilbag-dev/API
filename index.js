const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile =  fs.readFileSync("home.html", "utf-8");
var tuc = require("temp-units-conv");
const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp, 'C');
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
    return temprature;
};
const server =  http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Kurukshetra&appid=474a87cbe40c5f4dcd33da7a021f330d"
            )
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                //console.log(arrdata);
                const realTimeData = arrdata.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                //console.log(realTimeData);
             })
            .on("end", (err) => {
                if (err) return console.log("Connection Closed due to error", err);
                res.end();
            });

        
    }

});

server.listen(8000, "127.0.0.1");

 