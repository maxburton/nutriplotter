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

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    //header: null,
	title: 'User Stats',
  };
  
  state = { name: '' }
  onChangeText = name => this.setState({ name });
  render() {
    return (
      <View>
	    <Image source={require('../assets/images/plate.png')}/>
	    <Text style={styles.title}>Enter a food:</Text> 
        <TextInput
		  onChangeText={this.onChangeText}
          style={styles.nameInput}
          placeHolder="Enter a food"
          value={this.state.name}
        />
		<TouchableOpacity onPress={this.onPress}>
          <Text style={styles.buttonText}>Search</Text>
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
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
});
