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
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class ScoreScreen extends React.Component {
  static navigationOptions = {
    //header: null,
	title: 'Score',
  };
  
  savePlate(){
	  global.savedPlates.push(this.state.plate);
  }
  
  state = {}
  
  render() {
	const {navigation} = this.props;
	const plate = navigation.getParam('plate', new Array());
	const tweaks = navigation.getParam('tweaks', 0);
	const score = navigation.getParam('score', 0);
	const warnings = navigation.getParam('warnings', new Array());
    return (
      <View>
	    <Text style={styles.title}>You Scored: {score} points!</Text> 
		<TouchableOpacity onPress={this.savePlate()}>
          <Text style={styles.buttonText}>Save Plate</Text>
        </TouchableOpacity>
      </View>
	  );
  };
  
  
};

const offset = 24;
const styles = StyleSheet.create({
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
	justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
});
