function addRestaurant(){
	let tempFlag = true;
	let restaurantObject = objConstructor();
	//console.log(restaurantObject['name']);
	if(restaurantObject['name'] === "" || !isNaN(restaurantObject['name'])){
		tempFlag = false;
		alert("The name specified is not valid");
	}
	else if(restaurantObject['delivery_fee'] === "" || isNaN(restaurantObject['delivery_fee']) || restaurantObject['delivery_fee'] <= 0){
		tempFlag = false;
		alert("The delivery fee is either not specified or is not valid");
	}
	else if(restaurantObject['min_order'] === "" || isNaN(restaurantObject['min_order']) || restaurantObject['min_order']<=0){
		tempFlag = false;
		alert("The minimum order fee is either not specified or is not valid");
	}

	//Send a post request
	if(tempFlag){
		req = new XMLHttpRequest;
		req.onreadystatechange = function() {
			if(this.readyState==4 && this.status==201){
				let result = JSON.parse(this.responseText);
				window.location.replace(`http://localhost:3000/restaurants/${result['id']}`);
			}
		}
		req.open("POST", `http://localhost:3000/addRestaurant`,true);
		req.setRequestHeader("Content-Type","application/json");
		req.send(JSON.stringify(restaurantObject));
		return;	
	}
	
}

//construct a new restaurant object that we can send in the request
function objConstructor(){
	let newRestaurant = {};
	newRestaurant["name"] = document.getElementById("name").value;
	newRestaurant["delivery_fee"] = document.getElementById("deliveryFee").value;
	newRestaurant["min_order"] = document.getElementById("minOrder").value;
	return newRestaurant;
}

