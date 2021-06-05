const express = require("express");
const https = require("https"); // requesting data from the link provided.
const ejs = require("ejs"); // Templating
const indianNumberFormatter = require("indian-number-format"); // adding commas according to the Indian Number System
const app = express();

let arr = [];
app.set("view engine", "ejs"); //establishing view engine for ejs
app.use(express.static(__dirname + "/public")); //for static files (CSS,Images)

//-----------------------------GET REQUEST OF THE PAGE--------------------------------------
app.get("/", function (req, res) {
  const url = "https://api.wazirx.com/api/v2/tickers"; //Provided URL
  https.get(url, function (responseFromUrl) {
    let data;
    responseFromUrl.on("data", function (dataChunk) { //data recieved in chunks
      if (!data) {
        data = dataChunk;    
      } else {
        data += dataChunk; //collecting chunks of data
      }
    });
    responseFromUrl.on("end", function () {
      const urlData = JSON.parse(data); //parsing the JSON data recieved
      let count = 0;

      if (arr.length == 0) {
        for (const prop in urlData) {
          if (count == 10) break;  //count for 10 entries
          const getdata = urlData[prop];
          const obj = {
            name: getdata.name,
            last: indianNumberFormatter.format(getdata.last), //converting plain integer to Indian Number System
            buy: indianNumberFormatter.format(getdata.buy), //converting plain integer to Indian Number System
            sell: indianNumberFormatter.format(getdata.sell), //converting plain integer to Indian Number System
            volume: getdata.volume,
            base_unit: getdata.base_unit,
          };
          arr.push(obj); //populating the array with the top 10 entries
          count++; 
        }
      }
    });
  });
  //-------------------Rendering the Homepge ----------------------------------------
  res.render("index", { dataArray: arr }); //sending the array with 10 entries to the HTML/ejs file
});

app.listen(3000, function () { //listen at port 3000
  console.log("SERVER RUNNING AT 3000");
});
