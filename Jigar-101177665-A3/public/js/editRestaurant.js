//get all the current restaurant data

//const { compile } = require("pug");

let currentRestaurant = {};

//get the current restaurant and store it in currentRestaurant.
function getCurrentData(){
	let restID = document.getElementById("id").value;
	//console.log("The rest ID is: " + restID);
	req = new XMLHttpRequest;
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			currentRestaurant = JSON.parse(this.responseText);
			//console.log(currentRestaurant);
		}
	}
	req.open("GET", `http://localhost:3000/restaurants/${restID}`,true);
	req.setRequestHeader("Accept","application/json");
	req.send();
	return;
}
getCurrentData();

//Add a new category on the window and the dropdown menu
function newCategory(){
	let category = document.getElementById("newCategory");
	if(!existsCategory(category.value)){
		//Add the category to the dropDown
		selectCategory = document.getElementById('selectCategory');
		selectCategory.options[selectCategory.options.length] = new Option(category.value,category.value);
		currentRestaurant['menu'][category.value] = {};
		currentRestaurant['menu'][category.value][totalItems()] = {};

		let addHere = document.getElementById("addNewCategory")
		let elem = document.createElement('div');
		elem.id = `newAddedCategory${selectCategory.options.length}`;
		elem.innerHTML = `<h4>&emsp;&emsp; ${category.value}:</h4>`;
		addHere.appendChild(elem);

		let elem2 = document.createElement('div');
		elem2.id = `newItem${categoryID(category.value)}`;
		let addItemHere = document.getElementById(`newAddedCategory${selectCategory.options.length}`);
		addItemHere.appendChild(elem2);
		// console.log(currentRestaurant['menu']);
	}
	else{
		//give an alert that the category that you are trying to add already exists!
	}
}

//Checks if the given category exists
//if it exists return true
//and if doesn't exist return false
function existsCategory(category){
	let tempFlag = true;
	if(category === "" || !isNaN(category)){
		tempFlag = false;
		alert("The category you are trying to add is either not specified or is not valid");
	}
	if(tempFlag){
		for(ele in currentRestaurant['menu']){
			if(category.toLowerCase() === ele.toLowerCase()){
				//alert(`The category "${category}" already exists`);
				return true;
			}
		}
		currentRestaurant['menu'][category] = {};
		return false;
	}
	return true;
}

function newMenuItem(){
	let flag = true;
	let flag2 = true;
	let tempFlag = true;
	let newItem = {};
	let newRestaurant = {};
	let idCounter = 0;
	let toAddAt = -1;
	
	newItem["category"] = document.getElementById('selectCategory').value;
	newItem["name"] = document.getElementById('new_name').value;
	newItem["description"] = document.getElementById('new_description').value;
	newItem["price"] = document.getElementById('new_price').value;

	if(newItem["name"] === "" || !isNaN(newItem['name'])){
		tempFlag = false;
		alert("The name specified is not valid");
	}else if(newItem["description"] === "" || !isNaN(newItem['description'])){
		tempFlag = false;
		alert("The description specified is not valid");
	}else if(newItem["price"] === "" || isNaN(newItem['price']) || newItem['price'] <= 0){
		tempFlag = false;
		alert("The price specified is not valid");
	}

	//Creating a newRestaurant with a skeleton of our restaurant object with a new item. 
	if(tempFlag){
		for(ele in currentRestaurant['menu']){
			newRestaurant[ele] = {};
			for(ele2 in currentRestaurant['menu'][ele]){
				if(ele.toLowerCase() === (newItem.category).toLowerCase() && flag){
					flag = false;
					newRestaurant[ele][idCounter++] = {};
				}
				
				if(Object.keys(currentRestaurant['menu'][ele][ele2]).length > 0){
					newRestaurant[ele][idCounter++] = {};
				}
				
			}
			//console.log(newRestaurant)
			if(!flag && flag2){
				flag2 = false;
				toAddAt = idCounter - 1;
				console.log("to add at" + toAddAt);
			}
		}

		let counter = 0;
		idCounter = 0;
		for(ele in newRestaurant){
			for(ele2 in newRestaurant[ele]){
				if(ele2 == toAddAt){
					newRestaurant[ele][idCounter++] = newItem;
				}
				else{
					newRestaurant[ele][idCounter++] = currentRestaurant['menu'][ele][counter++];
				}
				
			}
		}

		//Update the new Menu
		currentRestaurant['menu'] = newRestaurant;
		
		for (item in newRestaurant){
			console.log(item);
			for (item2 in newRestaurant[item]){
				console.log("The item2 is: "+ item2 + " : " +  newRestaurant[item][item2].name);
			}
		}

		let addItemHere = document.getElementById(`newItem${categoryID(newItem["category"])}`);
		let itemDiv = document.createElement('div');
		let innerHTML  = ``;
		innerHTML += `<h4>&emsp;&emsp;&emsp;&emsp;<em>▶ ${newItem["name"]}</em></h4>`;
		innerHTML += `<h4>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<em>Description: ${newItem["description"]}</em></h4>`;
		innerHTML += `<h4>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<em>Price: ${newItem["price"]}</em></h4>`;
		itemDiv.innerHTML = innerHTML;
		addItemHere.appendChild(itemDiv);
	}
}

//returns total number of items in the full menu
function totalItems(){
	let temp = 0;
	for(ele in currentRestaurant['menu']){
		for(ele2 in currentRestaurant['menu'][ele]){
			temp++;
		}
	}
	console.log("The totol items should be 6 and it is: "+temp);
	return temp;
}

//Returns the id of the category or
//returns the index of the given category
function categoryID(val){
	if(existsCategory(val)){
		let temp = 1;
		for(ele in currentRestaurant['menu']){
			if(val.toLowerCase() === ele.toLowerCase()){
				//console.log("the categoryID is: "+temp);
				return temp;
			}
			temp++;
		}	
	}
	return -1;
}

function saveChanges(){
	let restID = document.getElementById("id").value;
	//console.log("The rest ID is: " + restID);
	req = new XMLHttpRequest;
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("The data was successfully updated!");
		}
	}
	req.open("PUT", `http://localhost:3000/restaurants/${restID}`,true);
	req.setRequestHeader("Content-Type","application/json");
	currentRestaurant['name'] = document.getElementById("name").value;
	currentRestaurant['delivery_fee'] = document.getElementById("delivery_fee").value;
	currentRestaurant['min_order'] = document.getElementById("min_order").value;
	req.send(JSON.stringify(currentRestaurant));
	return;
}