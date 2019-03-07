import React, { Component } from 'react'
import { 
	Text, 
	ScrollView, 
	TouchableOpacity, 
	StyleSheet, 
	View, 
	TextInput, 
	ImageBackground, 
	Image,
	Alert,
	UIManager,
	findNodeHandle,
} from 'react-native'


import { WebBrowser } from 'expo';
import Modal from "react-native-modal";
import Pie from 'react-native-pie';

import Food from './Food';
import SideItem from './SideItem';
import EditFood from "./EditFood";
import styles from '../themes/plateStyle';

var Datastore = require("react-native-local-mongodb"),
  platedb = new Datastore({ filename: "plate", autoload: true });

export default class Plate extends Component {
   state = {
	  foods: [], // Of Food Component
	  pieSeries: [],
	  pieColours: [],
	  empty: true,
	  isLoaded: false,
	  refresh: 0,
	  isModalVisible: false,
   }
   constructor(props) {
		super(props)
		updateState = updateState.bind(this)
	}
   
   componentDidMount(){
	    platedb.find({}, function (err, docs) {
			this.setState();
			console.log("loaded");
		});
		setState = () =>{
			this.setState({isLoaded: true});
		}
   }
   
   drawPie = () =>{
	   let drawPieKeys = {};
	   let drawPieColours = [];
	   let plate = global.plate;
	   for(let i = 0; i < plate.length; i++){
		   let group = plate[i].group;
		   if(group in drawPieKeys){
			   drawPieKeys[group] += plate[i].amount;
		   }else{
			   drawPieKeys[group] = plate[i].amount;
			   drawPieColours.push(global.colours[group]);
		   }
	   }
	   let drawPieSeries = [];
	   for(let pieGroup in drawPieKeys){
		   drawPieSeries.push(drawPieKeys[pieGroup]);
		   //global.pieSeries.push()
	   }
	   return {series: drawPieSeries, colours: drawPieColours};
   }
   
   platePressed = () =>{
	   this.setState({isModalVisible: true});
   }
   
   closeModal = () =>{
	   this.setState({isModalVisible: false});
   }
   
   render() {
	  var foodImages = {
			savouries:require('../assets/images/savouries.png'),
			misc:require('../assets/images/misc.png'),
			sauce:require('../assets/images/sauce.png'),
			soup:require('../assets/images/soup.png'),
			chocolate:require('../assets/images/chocolate.png'),
			snacks:require('../assets/images/snacks.png'),
			sweets:require('../assets/images/sweets.png'),
			drinks:require('../assets/images/drinks.png'),
			booze:require('../assets/images/booze.png'),
			oil:require('../assets/images/oil.png'),
			burger:require('../assets/images/burger.png'),
			game:require('../assets/images/game.png'),
			chicken:require('../assets/images/chicken.png'),
			beef:require('../assets/images/beef.png'),
			bacon:require('../assets/images/bacon.png'),
			fish:require('../assets/images/fish.png'),
			herbs:require('../assets/images/herbs.png'),
			nuts:require('../assets/images/nuts.png'),
			juice:require('../assets/images/juice.png'),
			fruit:require('../assets/images/fruit.png'),
			vegdish:require('../assets/images/vegdish.png'),
			veg:require('../assets/images/veg.png'),
			beans:require('../assets/images/beans.png'),
			potato:require('../assets/images/potato.png'),
			egg:require('../assets/images/egg.png'),
			cream:require('../assets/images/cream.png'),
			icecream:require('../assets/images/icecream.png'),
			milk:require('../assets/images/milk.png'),
			pudding:require('../assets/images/pudding.png'),
			cakes:require('../assets/images/cakes.png'),
			biscuits:require('../assets/images/biscuits.png'),
			cereals:require('../assets/images/cereals.png'),
			pastries:require('../assets/images/pastries.png'),
			bread:require('../assets/images/bread.png'),
			pizza:require('../assets/images/pizza.png'),
			pasta:require('../assets/images/pasta.png'),
			rice:require('../assets/images/rice.png'),
			sandwich:require('../assets/images/sandwich.png'),
			grains:require('../assets/images/grains.png'),
		};
	  let pieData = this.drawPie();
	  if(!this.state.isLoaded){return null};
	  
	  let renderFoods = [];
	  let plate = global.plate;
	  let percentageSoFar = 0;
	  for(let i = 0; i < plate.length; i++){
		let amount = plate[i].amount;
		let oldPercentage = percentageSoFar;
		percentageSoFar += amount;
		let midPoint = Math.floor((percentageSoFar + oldPercentage)/2)
		let top = 10;
		let left = 50;
		if(midPoint < 50){
			top = 10 + Math.floor(50 * (midPoint * 0.02));
		}else{
			top = 60 + Math.floor(50 * (1 - (midPoint * 0.02)));
		}
		if(midPoint < 25){
			left = 50 + Math.floor(10 * (midPoint * 0.04));
		}else if(midPoint < 75){
			left = 60 + Math.floor(30 * (1 - (midPoint * 0.04)));
		}else{
			left = 0 + Math.floor(30 * ((midPoint * 0.04) - 3));
		}
		let topString = top + "%";
		let leftString = left + "%";
		let group = plate[i].group;
		renderFoods.push(
			<View style={{zIndex: 20, position: "absolute", top: topString, left: leftString}}>
				<Image source={foodImages[group]} />
			</View>
		)
	  }
	
      return (
	  <View style={styles.viewContainer}>
	  
	    <View style={styles.plate} onLayout={(event) => {
			var dimension = event.nativeEvent.layout;  
			this.state.dimensions = {
			  x: dimension.x,
			  y: dimension.y,
			  width: dimension.width,
			  height: dimension.height,
			  center: {
				  x: dimension.x + Math.floor(dimension.width / 2), 
				  y: dimension.y + Math.floor(dimension.height / 2)
			  },
			  radius: Math.floor(dimension.width / 2)
			}
		}}>

		<TouchableOpacity onPress={() => this.platePressed()}>
		<View>
			<ImageBackground 
				alignContent={'center'}
				style={StyleSheet.create({zIndex: 2})} 
				source={require('../assets/images/plate.png')}>
				<Pie
				 // Make the pie chart a ring around the plate which fills up based on the foods present
				  radius={105} innerRadius={81} on
				  left={25}
				series={pieData["series"]}
				 //values to show and color sequentially
				colors={pieData["colours"]}
				style={StyleSheet.create({zIndex: 3})}/>
			</ImageBackground>
			{renderFoods}
		</View>
		</TouchableOpacity>
		</View>
		<Modal
          backdropOpacity={0}
          isVisible={this.state.isModalVisible}
        >
			<ScrollView
            style={{
				flex: 1,
				backgroundColor: "#fff",
				borderRadius: 4,
				borderColor: "#000",
				borderWidth: 2,
				marginTop: "90%",
            }}>
				<TouchableOpacity onPress={() => this.setState({isModalVisible: false}) }>
					<Text style={styles.backButton}>Back to Plate</Text>
				</TouchableOpacity>
				<EditFood/>
			</ScrollView>
		</Modal>
	  </View>
      )
   }

   
   // For each food in the plate's state, add its component render JSX to
   // an array, return the array for rendering by the plate.
   renderFoodFromState(){
	var foodRender = [];

	for (const food of this.state.foods) {
		foodRender.push(food.render());
		console.log(food);
	}
	return foodRender;
   }



   	

   // Give the % of the pie chart as a given nutrition score, which dynamically updates to reflect
   // what's on the plate.
   renderPieSeries = function(){
	   return [this.state.nutritionScore];
   }
   
   clearFoodState() {
	   this.state.foods = [];
	   this.state.empty = true;
   }

   // Get the names of all food items on the plate
   getFoodNames() {
	   console.log("Getting food names");
	   if (this.state.empty) {
		   return "The plate is empty.";
	   } else {
		   //console.log(this.state.foods);
		   var s = "[";
		   for (i = 0; i < this.state.foods.length; i++) {
		      s += this.state.foods[i].state.name + ",";
		   }
		   s += "]";
		   return s;
	   }
   }
   
    deleteItem = searchString => {
		var dbQuery = 'select name from foods;';
		var promise = new Promise(function (resolve, reject) {
			db.transaction(function (transaction) {
				transaction.executeSql(dbQuery, [], function (transaction, result) {
					resolve(JSON.stringify(result)); // here the returned Promise is resolved
				}, nullHandler, errorHandler);
			});
		});
		
		function nullHandler(result){
			console.log("Null Log : " + JSON.stringify(result));
		}

		function errorHandler(error){
			console.log("Error Log : " + error);
		}
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	  
		promise.then((results) => {
		    //code runs after field deleted
	  });
	}
}