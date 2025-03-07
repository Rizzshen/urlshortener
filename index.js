require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const urlDatabase = {};
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/shorturl/:short_url',(req,res)=>
  {
    const code = req.params.short_url;
    console.log(code);
    if (urlDatabase[code]){
      res.redirect(urlDatabase[code]);
    }
    else{
      res.json({"error":"invalid url"});
    }
  });
app.use('/api/shorturl',(req,res,next)=>
{
 try{
  const url = new URL(req.body.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:'){
    return res.json({"error": "invalid url"});
  }
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
        return res.json({ error: 'invalid url' });  // If DNS lookup fails
    }

    // If everything is valid, proceed to the next middleware
    next();
});
 }
 catch(error)
 {
  return res.json({"error":"invalid url"});
 }
});
app.post('/api/shorturl', (req,res)=>
{
  const number = 2;
  res.json({"original_url": req.body.url, "short_url": number});
  urlDatabase[number] = req.body.url;
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
