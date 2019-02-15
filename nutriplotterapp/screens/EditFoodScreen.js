import React, { Component } from 'react'
import {
  Switch,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { WebBrowser, SQLite } from 'expo';
import IconMI from 'react-native-vector-icons/MaterialIcons'

const db = SQLite.openDatabase('db.db');

class FlatListItem extends Component{
	render(){
		return(
			<View style={styles.itemStyle}>
				<Image
					source={require('../assets/images/apple.png')}
					style={styles.image}
				>
				</Image>

				<Text style={styles.buttonView}>{this.props.item.name}</Text>

				<TouchableOpacity style={styles.deleteView} onPress = {() => this.deleteItem(this.props.index)}>
					<Text style={styles.deleteText}><IconMI name="delete-forever" size={28}/></Text>
				</TouchableOpacity>
			</View>
		);
	}
	
	deleteItem(){
		alert("Deleted");
	}
}

export default class EditFoodScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Food',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home', {plate: this.plate})}} />,

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
		var allFoods = [];
		for (i = 0; i < length; i++) { 
		  allFoods.push({"name":capitalizeFirstLetter(dbOut.rows._array[i].name)});
		} 
		this.setState({foods: JSON.stringify(allFoods)})
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
	foods:'[]',
  }
  
  onClearClick = () => {
	   Alert.alert(
		  'Clear Plate',
		  'Are you sure you want to delete all items on your plate?',
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'OK', onPress: () => {
			db.transaction(tx => {
				tx.executeSql('delete from plate;');
			});
			this.setState({foods:'[]'});
			this.forceUpdate();
			}
			},
		  ],
		  { cancelable: false }
		)
		
   }
  
  render() {
	  const {navigation}  = this.props;
		this.plate = navigation.getParam('plate', null);

    this.load();
		if(!this.state.promiseIsResolved){
			return null
		}
  
		return (
		  <View style={styles.bigContainer}>
			<View style = {styles.scrollContainer}>
			<FlatList
				data={JSON.parse(this.state.foods)}
				renderItem={({item, index})=>{
					return(
						<FlatListItem item={item} index={index}>
						</FlatListItem>
					);
				}}
			>
			</FlatList>
			</View>
			<TouchableOpacity onPress={ this.onClearClick }>
				<Text style={styles.clearButton}>Clear Plate</Text>
			</TouchableOpacity>
		  </View>
		);
	
	
  }
}

const styles = StyleSheet.create ({
  bigContainer: {
     flex: 1,
     marginTop: 35,
  },
  scrollContainer: {
     flex: 1,
     marginTop: 10,
	 justifyContent: 'flex-start',
  },
  clearButton:{
		textAlign: 'center',
		fontSize: 18,
		color: 'red',
		justifyContent: 'flex-end',
		marginBottom: 30,
		marginTop: 30,
  },
  imageView: {
	  flex: 1,
  },
  buttonView: {
	  width: '100%',
	  marginLeft: 10,
	  flexDirection: 'column',
	  flex: 1,
  },
  itemStyle: {
		flex: 1,  
		flexDirection: 'row',
		padding: 8,
    marginTop: 3,
    alignItems: 'flex-start',
		backgroundColor: '#c1c1c1',
  },
  image: {
	  width: 30,
	  height: 30,
	  margin: 2,
  },
  deleteView: {
	  width: 45,
	  height: 35,
	  margin: 4,
	  marginLeft: 12,
	  borderRadius: 15,
	  backgroundColor: 'red',
	  justifyContent: 'center',
	  alignItems: 'center',
  },
  deleteText: {
	  color: 'white',
	  fontSize: 24,
  }
});
