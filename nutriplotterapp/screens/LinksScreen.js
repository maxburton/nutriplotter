import * as React from 'react';
import { Constants, WebBrowser } from 'expo';
import {Linking, Text, View, StyleSheet, Button, ScrollView} from 'react-native';
import { MonoText } from '../components/StyledText';



export default class HelpScreen extends React.Component {
  static navigationOptions = {
    title: "How to Play",
  };

  constructor(props) {
    super(props);
    this.state = {
      darkTheme: false,
      pageNum: 0
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme})
  };

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync('https://www.choosemyplate.gov/ten-tips-build-healthy-meal');
  }

  _prevPage = () => {
      if(this.state.pageNum != 0)
        this.setState({pageNum: this.state.pageNum-1})
  }
  _nextPage = () => {
      if(this.state.pageNum != 2)
        this.setState({pageNum: this.state.pageNum+1})
  }


  render(){

    //add Food
    const addArr = ["The aim of the game is to build a nutritionally balanced meal. Use the search bar to find the foods you want to add.",
    "A number of common foods are kept around the edge plate, these are: an apple, a slice of bread, an ice-cream and a can of soda.",
    "Foods on your plate will be yellow in the search bar or coloured on the screen."];
    //set size
    const setArr = ["After adding the foods you want, you have to decide on the proportions of these foods. To do this tap the plate and use the sliders or buttons to get your foods to the right amounts.",
    "The foods are all measured in % of the plate, so you won't be able to go over 100.",
    "When you have finished your meal, submit to see the nutritional data."];
    //results
    const resArr = ["You may edit your plate by pressing tweak after submitting but it will cost you 500 points off your score each time.",
    "Then press submit again to see your score and what areas you can improve on for your meal.",
    "You can also save the plate so that you can re-use it another time. Or just reset to a blank plate and start again"];
    //tips
    const tipArr = ["a",
    "a",
    "a"];

    if (this.state.pageNum == 0){
      var i = addArr;
    } else if (this.state.pageNum == 1) {
      var i = setArr;
    } else if (this.state.pageNum == 2) {
      var i = resArr;
    } else if (this.state.pageNum == 3) {
      var i = tipArr;
    }

    return(

      <View>

        <HelpText text={i[0]} />
        <HelpText text={i[1]} />
        <HelpText text={i[2]} />

        <Button style={{padding:15}} onPress={this._nextPage} title={"Next"}/ >
        <Button onPress={this._prevPage} title={"Previous"}/>
		    <Button onPress={this._handleOpenWithWebBrowser} title={"Tips for Balanced Meals"}/>


      </View>
    );
  }
}

class HelpText extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.defaultText}> {this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 24,
    padding: 15,
	  textAlign: 'center',
  },
});
