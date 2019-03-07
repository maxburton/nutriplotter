import React from 'react';
import { Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default class SideItem extends React.Component {

state = {
	x: 0,
	y: 0,
}
constructor(props){
	super(props);
}

componentDidMount(){
	this.setState({x: this.props.x, y: this.props.y})
}
render() {
    return(
		<TouchableOpacity>
			<ImageBackground
				alignContent={'center'}
				style={styles.image}
				source={require('../assets/images/apple.png')}>
				<Text style={styles.text}>+</Text>
			</ImageBackground>
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
  },
	text: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 11,
	},
	modal: {
		flex: 1,
	},
});