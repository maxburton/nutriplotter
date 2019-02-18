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
  Dimensions,
  measure
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import getStyleSheet from '../themes/style';

import Food from '../components/Food';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Play with Your Food',
  };
  
  constructor(props) {
    // Window is the draw space available for the app (does not include Android notification bar)
    //this.state.window = {
    //  height: Dimensions.get('window').height,
    //  width: Dimensions.get('window').width
    //};

    super(props);
    this.state = {
      darkTheme: false,
    };
    this.toggleTheme = this.toggleTheme.bind(this);
    
    // When creating the homescreen, create a reference to the plate to be rendered
    // so that we may be able to call methods on the plate and manipulate its state from other components
    // on the screen. 
    this.plate = new Plate({styles: getStyleSheet(this.state.darkTheme)});
  }


  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme})
  };

  //state = { }
  render() {
    const styles = getStyleSheet(this.state.darkTheme);

    var food = new Food({name: "Foo", plate: this.plate});

    return (
      
      <KeyboardAvoidingView style={styles.container} behavior="position" contentContainerStyle={styles.container}>
	      
        {food.render()}
        <View style={styles.list}>
          <TouchableOpacity style={styles.list} 
            onPress={
              // Pass a reference to the plate so we can edit its state in the EditFoodScreen
              () => this.props.navigation.navigate('EditFoodScreen', {plate: this.plate})
            }>
			      {this.plate.render()}
		      </TouchableOpacity>
		    </View>
	      <Text style={styles.title}>Enter a food:</Text> 
		    <View style={styles.list}>
			    <List style={styles.list}/>
		    </View>
        
      </KeyboardAvoidingView>
	  );
  };
};