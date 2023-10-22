const express = require('express');
const cors = require('cors');
const fs = require('fs');
const chrome = require("chrome-aws-lambda");
const path = require("path")

const app = express()
const PORT = 4000
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

//Hotelscan api routes
app.get('/scan', async (req, res) => {
  let query = req.query;
  const { hotelid, checkin, checkout } = query;

  try {
      const options = {
        args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
        executablePath: await chrome.executablePath,
        headless: "new",
      };
      const browser = await chrome.puppeteer.launch(options);
      const page = await browser.newPage();
  
      await page.goto(
        `https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`,
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );
      await page.goto(
        `https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=resort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`,
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );
      // let html = await page.evaluate(() => {
      //   return JSON.parse(document.querySelector("body").innerText);
      // });
      let body = await page.waitForSelector('body');
      let json = await body?.evaluate(el => el.textContent);
      await browser.close();   
      res.status(200).json(json);           
    } catch (error) {
      console.log(error); 
      res.statusCode = 500;
      res.json({
        body: "Sorry, Something went wrong!",
      });
    }
    
  });

app.get('/maldives', async (req, res) => {  
 
  const readFile = (path, opts = 'utf8') =>
    new Promise((resolve, reject) => {
      fs.readFile(path, opts, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
  })
  try {
    const jsonDirectory = path.join(process.cwd(), "json");
    const jsondata = await readFile(jsonDirectory + "/data.json");    
  
     res.status(200).json(jsondata);
  } catch (error) {
    console.log(error)
  }
  
  
})

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})
 
module.exports = app
