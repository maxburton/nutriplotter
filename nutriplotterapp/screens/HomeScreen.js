import React from 'react';
import List from '../components/FoodList.js'
import Plate from '../components/Plate.js'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    //header: null,
	title: 'Build A Plate',
  };
  
  state = { }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" contentContainerStyle={styles.container}>
	    <View style={styles.list}>
		<TouchableOpacity style={styles.list} onPress={() => this.props.navigation.navigate('EditFoodScreen')}>
			<Plate style={styles.list}/>
		</TouchableOpacity>
		</View>
	    <Text style={styles.title}>Enter a food:</Text> 
		<View style={styles.list}>
			<List style={styles.list}/>
		</View>
      </KeyboardAvoidingView>
	  );
  };//
  

  
  
  
	/*
	<TouchableOpacity onPress={this.onPress}>
	  <Text style={styles.buttonText}>Add Food</Text>
	</TouchableOpacity>
	*/
  
};

const offset = 24;
const styles = StyleSheet.create({
  container: {
    flex:1
  },
  list: {
	flex:1
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset,
  },
  
});
