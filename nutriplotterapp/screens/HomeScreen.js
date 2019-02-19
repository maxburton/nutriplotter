import React from "react";
import List from "../components/FoodList.js";
import Plate from "../components/Plate.js";
import firebase from "../components/Firebase.js";

//Initliase firebase database
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
import Modal from "react-native-modal";
import { WebBrowser, SQLite } from 'expo';
const db = SQLite.openDatabase('db.db');

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
      isModalVisible: false,
      darkTheme: false,
    };
    this.toggleTheme = this.toggleTheme.bind(this);
    
    // When creating the homescreen, create a reference to the plate to be rendered
    // so that we may be able to call methods on the plate and manipulate its state from other components
    // on the screen. 
    this.plate = new Plate({styles: getStyleSheet(this.state.darkTheme)});
  }

  // ************* NEEDS A 'SUBMIT' BUTTON TO WORK, CURRENTLY NOT ONE *************
  updateScore = async (name, score) => {
    //get scores as dict
    firebase
      .database()
      .ref("scores/")
      .on("value", function(snapshot) {
        var returnArr = [];
        global.orgDict = {};
        currentscore = 0;

        snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;

          returnArr.push(item);
        });

        for (var i = 0; i < returnArr.length; i++) {
          orgDict[returnArr[i]["key"]] = returnArr[i]["userscore"];
        }
      });

    //get currentscore and add this score
    currentscore = orgDict[name];
    newscore = currentscore + score;

    //update userscore in db
    firebase
      .database()
      .ref("scores/" + name)
      .update({
        userscore: newscore
      });
  };

  toggleTheme() {
    this.setState({ darkTheme: !this.state.darkTheme });

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
    const styles = getStyleSheet(this.state.darkTheme);

    var food = new Food({name: "Foo", plate: this.plate});
	var food2 = new Food({name: "Foo2", plate: this.plate});
	var food3 = new Food({name: "Foo3", plate: this.plate});

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
    //const styles = getStyleSheet(this.state.darkTheme);
    //const backgroundColor = StyleSheet.flatten(styles.container).backgroundColor;
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


            {/**view start**/}
            <Modal
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => this.setState({ isModalVisible: false })}
              stlye = {styles.model}
              >
              {/**Model Block**/}
              <View style ={styles.modelContainer}>


                <View style={{flex: 2, flexDirection: 'row', width: width, justifyContent:'space-between'}}>
                  {/**Nutrition names Column**/}
                  <View style={ styles.modelColumn }>
                    <View style={styles.childStyle}>
                      <Text> Calories </Text>
                    </View>
                    <View style={styles.childStyle}>
                      <Text> Protein </Text>
                    </View>
                  </View>

                  {/**middle Line**/}
                  <View style={{ width: 1, height: 350, backgroundColor: 'black' }}/>

                  {/**Nutritional values column**/}
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
const {width, height} = require('Dimensions').get('window');
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

  },
  childStyle: {
      fontSize: 72,
      color: 'red',
  },
  modelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height-(offset*3),
    backgroundColor: 'white',
  },
  modelColumn: {
    flex: 5,
    flexDirection: 'column',
    marginLeft: offset*3

  }
});
