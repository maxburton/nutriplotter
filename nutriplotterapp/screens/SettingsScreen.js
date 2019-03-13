/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

import * as React from 'react';
import { Constants, WebBrowser } from 'expo';
import {Linking, Text, View, StyleSheet, Button, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { MonoText } from '../components/StyledText';

var Datastore = require("react-native-local-mongodb"),
  savedPlatesdb = new Datastore({ filename: "savedPlates", autoload: true });
  favdb = new Datastore({ filename: 'favourites', autoload: true });

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings",
  };

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false,
      pageNum: 0
    };
  }
  
  deleteSavedPlates = () =>{
	  global.savedPlates = []
	  savedPlatesdb.remove({}, { multi: true }, function (err, numRemoved) {
			Alert.alert("Saved Plates Deleted");
		});
  }
  
  deleteFavs = () =>{
	  global.favourites = []
	  favdb.remove({}, { multi: true }, function (err, numRemoved) {
			Alert.alert("Recently Searched Foods Deleted");
		});
  }

  render(){
	  return(
	  <View style={styles.container}>
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={()=>this.deleteSavedPlates()}>
				<Text style={styles.text}>Delete Saved Plates</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={()=>this.deleteFavs()}>
				<Text style={styles.text}>Delete Recently Searched Foods</Text>
			</TouchableOpacity>
		</View>
		<View style={styles.bottomContainer}>
		</View>
	</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
	  flex: 1,
  },
  bottomContainer: {
	  flex: 4,
  },
  text: {
    fontSize: 24,
	textAlign: 'center',
	color: "red",
  },
  button: {
	flex: 1,
	marginTop: 15,
	justifyContent: "center",
	alignItems: "center",
  }
});
