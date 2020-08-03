/*
	Tells the user how to play the game, as well as providing a link to choosemyplate.gov
*/

import * as React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
	Switch
} from 'react-native';

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
		return (
			<View style={styles.container}>
				<View style={styles.container}>
					<TouchableOpacity style={styles.button} onPress={() => this.deleteSavedPlates()}>
						<Text style={styles.text}>Delete Saved Plates</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => this.deleteFavs()}>
						<Text style={styles.text}>Delete Search History</Text>
					</TouchableOpacity>
					<View style={styles.container}>
						<Text style={styles.text}>Dark Mode </Text>
						<Switch
							onValueChange={() => this.toggleDarkMode()}
							value={this.state.darkMode}
						/>
					</View>
				</View>
				<View style={styles.bottomContainer}>
					<Text style={styles.iconText}>Food Icons Courtesy of www.flaticon.com</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bottomContainer: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 5,
	},
	text: {
		fontSize: 24,
		textAlign: 'center',
		color: "red",
	},
	iconText: {
		textAlign: 'center',
	},
	button: {
		flex: 1,
		marginTop: 15,
		justifyContent: "center",
		alignItems: "center",
	}
});
