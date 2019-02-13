import React, { Component } from 'react'
import {
  Switch,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { WebBrowser, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class FoodStatsScreen extends Component{
  static navigationOptions = {
    title: "Results",
  };
  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }
  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme})
  };


  var dbQuery = "select name, amount from plate";;
  var promise = new Promise(function (resolve, reject) {
    db.transaction(function (transaction) {
      transaction.executeSql(dbQuery, [], function (transaction, result) {
        resolve(JSON.stringify(result)); // here the returned Promise is resolved
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
    var length = dbOut.rows.length;
    //var numStats = dbOut.columns.length;
    var points = 1000;
    var temp = 0;
    for (i = 0; i < length; i++) {
      //calories
      temp = dbOut.rows._array[i].calories;
      if(temp > 880 || temp < 720) {
        points = points - (800 - temp)**2;
      }






    }
  });

  render(
    return (
      <View>
        <Text> points </Text>
      </View>
    )
  )


}
