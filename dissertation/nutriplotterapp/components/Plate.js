import React, { Component } from 'react'
import { 
	Text, 
	ScrollView, 
	TouchableOpacity, 
	StyleSheet, 
	View, 
	TextInput, 
	Image, 
	Alert
} from 'react-native'


import { WebBrowser, SQLite } from 'expo';
import Pie from 'react-native-pie';

import Food from './Food';
import styles from '../themes/plateStyle';

const db = SQLite.openDatabase('db.db');
var a = new Food('a');

class Plate extends Component {
   state = {
	  foods: [a], // Of Food Component
	  pieSeries: [],
	  pieColours: []
   }


   onPlateClick = () => {
	   nutritionScore += 10;
	   console.log("Plate Clicked");
	    var dbQuery = 'select name, amount from plate;';
		//alert(item.name);
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
			var dbOut = JSON.parse(results);
			var length = dbOut.rows.length;
			var allFoods = "";
			for (i = 0; i < length; i++) { 
			  allFoods = allFoods + (i+1) + ". " + capitalizeFirstLetter(dbOut.rows._array[i].name) + "\n";
			} 
			if(length == 0){
				//alert("Your plate is empty! Add some by searching below.");
			}else{
				//alert(allFoods);
			}
		});
   };

   render() {
		var foodRender = [];

		for (const food of this.state.foods) {
			foodRender.push(food.render());
			console.log(food);
		}


      return (
	  <View style={styles.viewContainer}>
	    <View style={styles.plate}>
			
			<Pie
		  // Make the pie chart a ring around the plate which fills up based on the foods present
          	radius={100} innerRadius={95} on

          series={this.state.pieSeries}
          //values to show and color sequentially
		  colors={this.state.pieColours}/>
		  {foodRender}
		
		</View>
		
	  </View>
      )
   }
   



   renderPieSeries = function(){
	   return [this.state.nutritionScore];
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
export default Plate;