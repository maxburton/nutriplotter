/*
	Shows the user's saved plates (as well as a few default plates). These plates can be loaded into the homescreen.
*/

import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Switch,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

var Datastore = require("react-native-local-mongodb"),
  savedPlatesdb = new Datastore({ filename: "savedPlates", autoload: true });

class FlatListItem extends React.Component{
	render(){
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
		
		renderImages = []
		let plate = this.props.item.plate
		for(let i = 0; i < plate.length; i++){
			if(i > 3){
				break;
			}
			let group = plate[i].group
			renderImages.push(
			<Image
				source={foodImages[group]}
				style={styles.image}
			/>
			)
		}
		
		return(
		<TouchableOpacity onPress = {() => this.loadPlate(this.props.item)}>
			<View style={styles.container}>
				<Text>{this.props.item.name}</Text>
			</View>
			<View style={styles.itemStyle}>
				{renderImages}
			</View>
		</TouchableOpacity>
		);
	}
	
	alertItemName = (item) => {
		
	};	
	
   determineGroup = (input) => {
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

export default class SavedPlatesScreen extends React.Component {
  static navigationOptions = {
    title: 'Saved Plates',
  };
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
			<View style = {styles.scrollStyle}>
				<FlatList
					data={global.savedPlates}
					renderItem={({item, index})=>{
						return(
							<FlatListItem flatListParent={this} item={item} index={index}>
							</FlatListItem>
						);
					}}
				>
				</FlatList>
			</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
	flex: 1
},
image: {
	width: 50,
	height: 50,
	margin: 4,
},
itemStyle: {
	flex: 1,  
	flexDirection: 'row',
	padding: 8,
	marginTop: 3,
	alignItems: 'flex-start',
	backgroundColor: '#c1c1c1',
	justifyContent: 'flex-start',
},
  
});