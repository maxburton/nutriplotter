import React from 'react';
import List from '../components/FoodList.js'
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
	    <Image style={styles.image} source={require('../assets/images/plate.png')}/>
	    <Text style={styles.title}>Enter a food:</Text> 
		<View style={styles.list}>
			<List style={styles.list}/>
		</View>
      </KeyboardAvoidingView>
	  );
  };
  
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
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    resizeMode: 'contain'
  },
});
