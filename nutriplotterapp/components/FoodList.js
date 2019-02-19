import React, { Component } from 'react'
import { Text, Image, TouchableOpacity, StyleSheet, View, TextInput, FlatList } from 'react-native'
import { WebBrowser } from 'expo';
import { ListItem } from 'react-native-elements';

var Datastore = require('react-native-local-mongodb'), 
db = new Datastore({ filename: 'foods', autoload: true });
platedb = new Datastore({ filename: 'plate', autoload: true });

class FlatListItem extends Component{
	render(){
		return(
		<TouchableOpacity onPress = {() => this.alertItemName(this.props.item)}>
			<View style={styles.itemStyle}>
				<Image
					source={require('../assets/images/apple.png')}
					style={styles.image}
				>
				</Image>
				<View style={styles.buttonView}>
					<View style = {styles.container}>
						<Text>{this.props.item.name}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
		);
	}
	
	alertItemName = (item) => {
		var newFoodId = item.name.toLowerCase()
		platedb.find({_id: newFoodId}, function (err, newDocs) {
			if(newDocs.length == []){
				platedb.insert({_id: newFoodId, amount: 0}, function (err, newDocs) {
					console.log(newFoodId + " Inserted");
				}); 
			}else{
				console.log(newFoodId + " already in database!");
			}
		}); 
		
	};
}
   
class List extends Component {
    state = {
	    name: '',
	    test: '',
	    names: [],
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
				data={this.state.names}
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
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		
		handleStateChange = (foodlen, searchlen, foods) => {
			if(foodlen > 0 || searchlen == 0){
				this.setState({
					test: '',
					names: foods,
				})
			}else{
				this.setState({
					test: "No foods found matching that criteria, please try again",
					names: foods,
				})
			}
		}
		
		var stringToGoIntoTheRegex = searchString.toLowerCase();
		var regex = new RegExp(stringToGoIntoTheRegex, "g");
		if(searchString.length > 0){
			db.find({_id: regex}, function (err, docs) {
				console.log(docs); // here the returned Promise is resolved
				var foods = [];
				var count = 0;
				if(docs.length > 0){
					for(let i = 0; i < docs.length; i++){ 
						var formattedString = docs[i]._id.replace(/['"]+/g, '');
						formattedString = capitalizeFirstLetter(formattedString);
						foods.push({"id":count,"name":formattedString});
						count++;
					}
				}
				handleStateChange(foods.length, searchString.length, foods);
			});
		}else{
			this.setState({
				test: '',
				names: [],
			})
		}
	  
	
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