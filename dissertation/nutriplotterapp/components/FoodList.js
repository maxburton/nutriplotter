import React, { Component } from 'react'
import { Text, ScrollView, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native'
import { WebBrowser, SQLite } from 'expo';
import { ListItem } from 'react-native-elements';

const db = SQLite.openDatabase('db.db');
   
class List extends Component {
   state = {
	  name: '',
	  test: '',
	  names: '[]',
   }
   alertItemName = (item) => {
	    var dbQuery = 'select name, calories, carbs, fats, protein from foods where name="' + item.name.toLowerCase() + '";';
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
			var kcals = JSON.parse(results).rows._array[0].calories;
			var carbs = JSON.parse(results).rows._array[0].carbs;
			var fats = JSON.parse(results).rows._array[0].fats;
			var protein = JSON.parse(results).rows._array[0].protein;
			var foodName = JSON.parse(results).rows._array[0].name;
			alert("Calories: " + kcals + " Carbs: " + carbs + " Fats: " + fats + " Protein: " + protein);
			db.transaction(tx => {
				tx.executeSql('insert or ignore into plate (name, amount) values ("' + foodName + '", 0);');
			});
		});
   };
   onChangeText = name => {
	  this.setState({ name });
	  if(name.length > 2 || name.length == 0){
		this.search(name);
	  }
   };
   render() {
      return (
	    <View>
		 <TextInput
			  onChangeText={this.onChangeText}
			  style={styles.nameInput}
			  placeHolder="Enter a food"
			  value={this.state.name}
		 />
         <ScrollView style = {styles.scrollStyle}>
            {
               JSON.parse(this.state.names).map((item, index) => (
                  <TouchableOpacity
                     key = {item.id}
                     style = {styles.container}
                     onPress = {() => this.alertItemName(item)}>
                     <Text style = {styles.text}>
                        {item.name}
                     </Text>
                  </TouchableOpacity>
               ))
            }
         </ScrollView>
		 <Text style={styles.checkDB}>{this.state.test}</Text>
	    </View>
      )
   }
   
       search = searchString => {
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
		    var dbOut = JSON.parse(results);
			var foods = [];
			var count = 0;
			if(dbOut.rows.length > 0){
				for(let i = 0; i < dbOut.rows._array.length; i++){ 
					let stringName = JSON.stringify(dbOut.rows._array[i].name);
					//console.log(stringName + "   " + searchString.toLowerCase());
					if(stringName.includes(searchString.toLowerCase()) && searchString.length > 0){
						var formattedString = stringName.replace(/['"]+/g, '');
						formattedString = capitalizeFirstLetter(formattedString);
						foods.push({"id":count,"name":formattedString});
						count++;
					}
				}
			}
			if(foods.length > 0 || searchString.length == 0){
				this.setState({
					test: '',
					names: JSON.stringify(foods),
				})
			}else{
				this.setState({
					test: "No foods found matching that criteria, please try again",
					names: JSON.stringify(foods),
				})
			}
	  });
  }


}
export default List

const styles = StyleSheet.create ({
   container: {
      padding: 10,
      marginTop: 3,
      alignItems: 'center',
	  backgroundColor: '#a1a1a1',
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


})