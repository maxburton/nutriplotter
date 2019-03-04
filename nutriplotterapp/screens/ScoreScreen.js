import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
var Datastore = require('react-native-local-mongodb');
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

export default class ScoreScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    //header: null,
	title: 'Score',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home', {plate: this.plate})}} />,
  });
  
  savePlate = (plate) => {
	  if(!this.state.plateSaved){
		  this.setState({plateSaved: true});
		  savedPlatesdb.insert(plate, function (err, newDoc) {
			  global.savedPlates.push(plate);
			  Alert.alert("Plate Saved");
			  console.log("Saved Plates: " + global.savedPlates);
		  });
	  }else{
		  Alert.alert("You've already saved this plate!");
	  }
  }
  
  tweakPlate = () => {
	  global.tweaks++;
	  this.props.navigation.navigate("Home");
  }
  
  newPlate = () => {
	  platedb.remove({}, function (err, numRemoved) {
		  global.tweaks = 0;
		  global.plate = new Array();
		  this.goHome();
	  });
	  goHome = () => {
		  this.props.navigation.navigate("Home");
	  }
  }
  
  componentDidMount(){
	  this.setState({plateSaved: false});
  }
  
  state = {plateSaved: false}
  
  render() {
	const {navigation} = this.props;
	const plate = navigation.getParam('plate', new Array());
	const tweaks = navigation.getParam('tweaks', 0);
	const score = navigation.getParam('score', 0);
	const warnings = navigation.getParam('warnings', new Array());
	let renderWarnings = new Array();
	let newline = "\n\n";
	for(let i = 0; i < warnings.length; i++){
		let nutrient = warnings[i][0];
		let operator = warnings[i][1];
		let advice = "";
		if(operator == "-"){
			advice = "levels are too low! Try increasing it for a higher score";
		}else{
			advice = "levels are too high! Try decreasing it for a higher score";
		}
		renderWarnings.push(
			<Text style={styles.text}>Your {nutrient} {advice}</Text>
		)
	}
    return (
      <ScrollView style={styles.container}>
	    <Text style={styles.score}>You Scored: {score} points!{newline}</Text> 
		<Text style={styles.text}>You made {tweaks} adjustment(s) to your plate</Text>
		{renderWarnings}
		<TouchableOpacity style={styles.container} onPress={() => this.savePlate(plate)}>
          <Text style={styles.buttonText}>{newline}Save Plate</Text>
        </TouchableOpacity>
		<TouchableOpacity style={styles.container} onPress={() => this.tweakPlate()}>
          <Text style={styles.buttonText}>Tweak Your Plate</Text>
        </TouchableOpacity>
		<TouchableOpacity style={styles.container} onPress={() => this.newPlate()}>
          <Text style={styles.buttonText}>Make A New Plate</Text>
        </TouchableOpacity>
      </ScrollView>
	  );
  };
  
  
};

const offset = 16;
const styles = StyleSheet.create({
  container: {
	flex: 1,
  },
  score: {
	marginTop: offset,
	flex: 1,
	fontSize: 24,
	textAlign: "center",
  },
  text: {
	flex: 1,
    marginTop: offset,
    fontSize: offset,
	textAlign: "center",
	marginLeft: offset,
	marginRight: offset,
  },
  buttonText: {
	flex: 1,
	marginTop: "5%",
    fontSize: 24,
	marginBottom: "5%",
	color: "blue",
	textAlign: "center",
  },
});
