import React, { Component } from 'react'
import { Text, ScrollView, TouchableOpacity, StyleSheet, View, TextInput, Image, Alert } from 'react-native'
import { WebBrowser, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

class SubmitButton extends Component {
  constructor(props) {
    super(props)
  }
  onSubmitClick = () => {
    console.log("Submitting");
    var dbQuery = 'select name, amount from plate;';
    var promise = new Promise(function (resolve, reject) {
      db.transaction(function (transaction) {
        transaction.executeSql(dbQuery, [], function (transaction, result) {
          resolve(JSON.stringify(result)); // here the returned Promise is resolved
        }, nullHandler, errorHandler);
      });
    });

    promise.then((results) => {
      var dbOut = JSON.parse(results);
      var length = dbOut.rows.length;
      if(length == 0){
        alert("Your plate is empty! Add some by searching below.");
      }else{
        alert("Ready to give stats and score")
        this.props.navigation.navigate('FoodStatsScreen')
      }
    });
  };


  function nullHandler(result){
    console.log("Null Log : " + JSON.stringify(result));
  }

  function errorHandler(error){
    console.log("Error Log : " + error);
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text> Submit Food </Text>
          </TouchableOpacity>
      </View>
    )
  }
};

  export default SubmitButton
