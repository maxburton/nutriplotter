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
import GlobalStyles from "../components/GlobalStyles"
import styles from "../themes/scoreScreenStyles";

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
		// global styles
		let globalStylesComponent = new GlobalStyles();
		let globalStyles = globalStylesComponent.global();
		let colorTheme = globalStylesComponent.colorTheme(global.settings.darkMode);

		const { navigation } = this.props;
		const plate = navigation.getParam('plate', new Array());
		const tweaks = navigation.getParam('tweaks', 0);
		const score = navigation.getParam('score', 0);
		const warnings = navigation.getParam('warnings', new Array());

		let colStyle = [globalStyles.textBold, globalStyles.textMed, colorTheme.textColor]

		let nutrientNames = new Array(<Text style={[colStyle, globalStyles.textLeft, globalStyles.marginFromLeft]}>Nutrient</Text>);
		let renderWarnings = new Array(<Text style={[colStyle, globalStyles.textCenter]}>Advice</Text>);
		let dailyRecNutrients = new Array(<Text style={[colStyle, globalStyles.textCenter]}>RDA</Text>);
		let nutrientScores = new Array(<Text style={[colStyle, globalStyles.textRight, globalStyles.marginFromRight]}>Score</Text>);
		let newline = "\n";

		let adjustmentPlural = "s";
		if (tweaks == 1) {
			adjustmentPlural = "";
		}

		for (let i = 0; i < warnings.length; i++) {
			let nutrient = warnings[i][0];
			let neatNutrient = global.neatNutrients[nutrient];
			//nutrient = capitalizeFirstLetter(nutrient);
			nutrientNames.push(
				<TouchableOpacity onPress={() => this.showModal(nutrient)}>
					<Text style={[colorTheme.textColor, globalStyles.marginFromLeft, globalStyles.textMed, globalStyles.textLeft, globalStyles.textDotted, globalStyles.marginFromTopHalf]}>{neatNutrient}:</Text>
				</TouchableOpacity>
			)
			let percentage = warnings[i][2]
			nutrientScores.push(
				<Text style={[colorTheme.textColor, globalStyles.marginFromRight, globalStyles.textMed, globalStyles.textRight, globalStyles.marginFromTopHalf]}>{percentage}%</Text>
			)

			let scoreRating = warnings[i][1];
			let advice = "";
			let operator = warnings[i][3];
			let operatorLimit = warnings[i][4];
			let unit = (global.nutrientUnits[nutrient] || "g"); // if no key, use grams (g)

			dailyRecNutrients.push(
				<Text style={[colorTheme.textColor, globalStyles.textMed, globalStyles.marginFromLeftHalf, globalStyles.marginFromTopHalf]}>{operator}{operatorLimit}{unit}</Text>
			)
			
			let adviceStyle = [globalStyles.marginFromLeftHalf, globalStyles.marginFromRightHalf, globalStyles.marginFromTopHalf, globalStyles.textMed, globalStyles.textCenter]
			if (scoreRating == "perfect") {
				// Use renderWarnings.unshift to put new item at the beginning of the array
				renderWarnings.push(
					<Text style={[globalStyles.green, adviceStyle]}>Perfect!</Text>
				)
			} else if (scoreRating == "ok") {
				renderWarnings.push(
					<Text style={[globalStyles.grey, adviceStyle]}>Not Bad!</Text>
				)
			} else {
				// If nutrient score is bad
				if (scoreRating == "-") {
					advice = "Very low!";
				} else {  //if (scoreRating == "+") 
					advice = "Very high!";
				}
				renderWarnings.push(
					<Text style={[globalStyles.red, adviceStyle]}>{advice}</Text>
				)
			}
		}
		// component styles
		let buttonStyle = [globalStyles.textBig, globalStyles.blue, globalStyles.marginFromBottom, globalStyles.textCenter];
		return (
			<View style={[globalStyles.flex1, colorTheme.bgColor, globalStyles.paddingFromBottom]}>
				<ScrollView style={[globalStyles.flex1]} keyboardShouldPersistTaps={'handled'}>
					<DialogInput isDialogVisible={this.state.isDialogVisible}
						title={"Name Your Plate"}
						hintInput={"Plate Name"}
						submitInput={(inputText) => { this.savePlate(inputText, plate, score) }}
						closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
					</DialogInput>
					<Text style={score < 4333 ? [globalStyles.header, globalStyles.red] : score < 8666 ? [globalStyles.header, globalStyles.grey] : [globalStyles.header, globalStyles.green]}>You Scored: {score}/13000 points!</Text>
					<Text style={[colorTheme.textColor, globalStyles.textCenter, globalStyles.marginFromLeft, globalStyles.marginFromRight, globalStyles.marginFromBottom, globalStyles.textBigMed]}>You made {tweaks} adjustment{adjustmentPlural} to your plate, and your score has been reduced by {tweaks * global.tweakPenalty} points.</Text>
					<View style={[globalStyles.flex1, globalStyles.flexRow]}>
						<View style={globalStyles.flexCol}>
							{nutrientNames}
						</View>
						<View style={globalStyles.flexCol}>
							{renderWarnings}
						</View>
						<View style={globalStyles.flexCol}>
							{dailyRecNutrients}
						</View>
						<View style={[globalStyles.flexCol, globalStyles.flex1]}>
							{nutrientScores}
						</View>
					</View>
					<TouchableOpacity style={globalStyles.flex1} onPress={() => this.displayDialog()}>
						<Text style={buttonStyle}>{newline}Save Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={globalStyles.flex1} onPress={() => this.tweakPlate()}>
						<Text style={buttonStyle}>Tweak Your Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={globalStyles.flex1} onPress={() => this.newPlate()}>
						<Text style={buttonStyle}>Make A New Plate</Text>
					</TouchableOpacity>
				</ScrollView>
				{/* More Info Modal */}
				<Modal
					backdropOpacity={0}
					isVisible={this.state.isModalVisible}
					animationType="slide"
				>
					<View style={globalStyles.modalContainer}>
						<TouchableOpacity
							style={globalStyles.backButton}
							onPress={() => this.setState({ isModalVisible: false })}
						>
							<Text style={[globalStyles.backButtonText, globalStyles.blue]}>Back</Text>
						</TouchableOpacity>
						<ScrollView
							style={[globalStyles.flex1, colorTheme.backgroundColor]}
						>

							<Text style={globalStyles.header}>{this.state.modalNutrientName}</Text>
							<Text style={globalStyles.header2}>Why It's Important</Text>
							<Text style={globalStyles.header2}>Health Risks</Text>
							<Text style={globalStyles.header2}>Foods Rich in {this.state.modalNutrientName}</Text>
						</ScrollView>
					</View>
				</Modal>
			</View >
		);
	};
};
