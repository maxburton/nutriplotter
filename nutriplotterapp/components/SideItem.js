/*
	Renders a side item that displays around the plate in Homescreen. These are toggleable buttons that add specific food items to the outside of your plate.
	Current items: Apple, yoghurt, slide of bread, soda
	Room for growth: Implement modals on press and provide a checklist of items to be added to the side of plate.
*/
import React from 'react';
import { Text, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

var Datastore = require('react-native-local-mongodb'), 
sideItemsdb = new Datastore({ filename: 'sideItems', autoload: true });

export default class SideItem extends React.Component {

state = {
	isDown: false,
	isPressed: false,
	type: this.props.type,
}
constructor(props){
	super(props);
}

componentDidMount(){
	this.setState({isDown: this.props.isDown})
	for(let i = 0; i < global.sideItems.length; i++){
		if(global.sideItems[i].type == this.state.type){
			this.setState({isPressed: global.sideItems[i].isIn});
		}
	}
}

sideItemPressed(){
	for(let i = 0; i < global.sideItems.length; i++){
		if(global.sideItems[i].type == this.state.type){
			global.sideItems[i]["isIn"] = !global.sideItems[i].isIn;
			//console.log(global.sideItems);
		}
	}
	sideItemsdb.update({ type: this.state.type }, { $set: { isIn: !this.state.isPressed } }, function (err, numReplaced) {
		console.log(numReplaced);
	});
	let newBool = !this.state.isPressed;
	this.setState({isPressed: newBool});
	
}

render() {
	var sideImages = {
		fruit:require('../assets/images/appleSide.png'),
		dairy:require('../assets/images/yoghurtSide.png'),
		bread:require('../assets/images/breadSide.png'),
		drink:require('../assets/images/drinkSide.png'),
		fruitGrey:require('../assets/images/appleSideGrey.png'),
		dairyGrey:require('../assets/images/yoghurtSideGrey.png'),
		breadGrey:require('../assets/images/breadSideGrey.png'),
		drinkGrey:require('../assets/images/drinkSideGrey.png')
	}
    return(
	
		<TouchableOpacity onPress={() => this.sideItemPressed()}>
		<View style={this.state.isDown ? styles.bottom : styles.top}>
			<ImageBackground
				style={styles.image}
				source={this.state.isPressed ? sideImages[this.props.type] : sideImages[this.props.type + "Grey"]}>
				<View style={styles.textView}>
					<Text style={styles.text}></Text>
				</View>
			</ImageBackground>
		</View>
		</TouchableOpacity>
		
	)
  }
}

const styles = StyleSheet.create ({
	image: {
		flex: 1,
		width: 64,
		height: 64,
		margin: 5,
		zIndex: 10,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
  },
	textView: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 11,
	},
	text: {
		fontSize: 24,
	},
	bottom: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		flexDirection: "column",
	},
	top: {
		flex: 1
	},
	modal: {
		flex: 1,
	},
});