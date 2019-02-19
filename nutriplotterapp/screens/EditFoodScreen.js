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
import { WebBrowser } from 'expo';
import IconMI from 'react-native-vector-icons/MaterialIcons'

var Datastore = require('react-native-local-mongodb'), 
platedb = new Datastore({ filename: 'plate', autoload: true });

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

				<TouchableOpacity style={styles.deleteView} onPress = {() => this.deleteItem(this.props.item.name)}>
					<Text style={styles.deleteText}><IconMI name="delete-forever" size={28}/></Text>
				</TouchableOpacity>
			</View>
		);
	}
	
	deleteItem(foodName){
		EditFoodScreen.deleteItem(foodName);
		EditFoodScreen.setState({promiseIsResolved: true});
	}
}

export default class EditFoodScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Food',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home', {plate: this.plate})}} />,
  });
  
    state = { 
		empty:'Your plate is empty! Add some by searching on the plate screen.',
		promiseIsResolved:false,
		foods:[],
	}
	
	static deleteItem = (foodName) => {
		platedb.remove({_id: foodName.toLowerCase()}, function (err, numRemoved) {
			updateFoodsState();
		});
	}
	
  
	componentDidMount() {
		setPromiseToResolved = () => {
			this.setState({promiseIsResolved: true})
		}

		setFoodsState = (allFoods) => {
			this.setState({foods: allFoods})
		}
		
		platedb.find({}, function (err, docs) {
			console.log("Current items on Plate: ");
			console.log(docs);
			setPromiseToResolved();
			var length = docs.length;
			console.log(length);
			var allFoods = [];
			for (i = 0; i < length; i++) {
				allFoods.push({"name":capitalizeFirstLetter(docs[i]._id)});
			}
			setFoodsState(allFoods);
		});
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		
	}
	

  
  onClearClick = () => {
	   Alert.alert(
		  'Clear Plate',
		  'Are you sure you want to delete all items on your plate?',
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'OK', onPress: () => {
			platedb.remove({}, { multi: true }, function (err, numRemoved) {
				deletePlate();
			});
			}
			},
		  ],
		  { cancelable: false }
		)
		deletePlate = () => {
			this.setState({foods:[]});
		}
   }
  
  render() {
	const {navigation}  = this.props;
	this.plate = navigation.getParam('plate', null);
	
		if(!this.state.promiseIsResolved){
			return null
		}
  
		return (
		  <View style={styles.bigContainer}>
			<View style = {styles.scrollContainer}>
			<FlatList
				data={this.state.foods}
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
