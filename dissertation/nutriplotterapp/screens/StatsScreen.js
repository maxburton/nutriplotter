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
import styles from '../themes/statsScreenStyle';

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
  }
};