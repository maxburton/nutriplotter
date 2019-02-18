import React, { Component } from 'react'
import { Text, Image, TouchableOpacity, StyleSheet, View, TextInput, FlatList } from 'react-native'
import { WebBrowser } from 'expo';
import { ListItem } from 'react-native-elements';

var Datastore = require('react-native-local-mongodb'), 
db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

class FlatListItem extends Component{
	render(){
		return(
			<View style={styles.itemStyle}>
				<Image
					source={require('../assets/images/apple.png')}
					style={styles.image}
				>
				
				</Image>
				<View style={styles.buttonView}>
					<TouchableOpacity
						 style = {styles.container}
						 onPress = {() => this.alertItemName(this.props.item)}
					>
						<Text>{this.props.item.name}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
	
	alertItemName = (item) => {
		//alert(item.name);
		var myPromise = () => {
			return new Promise((resolve, reject) => {
            db
             .find({})
             .toArray(function(err, data) {
                 err 
                    ? reject(err) 
                    : resolve(data);
               });
         });
       };
		
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
}
   
class List extends Component {
   state = {
	  name: '',
	  test: '',
	  names: '[]',
   }
   
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
         <View style = {styles.scrollStyle}>
			<Text style={styles.checkDB}>{this.state.test}</Text>
			<FlatList
				data={JSON.parse(this.state.names)}
				renderItem={({item, index})=>{
					return(
						<FlatListItem item={item} index={index}>
						</FlatListItem>
					);
				}}
			>
			</FlatList>
        </View>
	    </View>
      )
   }
   
     search = searchString => {
		 var stringToGoIntoTheRegex = searchString;
		 var regex = new RegExp(stringToGoIntoTheRegex, "g");
		 db.insert({ name: "haggis", calories: 100, carbs: 200, fats: 300 }, function (err, newDocs) {
        // Two documents were inserted in the database
    }); 
	   
	   	var promise = new Promise(function (resolve, reject) {
		db.find({ name: "haggis" }, function (err, docs) {
				resolve(docs); // here the returned Promise is resolved
			}, nullHandler, errorHandler);
		});
	
	function nullHandler(result){
		console.log("Null Log : " + result);
	}

	function errorHandler(error){
		console.log("Error Log : " + error);
	}
	
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  
	promise.then((results) => {
		console.log(results);		
	})
	
	  /*
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
	  */
  }


}
export default List

const styles = StyleSheet.create ({
   container: {
      marginLeft: 10,
	  justifyContent: 'center',
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
  imageView: {
	  flex: 1
  },
  buttonView: {
	  justifyContent: 'center',
	  flex: 1,
	  flexDirection: 'column',
  },
  itemStyle: {
	flex: 1,  
	flexDirection: 'row',
	padding: 8,
    marginTop: 3,
    alignItems: 'flex-start',
	backgroundColor: '#c1c1c1',
	justifyContent: 'center',
  },
  image: {
	  width: 30,
	  height: 30,
	  margin: 2,
  },


})