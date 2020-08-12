/*
	Displays the user's final score, along with hints on how to improve next time. Also provides buttons to save their plate, edit their plate or make a brand new plate
*/

import React from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Button,
	Alert,
	Modal
} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import styles from "../themes/scoreScreenStyles";

var Datastore = require('react-native-local-mongodb');
savedPlatesdb = new Datastore({ filename: 'savedPlates', autoload: true });

export default class ScoreScreen extends React.Component {
	state = {
		modalNutrientName: "",
		isModalVisible: false,
		plateSaved: false,
		isDialogVisible: false,
		refresh: 0,
		isDarkMode: false,
	};

	static navigationOptions = ({ navigation }) => ({
		//header: null,
		title: 'Score',
		headerLeft: () => <Button title='Back' onPress={() => { navigation.navigate('Home', { plate: this.plate }) }} />,
		headerStyle: { backgroundColor: global.colorTheme.navHeader.backgroundColor },
		headerTintColor: global.colorTheme.navHeader.color
	}
	);

	displayDialog() {
		this.setState({ isDialogVisible: true });
	}

	savePlate = (plateName, plate, score) => {

		let plateNames = [];
		for (let savedPlate of global.savedPlates) {
			plateNames.push(savedPlate.plateName.toLowerCase());
		}
		console.log(plateNames);
		if (!plateName) {
			Alert.alert("Please name your plate!");
		} else if (plateNames.includes(plateName.toLowerCase())) {
			Alert.alert("You've already saved a plate with this name!");
		} else if (this.state.plateSaved) {
			Alert.alert("You've already saved this plate!");
		} else {
			this.setState({ plateSaved: true });
			global.savedPlates.push({ plateName: plateName, plate: plate, score: score });
			this.setState({ isDialogVisible: false });
			Alert.alert("Plate Saved");
			savedPlatesdb.insert({ plateName: plateName, plate: plate, score: score }, function (err, newDoc) {
				console.log("Saved Plates: " + global.savedPlates[0]["plate"]);
				
			});
		}
	}

	tweakPlate = () => {
		global.tweaks++;
		this.props.navigation.navigate("Home");
	}

	newPlate = async () => {
		let cleanedPlate = platedb.remove({}, { multi: true }, function (err, numRemoved) {
		});
		await cleanedPlate;
		global.tweaks = 0;
		global.plate = [];
		this.props.navigation.navigate("Home");

	}

	componentDidMount() {
		this.props.navigation.addListener("willFocus", this.refresh);
	}

	refresh = () => {
		this.setState({ refresh: Math.random() });
		// refresh header
		this.props.navigation.setParams({});
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

		let colStyle = [global.styles.textBold, global.styles.textMed, global.colorTheme.textColor]

		let nutrientNames = new Array(<Text key={"colName"} style={[colStyle, global.styles.textLeft, global.styles.marginFromLeft]}>Nutrient</Text>);
		let renderWarnings = new Array(<Text key={"colName"} style={[colStyle, global.styles.textCenter]}>Advice</Text>);
		let dailyRecNutrients = new Array(<Text key={"colName"} style={[colStyle, global.styles.textCenter]}>RDA</Text>);
		let nutrientScores = new Array(<Text key={"colName"} style={[colStyle, global.styles.textRight, global.styles.marginFromRight]}>Score</Text>);
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
				<TouchableOpacity key={nutrient} onPress={() => this.showModal(nutrient)}>
					<Text style={[global.colorTheme.textColor, global.styles.marginFromLeft, global.styles.textMed, global.styles.textLeft, global.styles.textDotted, global.styles.marginFromTopHalf]}>{neatNutrient}:</Text>
				</TouchableOpacity>
			)
			let percentage = warnings[i][2]
			nutrientScores.push(
				<Text key={nutrient} style={[global.colorTheme.textColor, global.styles.marginFromRight, global.styles.textMed, global.styles.textRight, global.styles.marginFromTopHalf]}>{percentage}%</Text>
			)

			let scoreRating = warnings[i][1];
			let advice = "";
			let operator = warnings[i][3];
			let operatorLimit = warnings[i][4];
			let unit = (global.nutrientUnits[nutrient] || "g"); // if no key, use grams (g)

			dailyRecNutrients.push(
				<Text key={nutrient} style={[global.colorTheme.textColor, global.styles.textMed, global.styles.marginFromLeftHalf, global.styles.marginFromTopHalf]}>{operator}{operatorLimit}{unit}</Text>
			)

			let adviceStyle = [global.styles.marginFromLeftHalf, global.styles.marginFromRightHalf, global.styles.marginFromTopHalf, global.styles.textMed, global.styles.textCenter]
			if (scoreRating == "perfect") {
				// Use renderWarnings.unshift to put new item at the beginning of the array
				renderWarnings.push(
					<Text key={nutrient} style={[global.styles.green, adviceStyle]}>Perfect!</Text>
				)
			} else if (scoreRating == "ok") {
				renderWarnings.push(
					<Text key={nutrient} style={[global.styles.grey, adviceStyle]}>Not Bad!</Text>
				)
			} else {
				// If nutrient score is bad
				if (scoreRating == "-") {
					advice = "Very low!";
				} else {  //if (scoreRating == "+") 
					advice = "Very high!";
				}
				renderWarnings.push(
					<Text key={nutrient} style={[global.styles.red, adviceStyle]}>{advice}</Text>
				)
			}
		}
		// component styles
		let buttonStyle = [global.styles.textBig, global.styles.blue, global.styles.marginFromBottom, global.styles.textCenter];
		return (
			<View style={[global.styles.flex1, global.colorTheme.bgColor, global.styles.paddingFromBottom]}>
				<ScrollView style={[global.styles.flex1]} keyboardShouldPersistTaps={'handled'}>
					<DialogInput isDialogVisible={this.state.isDialogVisible}
						title={"Name Your Plate"}
						hintInput={"Plate Name"}
						submitInput={(inputText) => { this.savePlate(inputText, plate, score) }}
						closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
					</DialogInput>
					<Text style={score < 4333 ? [global.styles.header, global.styles.red] : score < 8666 ? [global.styles.header, global.styles.grey] : [global.styles.header, global.styles.green]}>You Scored: {score}/13000 points!</Text>
					<Text style={[global.colorTheme.textColor, global.styles.textCenter, global.styles.marginFromLeft, global.styles.marginFromRight, global.styles.marginFromBottom, global.styles.textBigMed]}>You made {tweaks} adjustment{adjustmentPlural} to your plate, and your score has been reduced by {tweaks * global.tweakPenalty} points.</Text>
					<View style={[global.styles.flex1, global.styles.flexRow]}>
						<View style={global.styles.flexCol}>
							{nutrientNames}
						</View>
						<View style={global.styles.flexCol}>
							{renderWarnings}
						</View>
						<View style={global.styles.flexCol}>
							{dailyRecNutrients}
						</View>
						<View style={[global.styles.flexCol, global.styles.flex1]}>
							{nutrientScores}
						</View>
					</View>
					<TouchableOpacity style={global.styles.flex1} onPress={() => this.displayDialog()}>
						<Text style={buttonStyle}>{newline}Save Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={global.styles.flex1} onPress={() => this.tweakPlate()}>
						<Text style={buttonStyle}>Tweak Your Plate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={global.styles.flex1} onPress={() => this.newPlate()}>
						<Text style={buttonStyle}>Make A New Plate</Text>
					</TouchableOpacity>
				</ScrollView>
				{/* More Info Modal */}
				<Modal
					transparent={true}
					visible={this.state.isModalVisible}
					animationType="slide"
				>
					<View style={global.styles.modalContainer}>
						<TouchableOpacity
							style={global.styles.backButton}
							onPress={() => this.setState({ isModalVisible: false })}
						>
							<Text style={[global.styles.backButtonText, global.styles.blue]}>Back</Text>
						</TouchableOpacity>
						<ScrollView
							style={[global.styles.flex1, global.colorTheme.backgroundColor]}
						>

							<Text style={global.styles.header}>{this.state.modalNutrientName}</Text>
							<Text style={global.styles.header2}>Why It's Important</Text>
							<Text style={global.styles.header2}>Health Risks</Text>
							<Text style={global.styles.header2}>Foods Rich in {this.state.modalNutrientName}</Text>
						</ScrollView>
					</View>
				</Modal>
			</View >
		);
	};
};
