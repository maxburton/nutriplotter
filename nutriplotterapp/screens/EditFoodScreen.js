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
  Slider,
} from 'react-native';
import { WebBrowser } from 'expo';
import IconMI from 'react-native-vector-icons/MaterialIcons'
import IconFA from 'react-native-vector-icons/FontAwesome'

var Datastore = require('react-native-local-mongodb'), 
platedb = new Datastore({ filename: 'plate', autoload: true });

import Plate from "../components/Plate.js";
import getStyleSheet from "../themes/style";

class FlatListItem extends Component{
	
	state = {
		grams: this.props.item.name[1],
		maximum: global.maximum,
		refresh: 0,
	}
	
	updatePlate = (val) =>{
		this.props.flatListParent.updateChild(val);
		this.props.flatListParent.setState({refresh: 1});
		for(let i = 0; i < global.plate.length; i++){
			if(global.plate[i]._id.toLowerCase() == this.props.item.name[0].toLowerCase()){
				global.plate[i].amount = val;
			}
		}
		platedb.update({ _id: this.props.item.name[0].toLowerCase() }, { $set: { amount: val }}, {}, function (err, numReplaced) {
			platedb.find({}, function (err, docs) {
			});
		});
	}
	plusButtonPressed = () => {
		var oldWeight = this.state.grams;
		var newWeight = oldWeight + 1;
		if(!(newWeight > (global.maximum + oldWeight))){
			this.sliderChange(newWeight);
			this.updatePlate(newWeight);
		}
	}
	
	minusButtonPressed = () => {
		var oldWeight = this.state.grams;
		var newWeight = oldWeight - 1;
		if(!(newWeight < 0)){
			this.sliderChange(newWeight);
			this.updatePlate(newWeight);
		}
	}
	
	componentDidMount(){
		this.recalculateMaximum();
	}
	
	render(){
		var randomImages = {
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
		var group = this.props.item.name[2];
		return(
			<View style={styles.itemBackground}>
				<View style={styles.itemStyle}>
					<Image
						source={randomImages[group]}
						style={styles.image}
					>
					</Image>

					<Text style={styles.buttonView}>{this.props.item.name[0]}</Text>

					<TouchableOpacity style={styles.deleteView} onPress = {() => this.deleteItem(this.props.item.name[0])}>
						<Text style={styles.deleteText}><IconMI name="delete-forever" size={28}/></Text>
					</TouchableOpacity>
				</View>
				<View style={styles.sliderView}>
				<TouchableOpacity onPress = {() => this.minusButtonPressed()}>
					<Text style={styles.minusText}><IconFA name="minus-circle" size={22}/></Text>
				</TouchableOpacity>
				<Slider
					style={styles.slider}
					step={1}
					minimumValue={0}
					maximumValue={this.state.grams + global.maximum}
					value={this.state.grams}
					onValueChange={val => this.sliderChange(val) }
					onSlidingComplete={val => this.updatePlate(val)}
				/>
				<TouchableOpacity onPress = {() => this.plusButtonPressed()}>
					<Text style={styles.plusText}><IconFA name="plus-circle" size={22}/></Text>
				</TouchableOpacity>
				<Text style={styles.sliderText}>{this.state.grams}%</Text>
				</View>
			</View>
		);
	}
	
	sliderChange = (newVal) =>{
		global.maximum -= (newVal - this.state.grams);
		this.setState({grams: newVal, maximum: global.maximum});
		console.log("Percentage of plate left: " + this.state.maximum);
		for(let i = 0; i < global.plate.length; i++){
			if(global.plate[i]._id.toLowerCase() == this.props.item.name[0].toLowerCase()){
				global.plate[i].amount = newVal;
			}
		}
		this.rerenderPie(Math.random());
		this.props.flatListParent.setState({refresh: Math.random()});
	}
	
	rerenderPie = (newVal) =>{
		this.props.flatListParent.updateChild(newVal);
	}
	
	deleteItem = (foodName) =>{
		console.log("DELETE PRESSED");
		for(let i = 0; i < global.plate.length; i++){
			if(global.plate[i]._id.toLowerCase() == foodName.toLowerCase()){
				global.plate.splice(i, 1);
				var newVal = this.state.refresh + 1
				this.setState({refresh: newVal});
			}
		}
		platedb.remove({_id: foodName.toLowerCase()}, function (err, numRemoved) {
			this.recalculateMaximum();
		});
		recalculateMaximum = () =>{
			this.recalculateMaximum();
		}
		this.props.flatListParent.refreshFlatList();
	}
	
	recalculateMaximum = () =>{
		global.maximum = 100;
		for(let i = 0; i < global.plate.length; i++){
			global.maximum -= global.plate[i].amount;
		}
		this.setState({maximum: global.maximum});
	}
	
	
}

updateState = (rand) =>{
    this.setState({rand})
}

export default class EditFoodScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Food',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home')}} />,
  });
  
    constructor(props) {
        super(props)
    }
    updateChild = (rand) => {
        updateState(rand)
    }
  
    state = { 
		empty:'Your plate is empty! Add some by searching on the plate screen.',
		promiseIsResolved:false,
		foods:[],
		refresh: 0,
	}

	recalculateMaximum = () =>{
		global.maximum = 100;
		for(let i = 0; i < global.plate.length; i++){
			global.maximum -= global.plate[i].amount;
		}
	}	
  
	componentDidMount() {
		this.recalculateMaximum();
		setPromiseToResolved = () => {
			this.setState({promiseIsResolved: true})
		}		
		console.log("Current items on Plate: ");
		console.log(global.plate);
		setPromiseToResolved();
		var length = global.plate.length;
		var allFoods = [];
		var maximumGrams = 100;
		for (i = 0; i < length; i++) {
			allFoods.push({"name": [capitalizeFirstLetter(global.plate[i]._id), global.plate[i].amount, global.plate[i].group]});
			maximumGrams -= global.plate[i].amount;
		}
		this.setState({foods: allFoods})
		
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
			global.plate = [];
			this.setState({foods:[]});
			global.maximum = 100;
		}
   }
   
   refreshFlatList = () =>{
		var length = global.plate.length;
		var allFoods = [];
		var maximumGrams = 100;
		for (i = 0; i < length; i++) {
			allFoods.push({"name": [capitalizeFirstLetter(global.plate[i]._id), global.plate[i].amount, global.plate[i].group]});
			maximumGrams -= global.plate[i].amount;
		}
		this.setState({foods: allFoods})
		
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}	
  
  render() {
	const {navigation}  = this.props;
	
		if(!this.state.promiseIsResolved){
			return null
		}
  
		return (
		  <View style={styles.bigContainer}>
		    <View style={styles.plateView}>
			  <TouchableOpacity
				style={styles.list}
				onPress={
				  () =>
					this.props.navigation.navigate("Home")
				}
			  >
				<Plate/>
			  </TouchableOpacity>
			</View>
			<View style = {styles.scrollContainer}>
			<FlatList
				data={this.state.foods}
				extraData={this.state.refresh}
				renderItem={({item, index})=>{
					return(
						<FlatListItem item={item} index={index} flatListParent={this}>
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
  },
  plateView: {
	  flex: 1,
	  marginTop: "15%",
  },
  scrollContainer: {
     flex: 1,
	 justifyContent: 'flex-end',
  },
  clearButton:{
		textAlign: 'center',
		fontSize: 18,
		color: 'red',
		justifyContent: 'flex-end',
		marginBottom: 20,
		marginTop: 20,
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
		backgroundColor: '#c1c1c1',
		alignItems: 'center',
		
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
  },
  sliderView: {
	  flex: 1,
	  flexDirection: 'row',
	  alignItems: 'center',
	  backgroundColor: '#a1a1a1',
  },
  slider:{
	  flex: 7,
	  marginLeft: 15,
  },
  sliderText: {
	   flex: 2,
	   marginRight: 15,
	   fontSize: 16,
	   textAlign: 'right',
  },
  itemBackground:{
	  
	  marginTop: 5,
  },
  plusText: {
	   marginLeft: 15,
	   fontSize: 24,
  },
    minusText: {
	   marginLeft: 15,
	   fontSize: 24,
  },
});
