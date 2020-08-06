/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

import * as React from 'react';
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	Switch
} from 'react-native';
import styles from "../themes/settingsScreenStyles";

var Datastore = require("react-native-local-mongodb"),
	savedPlatesdb = new Datastore({ filename: "savedPlates", autoload: true });
favdb = new Datastore({ filename: 'favourites', autoload: true });
settingsdb = new Datastore({ filename: 'settings', autoload: true });

export default class SettingsScreen extends React.Component {
	static navigationOptions = () => ({
		title: "Settings",
		headerStyle: {backgroundColor: global.colorTheme.navHeader.backgroundColor},
		headerTintColor: global.colorTheme.navHeader.color
	});

	constructor(props) {
		super(props);
		this.state = {
			darkMode: global.settings.darkMode,
		};
	}

	saveSettings = () => {
		for (key in global.settings) {
			settingsdb.update(
				{ _id: key },
				{ $set: { value: global.settings[key] } }, function (err, numReplaced) {
					console.log("Num of settings updated: " + numReplaced);
				});
		}
	}

	deleteSavedPlates = () => {
		Alert.alert(
			'Delete Saved Plates',
			'Are you sure you want to delete all saved plates?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						savedPlatesdb.remove({}, { multi: true }, function (err, numRemoved) {
							deletePlate();
						});
					}
				},
			],
			{ cancelable: false }
		)
		deletePlate = () => {
			global.savedPlates = []
		}
	}

	deleteFavs = () => {
		Alert.alert(
			'Delete Search History',
			'Are you sure you want to delete your search history?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'OK', onPress: () => {
						favdb.remove({}, { multi: true }, function (err, numRemoved) {
							deleteFavs();
						});
					}
				},
			],
			{ cancelable: false }
		)
		deleteFavs = () => {
			global.favourites = []
		}
	}

	toggleDarkMode = () => {
		let newSetting = !global.settings["darkMode"];
		global.settings["darkMode"] = newSetting;
		if(global.settings.darkMode){
			global.colorTheme = global.darkTheme;
		  }else{
			global.colorTheme = global.lightTheme;
		  }
		this.setState({ darkMode: newSetting });
		this.saveSettings();
		
		//refresh header
		this.props.navigation.setParams({});
		console.log("Dark mode is now: " + newSetting);
	}

	render() {

		let buttonTextStyle = [global.styles.buttonText, global.colorTheme.buttonTextColor];
		let labelTextStyle = [global.styles.textLeft, global.styles.textBig, global.styles.marginFromLeft, global.styles.flex1, global.colorTheme.textColor];
		let buttonStyle = [global.styles.button, global.colorTheme.buttonBgColor];

		return (
			<View style={[global.styles.flex1, global.colorTheme.bgColor]}>
				<ScrollView style={global.styles.paddingFromTop}>
					<View style={[global.styles.flexRow, global.styles.flexCenter]}>
						<Text style={[labelTextStyle]}>Dark Mode </Text>
						<View style={[global.styles.flex1, global.styles.flexRow, global.styles.flexEnd, global.styles.marginFromRight]}>
							<Switch
								onValueChange={() => this.toggleDarkMode()}
								value={this.state.darkMode}
							/>
						</View>
					</View>
					<View style={global.styles.marginFromTop}>
						<TouchableOpacity style={buttonStyle} onPress={() => this.deleteSavedPlates()}>
							<Text style={buttonTextStyle}>Delete Saved Plates</Text>
						</TouchableOpacity>
						<TouchableOpacity style={buttonStyle} onPress={() => this.deleteFavs()}>
							<Text style={buttonTextStyle}>Delete Search History</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<View style={styles.bottomContainer}>
					<Text style={[global.styles.textCenter, global.colorTheme.textColor]}>Food Icons Courtesy of www.flaticon.com</Text>
				</View>
			</View>
		);
	}
}

