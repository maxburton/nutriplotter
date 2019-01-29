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
  
  state = {test: switch1State}
  render() {
    if (switch1State){
      style={flex:1, backgroundColor: '#191919'}
      backgroundColor='#4C4C4C'
      titleStyle={color: '#FFFFFF', marginTop: offset, marginLeft: offset, fontSize: offset}
      listStyle={color:'#FFFFFF'}
    } else {
      style={flex:1, backgroundColor: '#FFFFFF'}
      backgroundColor='#FFFFFF'
      titleStyle={color: '#000000', marginTop: offset, marginLeft: offset, fontSize: offset}
    }
    return (
      <KeyboardAvoidingView switch1State={switch1State} style={style} behavior="position" contentContainerStyle={styles.container}>
	    <View style={styles.list}>
			<Plate style={styles.list}/>
			<Button title="Go to Edit Food screen"
        onPress={() => this.props.navigation.navigate('EditFoodScreen')}
			/>
		</View>
	    <Text style={titleStyle}>Enter a food:</Text> 
		<View style={styles.list}>
			<List style={styles.list}/>
		</View>
    <Button title="Temp"
        onPress={() => this.setState({state: this.state})}//console.log('Switch 1 is: ' + switch1State)}
    />
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
