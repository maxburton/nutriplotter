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
import styleMap from "../themes/globalStyles";
import styles from "../themes/settingsScreenStyles";

var Datastore = require("react-native-local-mongodb"),
	savedPlatesdb = new Datastore({ filename: "savedPlates", autoload: true });
favdb = new Datastore({ filename: 'favourites', autoload: true });
settingsdb = new Datastore({ filename: 'settings', autoload: true });

export default class SettingsScreen extends React.Component {
	static navigationOptions = {
		title: "Settings",
	};

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
					console.log("Setting updated:" + numReplaced);
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
		this.setState({ darkMode: newSetting });
		this.saveSettings();
		console.log("Dark mode toggled: " + newSetting);
	}

	render() {
		// global styles
		let globalStyles = styleMap.global;

		// use dark or light mode
		let colorTheme = null;
		if (global.settings.darkMode) {
			colorTheme = styleMap.darkMode;
		} else {
			colorTheme = styleMap.lightMode;
		}

		let buttonTextStyle = [globalStyles.buttonText, colorTheme.buttonTextColor];
		let labelTextStyle = [globalStyles.textLeft, globalStyles.textBig, globalStyles.marginFromLeft, globalStyles.flex1, colorTheme.textColor];
		let buttonStyle = [globalStyles.button, colorTheme.buttonBgColor];

		return (
			<View style={[globalStyles.flex1, colorTheme.bgColor]}>
				<ScrollView style={globalStyles.paddingFromTop}>
					<View style={[globalStyles.flexRow, globalStyles.flexCenter]}>
						<Text style={[labelTextStyle]}>Dark Mode </Text>
						<View style={[globalStyles.flex1, globalStyles.flexRow, globalStyles.flexEnd, globalStyles.marginFromRight]}>
							<Switch
								onValueChange={() => this.toggleDarkMode()}
								value={this.state.darkMode}
							/>
						</View>
					</View>
					<View style={globalStyles.marginFromTop}>
						<TouchableOpacity style={buttonStyle} onPress={() => this.deleteSavedPlates()}>
							<Text style={buttonTextStyle}>Delete Saved Plates</Text>
						</TouchableOpacity>
						<TouchableOpacity style={buttonStyle} onPress={() => this.deleteFavs()}>
							<Text style={buttonTextStyle}>Delete Search History</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<View style={styles.bottomContainer}>
					<Text style={[globalStyles.textCenter, colorTheme.textColor]}>Food Icons Courtesy of www.flaticon.com</Text>
				</View>
			</View>
		);
	}
}

