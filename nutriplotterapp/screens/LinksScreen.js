/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

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

  _handleOpenWithWebBrowser = (link) => {
    WebBrowser.openBrowserAsync(link);
  }

  _prevPage = () => {
      if(this.state.pageNum != 0)
        this.setState({pageNum: this.state.pageNum-1})
  }
  _nextPage = () => {
      if(this.state.pageNum != 3)
        this.setState({pageNum: this.state.pageNum+1})
  }


  render(){

    //add Food
    const addArr = ["The aim of the game is to build a nutritionally balanced meal. Use the search bar to find the foods you want to add.",
    "A number of common foods are kept around the edge plate, these are: an apple, a slice of bread, an yoghurt and a can of soda.",
    "Foods on your plate will be yellow in the search bar or coloured on the screen."];
    //set size
    const setArr = ["After adding the foods you want, you have to decide on the proportions of these foods. To do this tap the plate and use the sliders or buttons to get your foods to the right amounts.",
    "The foods are all measured in % of the plate, so you won't be able to go over 100%.",
    "When you have finished your meal, submit to see the nutritional data."];
    //results
    const resArr = ["You may edit your plate by pressing tweak after submitting but it will cost you 250 points off your score each time.",
    "Then press submit again to see your score and what areas you can improve on for your meal.",
    "You can also save the plate so that you can re-use it another time. Or just reset to a blank plate and start again"];
    //tips
    const tipArr = ["a",
    "a",
    "a"];
	
	let links = (
	<View>
		<Text style={styles.defaultText}>Helpful Links:</Text>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/live-well/eat-well")} title={"Tips for Balanced Meals - NHS"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.choosemyplate.gov/ten-tips-build-healthy-meal")} title={"Tips for Balanced Meals - ChooseMyPlate"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/conditions/vitamins-and-minerals/")} title={"Vitamins and Minerals Tips"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/live-well/eat-well/how-does-sugar-in-our-diet-affect-our-health/")} title={"Sugar Tips"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/common-health-questions/food-and-diet/what-should-my-daily-intake-of-calories-be/")} title={"Calorie Tips"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/live-well/healthy-weight/why-we-need-to-eat-carbs/")} title={"Carbs Tips"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/live-well/eat-well/different-fats-nutrition/")} title={"Fats Tips"}/>
		<Button onPress={()=>this._handleOpenWithWebBrowser("https://www.nhs.uk/live-well/eat-well/the-eatwell-guide/")} title={"Food Group Tips"}/>
	</View>
	)
	
	let navButtons = (
	<View style={styles.navContainer}>
		<Button style={styles.button} onPress={()=>this._nextPage()} title={"Next"}/ >
		<Button onPress={()=>this._prevPage()} title={"Previous"}/>
	</View>
	)

    if (this.state.pageNum == 0){
      var i = addArr;
    } else if (this.state.pageNum == 1) {
      var i = setArr;
    } else if (this.state.pageNum == 2) {
      var i = resArr;
    }
	
	if (this.state.pageNum == 3){
		
		return(
		  <View style={styles.container}>
		    {links}
			{navButtons}
		  </View>
    );
		
	}else{

    return(

      <View style={styles.container}>
        <HelpText text={i[0]} />
        <HelpText text={i[1]} />
        <HelpText text={i[2]} />

		{navButtons}
      </View>
    );
	}
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
  container: {
	flex: 1,
  },
  defaultText: {
    fontSize: 24,
    padding: 15,
	textAlign: 'center',
  },
  button: {
	flex: 1,
	padding: 15,
  },
  navContainer: {
	flex: 1,
	justifyContent: "flex-end",
  }
});
