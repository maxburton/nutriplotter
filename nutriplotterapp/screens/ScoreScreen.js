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
import Modal from "react-native-modal";

var Datastore = require('react-native-local-mongodb');
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

export default class ScoreScreen extends React.Component {
	state = {
		modalNutrientName: "",
		isModalVisible: false,
		plateSaved: false,
		isDialogVisible: false
	};

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

	showModal = (nutrientName) => {
		this.setState({ modalNutrientName: global.neatNutrients[nutrientName] });
		this.setState({ isModalVisible: true });
	};

	closeModal = () => {
		this.setState({ isModalVisible: false });
	};

	render() {
		const { navigation } = this.props;
		const plate = navigation.getParam('plate', new Array());
		const tweaks = navigation.getParam('tweaks', 0);
		const score = navigation.getParam('score', 0);
		const warnings = navigation.getParam('warnings', new Array());

		let nutrientNames = new Array(<Text style={[styles.colHeader, styles.colHeaderLeft]}>Nutrient</Text>);
		let renderWarnings = new Array(<Text style={[styles.colHeader, styles.colHeaderMid]}>Advice</Text>);
		let dailyRecNutrients = new Array(<Text style={[styles.colHeader, styles.colHeaderMid]}>RDA</Text>);
		let nutrientScores = new Array(<Text style={[styles.colHeader, styles.colHeaderRight]}>Score</Text>);
		let newline = "\n";

		let adjustmentPlural = "s";
		if (tweaks == 1) {
			adjustmentPlural = "";
		}

		for (let i = 0; i < warnings.length; i++) {
			let nutrient = warnings[i][0];
			neatNutrient = global.neatNutrients[nutrient];
			//nutrient = capitalizeFirstLetter(nutrient);
			nutrientNames.push(
				<TouchableOpacity onPress={() => this.showModal(nutrient)}>
					<Text style={[styles.textColLeft, styles.textCol]}>{neatNutrient}:</Text>
				</TouchableOpacity>
			)
			let percentage = warnings[i][2]
			nutrientScores.push(
				<Text style={[styles.textColRight, styles.textCol]}>{percentage}%</Text>
			)

			let scoreRating = warnings[i][1];
			let advice = "";
			let operator = warnings[i][3];
			let operatorLimit = warnings[i][4];
			let unit = (global.nutrientUnits[nutrient] || "g"); // if no key, use grams (g)

			dailyRecNutrients.push(
				<Text style={[styles.textColMid, styles.textCol]}>{operator}{operatorLimit}{unit}</Text>
			)

			if (scoreRating == "perfect") {
				// Use renderWarnings.unshift to put new item at the beginning of the array
				renderWarnings.push(
					<Text style={[styles.textGreen, styles.textColMid, styles.textCol]}>Perfect!</Text>
				)
			} else if (scoreRating == "ok") {
				renderWarnings.push(
					<Text style={[styles.textGrey, styles.textColMid, styles.textCol]}>Not Bad!</Text>
				)
			} else {
				// If nutrient score is bad
				if (scoreRating == "-") {
					advice = "Very low!";
				} else {  //if (scoreRating == "+") 
					advice = "Very high!";
				}
				renderWarnings.push(
					<Text style={[styles.textRed, styles.textColMid, styles.textCol]}>{advice}</Text>
				)
			}
		}
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
					<DialogInput isDialogVisible={this.state.isDialogVisible}
						title={"Name Your Plate"}
						hintInput={"Plate Name"}
						submitInput={(inputText) => { this.savePlate(inputText, plate, score) }}
						closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
					</DialogInput>
					<Text style={score < 4333 ? [styles.header, styles.textRed] : score < 8666 ? [styles.header, styles.textGrey] : [styles.header, styles.textGreen]}>You Scored: {score}/13000 points!</Text>
					<Text style={styles.textAdjustments}>You made {tweaks} adjustment{adjustmentPlural} to your plate, and your score has been reduced by {tweaks * global.tweakPenalty} points.</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							{nutrientNames}
						</View>
						<View style={styles.column}>
							{renderWarnings}
						</View>
						<View style={styles.column}>
							{dailyRecNutrients}
						</View>
						<View style={styles.columnRight}>
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
				<Modal
					backdropOpacity={0}
					isVisible={this.state.isModalVisible}
					animationType="slide"
				>
					<View style={{
						flex: 1,
						backgroundColor: "#fff",
						borderRadius: 4,
						borderColor: "#eee",
						borderWidth: 2,
						marginTop: "40%",
					}}>
						<TouchableOpacity
							onPress={() => this.setState({ isModalVisible: false })}
						>
							<Text style={[styles.closeModal, styles.textBlue]}>Back</Text>
						</TouchableOpacity>
						<ScrollView
							style={styles.container}
						>

							<Text style={styles.header}>{this.state.modalNutrientName}</Text>
							<Text style={styles.header2}>Why It's Important</Text>
							<Text style={styles.header2}>Health Risks</Text>
							<Text style={styles.header2}>Foods Rich in {this.state.modalNutrientName}</Text>
						</ScrollView>
					</View>
				</Modal>
			</View >
		);
	};


};
// amber colour = #f4b342
const offset = 16;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	column: {
		flexDirection: 'column'
	},
	columnRight: {
		flex: 1,
		flexDirection: 'column'
	},
	header: {
		marginTop: offset * 2,
		marginBottom: offset,
		fontSize: 24,
		textAlign: "center",
	},
	footer: {
		marginTop: offset,
		marginBottom: offset,
		fontSize: 16,
		textAlign: "center",
	},
	header2: {
		marginTop: offset,
		marginBottom: offset,
		marginLeft: offset,
		fontSize: 18,
		textAlign: "left",
	},
	closeModal: {
		fontSize: 18,
		textAlign: "left",
		marginTop: offset,
		marginLeft: offset
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
	textCol: {
		marginTop: offset,
		fontSize: offset - 2,
	},
	textColLeft: {
		textAlign: "left",
		marginLeft: offset,
		textDecorationLine: 'underline',
		textDecorationStyle: 'dotted'
	},
	textColMid: {
		textAlign: "center",
		marginRight: offset,
		marginLeft: offset,
	},
	textColRight: {
		flex: 1,
		textAlign: "right",
		marginRight: offset,
	},
	colHeader: {
		marginTop: offset,
		fontSize: offset - 2,
		fontWeight: 'bold',
	},
	colHeaderLeft: {
		textAlign: "left",
		marginLeft: offset,
	},
	colHeaderMid: {
		textAlign: "center",
		marginLeft: offset,
		marginRight: offset,
	},
	colHeaderRight: {
		flex: 1,
		textAlign: "right",
		marginRight: offset,
	},
	textGreen: {
		color: "green",
	},
	textRed: {
		color: "red",
	},
	textGrey: {
		color: "gray",
	},
	textBlue: {
		color: "blue",
	},
	buttonText: {
		flex: 1,
		marginTop: "3%",
		fontSize: 24,
		marginBottom: "3%",
		color: "blue",
		textAlign: "center",
	},
});
