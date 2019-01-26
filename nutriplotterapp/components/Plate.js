import React, { Component } from 'react'
import { Text, ScrollView, TouchableOpacity, StyleSheet, View, TextInput, Image, Alert } from 'react-native'
import { WebBrowser, SQLite } from 'expo';
import Pie from 'react-native-pie';

const db = SQLite.openDatabase('db.db');
   
class Plate extends Component {
   state = {
	  foods: '',
   }
   onPlateClick = () => {
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
				alert("Your plate is empty! Add some by searching below.");
			}else{
				alert(allFoods);
			}
		});
   };

   render() {
      return (
	  <View style={styles.viewContainer}>
	    <TouchableOpacity activeOpacity = { .5 } onPress={ this.onPlateClick } style={styles.plate}>
	      <Pie
          radius={70}
          //completly filled pie chart with radius 70
          series={[56, 11, 77]}
          //values to show and color sequentially
          colors={['yellow', 'green', 'orange']}
        />
	    </TouchableOpacity>
		<TouchableOpacity activeOpacity = { .5 } onPress={ this.onClearClick } style={styles.viewContainer}>
	      <Text style={styles.clearButton}>Clear Plate</Text>
	    </TouchableOpacity>
	  </View>
      )
   }
   
   onClearClick(){
	   Alert.alert(
		  'Clear Plate',
		  'Are you sure you want to delete all items on your plate?',
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'OK', onPress: () => {
			db.transaction(tx => {
				tx.executeSql('delete from plate;');
			});
			}
			},
		  ],
		  { cancelable: false }
		)
   }
   
   deleteAll(){
	    
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
export default Plate

const styles = StyleSheet.create ({
   container: {
      padding: 10,
      marginTop: 3,
      alignItems: 'center',
	  backgroundColor: '#a1a1a1',
   },
   viewContainer:{
	flex:1,
   },
   plate: {
    flex:9,
	alignItems: 'center',
	justifyContent: 'space-around',
   },
   clearButton:{
	flex:1,
	textAlign: 'center',
	fontSize: 18,
	color: 'red',
	justifyContent: 'flex-end',
   },
   text: {
      color: '#4f603c'
   },
   scrollStyle: {
	  height: '70%',  
   },
     checkDB: {
	  textAlign: 'center',
	  color: 'red',
   },
     nameInput: {
     height: '15%',
     margin: '5%',
     paddingHorizontal: '5%',
     borderColor: '#111111',
     borderWidth: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    resizeMode: 'contain'
  },


})