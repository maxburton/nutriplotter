import React from 'react';
import { Text, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

export default class SideItem extends React.Component {

state = {
	isDown: false,
}
constructor(props){
	super(props);
}

componentDidMount(){
	this.setState({isDown: this.props.isDown})
}
render() {
	var sideImages = {
		fruit:require('../assets/images/appleSide.png'),
		dairy:require('../assets/images/yoghurtSide.png'),
		bread:require('../assets/images/breadSide.png'),
		drink:require('../assets/images/drinkSide.png')
	}
    return(
	
		<TouchableOpacity>
		<View style={this.state.isDown ? styles.bottom : styles.top}>
			<ImageBackground
				style={styles.image}
				source={sideImages[this.props.type]}>
				<View style={styles.textView}>
					<Text style={styles.text}>+</Text>
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