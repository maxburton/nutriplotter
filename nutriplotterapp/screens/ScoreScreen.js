/*
	Displays the user's final score, along with hints on how to improve next time. Also provides buttons to save their plate, edit their plate or make a brand new plate
*/

import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	Alert,
} from 'react-native';
import DialogInput from 'react-native-dialog-input';

var Datastore = require('react-native-local-mongodb');
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

export default class ScoreScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		//header: null,
		title: 'Score',
		headerLeft: <Button title='Back' onPress={() => { navigation.navigate('Home', { plate: this.plate }) }} />,
	});

	displayDialog() {
		this.setState({ isDialogVisible: true });
	}

	savePlate = (plateName, plate, score) => {
		this.setState({ isDialogVisible: false });
		if (!this.state.plateSaved) {
			this.setState({ plateSaved: true });
			global.savedPlates.push({ plateName: plateName, plate: plate, score: score });
			savedPlatesdb.insert({ plateName: plateName, plate: plate, score: score }, function (err, newDoc) {
				Alert.alert("Plate Saved");
				console.log("Saved Plates: " + global.savedPlates[0]["plate"]);
			});
		} else {
			Alert.alert("You've already saved this plate!");
		}
	}

	tweakPlate = () => {
		global.tweaks++;
		this.props.navigation.navigate("Home");
	}

	newPlate = () => {
		platedb.remove({}, { multi: true }, function (err, numRemoved) {
			global.tweaks = 0;
			global.plate = [];
			this.goHome();
		});
		goHome = () => {
			this.props.navigation.navigate("Home");
		}
	}

	componentDidMount() {
		this.setState({ plateSaved: false });
	}

	state = { plateSaved: false, isDialogVisible: false }

	render() {

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		const { navigation } = this.props;
		const plate = navigation.getParam('plate', new Array());
		const tweaks = navigation.getParam('tweaks', 0);
		const score = navigation.getParam('score', 0);
		const warnings = navigation.getParam('warnings', new Array());

		let nutrientNames = new Array();
		let renderWarnings = new Array();
		let nutrientScores = new Array();
		let newline = "\n\n";

		for (let i = 0; i < warnings.length; i++) {
			let nutrient = warnings[i][0];
			nutrient = capitalizeFirstLetter(nutrient);
			nutrientNames.push(
				<Text style={styles.textNames}>{nutrient}:</Text>
			)
			let percentage = warnings[i][2]
			nutrientScores.push(
				<Text style={styles.textScores}>{percentage}%</Text>
			)

			let operator = warnings[i][1];
			let advice = "";
			if (operator == "perfect") {
				// Use renderWarnings.unshift to put new item at the beginning of the array
				renderWarnings.push(
					<Text style={styles.textGreen}>Perfect! Well done!</Text>
				)
			} else if (operator == "ok") {
				renderWarnings.push(
					<Text style={styles.textGrey}>Not Bad!</Text>
				)
			} else {
				// If nutrient score is bad
				if (operator == "-") {
					advice = "Very low!";
				} else {
					advice = "Very high!";
				}
				renderWarnings.push(
					<Text style={styles.textRed}>{advice}</Text>
				)
			}
		}
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
					<DialogInput isDialogVisible={this.state.isDialogVisible}
						title={"Name Your Plate"}
						hintInput={"Plate name"}
						submitInput={(inputText) => { this.savePlate(inputText, plate, score) }}
						closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
					</DialogInput>
					<Text style={score < 4333 ? styles.scoreRed : score < 8666 ? styles.scoreAmber : styles.scoreGreen}>You Scored: {score}/13000 points!{newline}</Text>
					<Text style={styles.textAdjustments}>You made {tweaks} adjustment(s) to your plate, and your score has been reduced by {tweaks * global.tweakPenalty} points.</Text>
					<View style={styles.row}>
						<View style={styles.columnNames}>
							{nutrientNames}
						</View>
						<View style={styles.columnAdvice}>
							{renderWarnings}
						</View>
						<View style={styles.columnScore}>
							{nutrientScores}
						</View>
					</View>
					<TouchableOpacity style={styles.container} onPress={() => this.displayDialog()}>
						<Text style={styles.buttonText}>{newline}Save Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.container} onPress={() => this.tweakPlate()}>
						<Text style={styles.buttonText}>Tweak Your Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.container} onPress={() => this.newPlate()}>
						<Text style={styles.buttonText}>Make A New Plate</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	};


};

const offset = 16;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	columnNames: {
		flex: 3,
		flexDirection: 'column'
	},
	columnAdvice: {
		flex: 5,
		flexDirection: 'column'
	},
	columnScore: {
		flex: 3,
		flexDirection: 'column'
	},
	scoreRed: {
		marginTop: offset,
		flex: 1,
		fontSize: 24,
		textAlign: "center",
		color: "red"
	},
	scoreAmber: {
		marginTop: offset,
		flex: 1,
		fontSize: 24,
		textAlign: "center",
		color: "#f4b342",
	},
	scoreGreen: {
		marginTop: offset,
		flex: 1,
		fontSize: 24,
		textAlign: "center",
		color: "green",
	},
	textAdjustments: {
		flex: 1,
		marginTop: offset,
		marginBottom: offset,
		fontSize: offset,
		textAlign: "center",
		marginLeft: offset,
		marginRight: offset,
	},
	textNames: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "left",
		marginLeft: offset,
		marginRight: offset,
	},
	textScores: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "right",
		marginLeft: offset,
		marginRight: offset,
	},
	text: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "center",
		marginLeft: offset,
		marginRight: offset,
	},
	textGreen: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "left",
		color: "green",
	},
	textRed: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "left",
		color: "red",
	},
	textGrey: {
		flex: 1,
		marginTop: offset,
		fontSize: offset,
		textAlign: "left",
		color: "gray",
	},
	buttonText: {
		flex: 1,
		marginTop: "5%",
		fontSize: 24,
		marginBottom: "5%",
		color: "blue",
		textAlign: "center",
	},
});
