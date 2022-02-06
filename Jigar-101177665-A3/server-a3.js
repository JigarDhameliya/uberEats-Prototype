//Global variables for requiring the necessary modules and some other global variables
//for handling the data.
const express = require("express");
const pug = require("pug");
const fs = require("fs");
const path = require("path");
const { connect } = require("http2");
let app = express();
app.use(express.json());
app.set("view engine", "pug");

// const resRouter = require("./restaurant-router");
// const newResRouter = require("./addRestaurant-router");

let restaurantsData = [];
let nextId = 0;
// app.use(function(req,res,next){
// 	console.log(req.method);
// 	console.log(req.url);
// 	console.log(req.path);
// 	next();
// });

//Serve static resources from public, if they exist
app.use(express.static("public"));

//Server Requirment-1
app.get("/",function(req,res,next){
	res.render("pages/home",{motto: "We are making what you are craving!"});
});

//Server Requirement-2
app.get("/restaurants",sendResList);
//sends the data to resList.pug that renders the data for us
//or send a json file 
function sendResList(req,res,next){

	//Object of the form {"restaurants":array of restaurantsData};
	let restaurant = {};
	restaurant["restaurants"] = restaurantsData;
	res.format({
		"text/html": () => {res.render("pages/resList",{restaurants:restaurantsData})},
		"application/json": () => {res.status(200).json(restaurant)}
	});
}

//Server Requirement-3
app.get("/addRestaurant",newResForm);
//Serve a HTML file with a form to add new restaurant.
function newResForm(req,res,next){
	res.render("pages/newResForm");
}

//Server Requirement-4
app.post("/addRestaurant",addNewRes);
//Add the received object in the existing restaurants and redirect to the new restaurants page.
function addNewRes(req,res,next){
	//console.log(req.body);
	req.body.id = nextId;
	req.body.menu = {};
	restaurantsData[nextId++] = req.body;
	//console.log(req.body);
	//console.log(restaurantsData);
	res.status(201).json(req.body);
}

//Server Requirement-5
app.get("/restaurants/:restID",serveOneRest);
function serveOneRest(req,res,next){
	if(req.params.restID > nextId){
		res.status(404).send();
		return;
	}
	let categories = [];
	for(category in restaurantsData[req.params.restID]["menu"]){
		categories.push(category);
	}
	// console.log("Category list is: " + categories);
	res.format({
		"text/html": () => {res.render("pages/singleRest",{restaurant:restaurantsData[req.params.restID], categories:categories})},
		"application/json": () => {res.status(200).json(restaurantsData[req.params.restID])}
	});
}

//Server Requirement-6
app.put("/restaurants/:restID",updateData);
function updateData(req,res,next){
	//console.log(req.body);
	if(req.params.restID > nextId){
		res.status(404).send();
		return;
	}
	restaurantsData[req.params.restID] = req.body;
	res.status(200).send("Updated");
}

//Read the dirtectory and then add all the existing restuarants in restaurantsData global variable
fs.readdir("./A3-Data/restaurants",(err,files) =>{
    if(err) return console.log(err);
    //name of the files
    //console.log(files);
    
    for(let i=0; i<files.length; i++){
        //Data of each restaurant
        let restaurant = require("./A3-Data/restaurants/" + files[i]);
        restaurantsData[restaurant.id] = restaurant;
		nextId++;
    }
	
	//Start listening to the server
    app.listen(3000);
    console.log('Server running at http://127.0.0.1:3000/');
});