/*
	Displays the user's final score, along with hints on how to improve next time. Also provides buttons to save their plate, edit their plate or make a brand new plate
*/

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
  KeyboardAvoidingView,
} from 'react-native';
import { WebBrowser } from 'expo';
import DialogInput from 'react-native-dialog-input';

import { MonoText } from '../components/StyledText';
var Datastore = require('react-native-local-mongodb');
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

export default class ScoreScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    //header: null,
	title: 'Score',
	headerLeft: <Button title='Back' onPress={() => {navigation.navigate('Home', {plate: this.plate})}} />,
  });
  
  displayDialog(){
	  this.setState({isDialogVisible: true});
  }
  
  savePlate = (plateName, plate, score) => {
	  if(!this.state.plateSaved){
		  this.setState({plateSaved: true});
		  global.savedPlates.push({plateName: plateName, plate: plate, score: score, sideItems: global.sideItems});
		  savedPlatesdb.insert({plateName: plateName, plate: plate, score: score, sideItems: global.sideItems}, function (err, newDoc) {
			  Alert.alert("Plate Saved");
			  console.log("Saved Plates: " + global.savedPlates[0]["plate"]);
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
	  platedb.remove({}, { multi: true }, function (err, numRemoved) {
		  global.tweaks = 0;
		  global.plate = [];
		  this.goHome();
	  });
	  goHome = () => {
		  this.props.navigation.navigate("Home");
	  }
  }
  
  componentDidMount(){
	  this.setState({plateSaved: false});
  }
  
  state = {plateSaved: false, isDialogVisible: false}
  
  render() {
	
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}	
	
	const {navigation} = this.props;
	const plate = navigation.getParam('plate', new Array());
	const tweaks = navigation.getParam('tweaks', 0);
	const score = navigation.getParam('score', 0);
	const warnings = navigation.getParam('warnings', new Array());
	let renderWarnings = new Array();
	let newline = "\n\n";
	for(let i = 0; i < warnings.length; i++){
		let nutrient = warnings[i][0];
		nutrient = capitalizeFirstLetter(nutrient);
		let operator = warnings[i][1];
		let advice = "";
		if(operator == "perfect"){
			renderWarnings.unshift(
				<Text style={styles.textGreen}>Your {nutrient} levels are perfect! Well done!</Text>
			)
		}else{
			if(operator == "-"){
				advice = "levels are dangerously low! Try increasing it for a higher score";
			}else{
				advice = "levels are dangerously high! Try decreasing it for a higher score";
			}
			renderWarnings.push(
				<Text style={styles.textRed}>Your {nutrient} {advice}</Text>
			)
		}
	}
    return (
	<KeyboardAvoidingView
	style={styles.container}
        behavior="position"
        contentContainerStyle={styles.container}
    >
      <ScrollView style={styles.container}>
	  <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Name Your Plate"}
            hintInput ={"Plate name"}
            submitInput={ (inputText) => {this.savePlate(inputText, plate, score)} }
            closeDialog={ () => {this.setState({isDialogVisible: false})}}>
	  </DialogInput>
	    <Text style={styles.score}>You Scored: {score}/13000 points!{newline}</Text> 
		<Text style={styles.text}>You made {tweaks} adjustment(s) to your plate</Text>
		{renderWarnings}
		<TouchableOpacity style={styles.container} onPress={() => this.displayDialog()}>
          <Text style={styles.buttonText}>{newline}Save Plate</Text>
        </TouchableOpacity>
		<TouchableOpacity style={styles.container} onPress={() => this.tweakPlate()}>
          <Text style={styles.buttonText}>Tweak Your Plate</Text>
        </TouchableOpacity>
		<TouchableOpacity style={styles.container} onPress={() => this.newPlate()}>
          <Text style={styles.buttonText}>Make A New Plate</Text>
        </TouchableOpacity>
      </ScrollView>
	 </KeyboardAvoidingView>
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
  textGreen: {
	flex: 1,
    marginTop: offset,
    fontSize: offset,
	textAlign: "center",
	marginLeft: offset,
	marginRight: offset,
	color: "green",
  },
  textRed: {
	flex: 1,
    marginTop: offset,
    fontSize: offset,
	textAlign: "center",
	marginLeft: offset,
	marginRight: offset,
	color: "red",
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
