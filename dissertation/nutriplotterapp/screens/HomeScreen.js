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
  KeyboardAvoidingView,
} from 'react-native';
import { WebBrowser, SQLite } from 'expo';

import { MonoText } from '../components/StyledText';

const db = SQLite.openDatabase('db.db');

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    //header: null,
	title: 'Build A Plate',
  };
  
  state = { name: '' , test: '', }
  onChangeText = name => this.setState({ name });
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" contentContainerStyle={styles.container}>
	    <Image style={styles.image} source={require('../assets/images/plate.png')}/>
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
		<Text style={styles.checkDB}>{this.state.test}</Text>
    </KeyboardAvoidingView>
	  );
  };
  
  onPress = () => {
		var dbQuery = 'select * from foods where name="' + this.state.name.toLowerCase() + '";';
		var promise = new Promise(function (resolve, reject) {
			db.transaction(function (transaction) {
				transaction.executeSql(dbQuery, [], function (transaction, result) {
					resolve(JSON.stringify(result)); // here the returned Promise is resolved
				}, nullHandler, errorHandler);
			});
		});
		
		function nullHandler(result){
			console.log("Null Log : " + JSON.stringfy(result));
		}

		function errorHandler(error){
			console.log("Error Log : " + error);
		}
	  
		promise.then((results) => {
		    var dbOut = JSON.parse(results);
			console.log("results:");
			console.log(dbOut);
			console.log("length:");
			console.log(dbOut.rows.length);
			if(dbOut.rows.length > 0){
				this.setState({
				test: JSON.stringify(dbOut.rows._array[0]),
				})
			}else{
				this.setState({
				test: "Food Not Found",
				})
			}
	  });
  }
};

const offset = 24;
const styles = StyleSheet.create({
  container: {
    flex:1
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  checkDB: {
	  textAlign: 'center',
	  color: 'red',
  },
});
