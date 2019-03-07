import React, { Component } from 'react'
import { Text, Image, TouchableOpacity, StyleSheet, View, TextInput, FlatList, Alert } from 'react-native'
import { WebBrowser } from 'expo';
import { ListItem } from 'react-native-elements';
import firebase from "./Firebase.js";

var Datastore = require('react-native-local-mongodb'), 
db = new Datastore({ filename: 'foods', autoload: true });
platedb = new Datastore({ filename: 'plate', autoload: true });

class FlatListItem extends Component{
	state = {isSelected: false}
	render(){
		let isSelected = this.state.isSelected;
		for(let i = 0; i < global.plate.length; i++){
			if(global.plate[i].data.name == this.props.item.name.toLowerCase()){
				isSelected = true;
			}
		}
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
		var group = this.props.item.group;
		return(
		<TouchableOpacity onPress = {() => this.alertItemName(this.props.item)}>
			<View style={isSelected ? styles.itemStyleSelected : styles.itemStyle}>
				<Image
					source={foodImages[group]}
					style={styles.image}
				/>
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
		var isPlateIn = false;
		var newFoodId = item.name.toLowerCase()
		let index = 0;
		for(let i = 0; i < global.plate.length; i++){
			//console.log(item.name.toLowerCase() + "  --  " + global.plate[i]._id.toLowerCase());
			if(item.name.toLowerCase() == global.plate[i]._id.toLowerCase()){
				index = i
				isPlateIn = true;
				break;
			}
		}
		if(!isPlateIn){
			global.plate.push({"_id": item.name, "amount": 0, "group": item.group, "data": item.data});
			this.setState({isSelected: true});
			console.log(newFoodId + " Inserted");
		}else{
			this.setState({isSelected: false});
			global.plate.splice(index, 1);
			console.log(newFoodId + " Deleted");
		}
		
		platedb.find({_id: newFoodId}, function (err, newDocs) {
			if(newDocs.length == []){
				platedb.update({ _id: newFoodId}, { $set: { amount: 0, group: item.group, data: item.data } }, { upsert: true }, function (err, numReplaced, upsert) {
				});
			}else{
				platedb.remove({_id: newFoodId}, function (err, numRemoved) {
					console.log("Removed from DB!");
				});
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
			
		}
		
		
		if(searchString.length > 0){
			var stringToGoIntoTheRegex = searchString.toLowerCase();//
			var regex = new RegExp(stringToGoIntoTheRegex, "g");
			var foods = [];
			var count = 0;
			
			for(let i = 0; i < global.nameList.length; i++) {
				let entry = global.nameList[i];
				if(entry.search(regex) != -1){
					var data = global.foods[entry];
					var formattedString = entry.replace(/['"]+/g, '');
					formattedString = capitalizeFirstLetter(formattedString);
					var group = determineGroup(data.group.toLowerCase());
					foods.push({"id":count,"name":formattedString,"group":group,"data":data});
					count++;
				}
			}
			if(count > 0 || searchString.length == 0){
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
		}else{
			this.setState({
				test: '',
				names: [],
			})
		}
		function determineGroup(input){
			input = input.toLowerCase();
			var group = "";
			switch(input) {
				case "a":
				case "aa":
					group = "grains";
					break;
				case "ab":
					group = "sandwich";
					break;
				case "ac":
					group = "rice";
					break;
				case "ad":
					group = "pasta";
					break;
				case "ae":
					group = "pizza";
					break;
				case "af":
				case "ag":
					group = "bread";
					break;
				case "ak":
				case "ai":
					group = "cereals";
					break;
				case "am":
					group = "biscuits";
					break;
				case "an":
					group = "cakes";
					break;
				case "ao":
				case "ap":
					group = "pastries";
					break;
				case "as":
				case "br":
					group = "pudding";
					break;
				case "at":
				case "bv":
					group = "savouries";
					break;
				case "b":
				case "ba":
				case "bab":
				case "bae":
				case "bah":
				case "bak":
				case "ban":
				case "bar":
				case "bc":
				case "bf":
				case "bfd":
				case "bfg":
				case "bfj":
				case "bfp":
				case "bh":
				case "if":
				case "ifb":
				case "ifc":
					group = "milk";
					break;
				case "bj":
				case "bjc":
				case "bjf":
				case "bjl":
				case "bjp":
				case "bjs":
					group = "cream";
					break;
				case "bl":
					group = "cheese";
					break;
				case "bn":
				case "bne":
				case "bnh":
				case "bns":
					group = "cream";
					break;
				case "bp":
					group = "icecream";
					break;
				case "c":
				case "ca":
				case "cd":
				case "cde":
				case "cdh":
					group = "egg";
					break;
				case "da":
				case "dae":
				case "dam":
				case "dap":
				case "dar":
					group = "potato";
					break;
				case "df":
				case "db":
					group = "beans";
					break;
				case "d":
				case "dg":
				case "di":
					group = "veg";
					break;
				case "dr":
					group = "vegdish";
					break;
				case "f":
				case "fa":
					group = "fruit";
					break;
				case "fc":
				case "pe":
					group = "juice";
					break;
				case "ga":
				case "g":
					group = "nuts";
					break;
				case "h":
					group = "herbs";
					break;
				case "j":
				case "ja":
				case "jc":
				case "jk":
				case "jm":
				case "jr":
					group = "fish";
					break;
				case "maa":
				case "mag":
					group = "bacon";
					break;
				case "m":
				case "ma":
				case "mac":
				case "mai":
				case "mae":
				case "mig":
				case "mr":
				case "mi":
					group = "beef";
					break;
				case "mc":
				case "mca":
				case "mcc":
				case "mce":
				case "mcg":
				case "mci":
				case "mck":
				case "mcm":
				case "mco":
					group = "chicken";
					break;
				case "me":
				case "mea":
				case "mec":
				case "mee":
				case "meg":
					group = "game";
					break;
				case "mbg":
					group = "burger";
					break;
				case "o":
				case "oa":
				case "ob":
				case "oc":
				case "oe":
				case "of":
					group = "oil";
					break;
				case "p":
				case "pa":
				case "paa":
				case "pac":
				case "pc":
				case "pca":
				case "pcc":
					group = "drinks";
					break;
				case "q":
				case "qa":
				case "qc":
				case "qe":
				case "qf":
				case "qg":
				case "qi":
				case "qk":
					group = "booze";
					break;
				case "s":
				case "sc":
				case "se":
				case "sec":
					group = "sweets";
					break;
				case "sea":
					group = "chocolate";
					break;
				case "sn":
				case "sna":
				case "snb":
				case "snc":
					group = "snacks";
					break;
				case "wa":
				case "waa":
				case "wac":
				case "wae":
					group = "soup";
					break;
				case "wc":
				case "wcd":
				case "wcg":
				case "wcn":
					group = "sauce";
					break;
				case "wcg":
				case "we":
					group = "misc";
					break;
				default:
					group = "misc";
					break;
			}
			return group;
		}
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
	  height: '80%',  
   },
  checkDB: {
	  textAlign: 'center',
	  color: 'red',
   },
  nameInput: {
     height: '15%',
     marginHorizontal: '6%',
	 marginVertical: 5,
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
  itemStyleSelected: {
	flex: 1,  
	flexDirection: 'row',
	padding: 8,
    marginTop: 3,
    alignItems: 'flex-start',
	backgroundColor: 'yellow',
	justifyContent: 'center',
  },
  image: {
	  width: 30,
	  height: 30,
	  margin: 2,
  },


})