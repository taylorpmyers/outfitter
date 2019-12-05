// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;
// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));
// Routes
// =============================================================
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/index.html"));
});
app.get("/closet", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/closet.html"));
});
app.get("/add-clothing", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/add-clothing.html"));
});
app.get("/create-outfit", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/create-outfit.html"));
});
app.get("/generate-outfits", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/generate-outfits.html"));
});
app.listen(PORT, function () {
    console.log("App listening on PORT https://localhost:" + PORT);
});