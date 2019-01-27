import React from 'react';
import {
  Switch,
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import { WebBrowser, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class EditFoodScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Food',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home')}} />,

  });
  
  load(){
	var dbQuery = 'select name, amount from plate;';
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
		this.setState({promiseIsResolved: true});
		var dbOut = JSON.parse(results);
		var length = dbOut.rows.length;
		var allFoods = "";
		for (i = 0; i < length; i++) { 
		  allFoods = allFoods + (i+1) + ". " + capitalizeFirstLetter(dbOut.rows._array[i].name) + "\n";
		} 
		this.setState({foods: allFoods})
		if(length == 0){
			//alert("Your plate is empty! Add some by searching below.");
		}else{
			//alert(allFoods);
		}			
	})
  }
	
  state = { 
	empty:'Your plate is empty! Add some by searching on the plate screen.',
	promiseIsResolved:false,
  }
  
  render() {
	  
    this.load();
	if(!this.state.promiseIsResolved){
		return <Text>Loading...</Text>
		}
  
	return (
		  <View style={styles.container}>
			<Text>{this.state.foods}</Text>
			<Button title="Go to Home screen"
			onPress={() => this.props.navigation.navigate('Home')}
		   />
		  </View>
	);
	
	
  }
}

const styles = StyleSheet.create ({
  container: {
     flex: 1,
     marginTop: 100,
	 alignItems: 'center',
	 justifyContent: 'space-around',
  }
})
