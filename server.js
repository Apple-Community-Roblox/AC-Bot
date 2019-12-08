const express = require('express');
const http = require('http')
const keepalive = require('express-glitch-keepalive');
const ejs = require('ejs')
const weather = require('weather-js')
const LRU = require('lru-cache')

const app = express();

app.use(keepalive);
app.use(express.static('public'))
app.set('view engine', 'ejs')
ejs.cache = new LRU(100); // LRU cache with 100-item limit

app.get("/", function(request, response){
  response.render(__dirname + "/views/" + "index.ejs", {list: "lists"});
});

app.get("/servers", function(request, response){
  response.render(__dirname + "/views/" + "servers.ejs", {list: "lists"});
});

app.get("/404", function(request, response){
  response.render(__dirname + "/views/" + "404.ejs", {list: "lists"});
});

module.exports = bot => {
  // get all guilds the bot is logged in
    app.get('/api/guild/all', (req, res) => {
        let guilds = bot.guilds.array();
        res.status(200).send(guilds);
    })
  };

// Example of http for ping
app.get('/ping', (req, res) => {
	console.log(new Date() + ' Ping!');
	res.status(200).send('Ping!');
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// Auto-ping interval
setInterval(() => {
	http.get(`http://ac-bot.glitch.me/ping`);
}, 280000);