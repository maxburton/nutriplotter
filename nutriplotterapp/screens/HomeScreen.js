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
import Modal from "react-native-modal";
import { WebBrowser, SQLite } from 'expo';
const db = SQLite.openDatabase('db.db');

import { MonoText } from '../components/StyledText';

import getStyleSheet from '../themes/style';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    //header: null,
	title: 'Build A Plate',
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      darkTheme: false,
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  _toggleModal(){
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme})
  };

  _getPlateContents(){
    var dbQuery = 'select name, amount from plate;';
    var promise = new Promise(function (resolve, reject) {
      db.transaction(function (transaction) {
        transaction.executeSql(dbQuery, [], function (transaction, result) {
          resolve(JSON.stringify(result));
        }, nullHandler, errorHandler);
      });
    });

    function nullHandler(result){
      console.log("Null Log : " + JSON.stringify(result));
    }

    function errorHandler(error){
      console.log("Error Log : " + error);
    }

    promise.then((results) => {
      var dbOut = JSON.parse(results);
		  return 0;
    })
  }


  _resultsClick(){
    /**check plate size**/
    /**var contents = this._getPlateContents();**/
    var contents = 1
    if (contents == 0) {
      alert("Try adding some food first!");
    } else {
      /**display results**/
      this._toggleModal();

    }


  }

  //state = { }
  render() {
    //const styles = getStyleSheet(this.state.darkTheme);
    //const backgroundColor = StyleSheet.flatten(styles.container).backgroundColor;
    const {width, height} = require('Dimensions').get('window');
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

          <View>
            <TouchableOpacity onPress={() => this._resultsClick()} >
              <Text style={styles.title}>Submit</Text>
            </TouchableOpacity>
          </View>



            <Modal
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => this.setState({ isModalVisible: false })}
              stlye = {styles.model}
              >
              <View style ={styles.modelContainer}>

                <View style={{flex: 2, flexDirection: 'row', width: width, justifyContent:'space-between'}}>

                  <View style={ styles.modelColumn }>
                    <View style={styles.childStyle}>
                      <Text> Calories </Text>
                    </View>
                    <View style={styles.childStyle}>
                      <Text> Protein </Text>
                    </View>
                  </View>

                  <View style={{flex: 1, width: 1, height: 550, backgroundColor: 'black'}}>
                  </View>

                  <View style={ styles.modelColumn }>
                    <View style={styles.childStyle}>
                      <Text> 2000 </Text>
                    </View>
                    <View style={styles.childStyle}>
                      <Text> 82 </Text>
                    </View>
                  </View>

                </View>

              </View>
            </Modal>

        </KeyboardAvoidingView>
	  );
  };

};





const offset = 24;
const styles = StyleSheet.create({
  container: {
    flex:1,
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
  model: {
    backgroundColor: "orange",
    margin: 0,
  },
  childStyle: {
      fontSize: 72,
      color: 'red',
  },
  modelContainer: {
    borderColor: "orange",
    justifyContent: 'center',
    alignItems: 'center',
    height: 550,
    backgroundColor: 'powderblue',
  },
  modelColumn: {
    flex: 5,
    flexDirection: 'column',
    marginLeft: offset*3

  }
});
