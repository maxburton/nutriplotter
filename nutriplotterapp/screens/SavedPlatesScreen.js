/*
	Shows the user's saved plates (as well as a few default plates). These plates can be loaded into the homescreen.
*/

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	ScrollView,
	Alert,
} from 'react-native';

var Datastore = require("react-native-local-mongodb"),
	savedPlatesdb = new Datastore({ filename: "savedPlates", autoload: true });
sideItemsdb = new Datastore({ filename: 'sideItems', autoload: true });
platedb = new Datastore({ filename: 'plate', autoload: true });

export default class SavedPlatesScreen extends React.Component {
	static navigationOptions = () => ({
		title: 'Saved Plates',
		headerStyle: { backgroundColor: global.colorTheme.navHeader.backgroundColor },
		headerTintColor: global.colorTheme.navHeader.color
	});
	constructor(props) {
		super(props);
		this.state = {
			refresh: 0,
		};
	}

	componentDidMount() {
		this.props.navigation.addListener("willFocus", this.refresh);
	}
	refresh = () => {
		this.setState({ refresh: Math.random() });
		// refresh header
		this.props.navigation.setParams({});
	}

	render() {
		let newline = "\n\n";
		if (global.savedPlates.length > 0) {
			return (
				<FlatList
					style={[global.styles.flex1, global.colorTheme.bgColor]}
					data={global.savedPlates}
					renderItem={({ item, index }) => {
						return (
							<FlatListItem flatListParent={this} item={item} index={index}>
							</FlatListItem>
						);
					}}
					// Get key using global savedPlates unique platename
					keyExtractor={(item) => item.plateName.toString()}
				>
				</FlatList>

			);
		} else {
			return (<Text style={styles.nothingText}>Nothing here!{newline} Try creating a plate and saving it from the score screen.</Text>);
		}
	}
}


class FlatListItem extends React.Component {
	render() {
		var foodImages = {
			savouries: require('../assets/images/savouries.png'),
			misc: require('../assets/images/misc.png'),
			sauce: require('../assets/images/sauce.png'),
			soup: require('../assets/images/soup.png'),
			chocolate: require('../assets/images/chocolate.png'),
			snacks: require('../assets/images/snacks.png'),
			sweets: require('../assets/images/sweets.png'),
			drinks: require('../assets/images/drinks.png'),
			booze: require('../assets/images/booze.png'),
			oil: require('../assets/images/oil.png'),
			burger: require('../assets/images/burger.png'),
			game: require('../assets/images/game.png'),
			chicken: require('../assets/images/chicken.png'),
			beef: require('../assets/images/beef.png'),
			bacon: require('../assets/images/bacon.png'),
			fish: require('../assets/images/fish.png'),
			herbs: require('../assets/images/herbs.png'),
			nuts: require('../assets/images/nuts.png'),
			juice: require('../assets/images/juice.png'),
			fruit: require('../assets/images/fruit.png'),
			vegdish: require('../assets/images/vegdish.png'),
			veg: require('../assets/images/veg.png'),
			beans: require('../assets/images/beans.png'),
			potato: require('../assets/images/potato.png'),
			egg: require('../assets/images/egg.png'),
			cream: require('../assets/images/cream.png'),
			icecream: require('../assets/images/icecream.png'),
			milk: require('../assets/images/milk.png'),
			pudding: require('../assets/images/pudding.png'),
			cakes: require('../assets/images/cakes.png'),
			biscuits: require('../assets/images/biscuits.png'),
			cereals: require('../assets/images/cereals.png'),
			pastries: require('../assets/images/pastries.png'),
			bread: require('../assets/images/bread.png'),
			pizza: require('../assets/images/pizza.png'),
			pasta: require('../assets/images/pasta.png'),
			rice: require('../assets/images/rice.png'),
			sandwich: require('../assets/images/sandwich.png'),
			grains: require('../assets/images/grains.png'),
		};

		renderImages = []
		let plate = this.props.item.plate
		for (let i = 0; i < plate.length; i++) {
			if (i > 3) {
				break;
			}
			let group = plate[i].group
			renderImages.push(
				<Image key={group}
					source={foodImages[group]}
					style={styles.image}
				/>
			)
		}
		let plateName = this.props.item.plateName;

		if (!plateName) {
			plateName = "Untitled Plate"
		}

		let score = this.props.item.score;

		return (
			<TouchableOpacity onPress={() => this.loadPlate(this.props.item)}>
				<View style={styles.container}>
					<Text style={styles.title}>{plateName}</Text>
				</View>
				<View style={styles.itemStyle}>
					{renderImages}
					<View style={styles.scoreTextView}>
						<Text style={score < 4333 ? styles.scoreRed : score < 8666 ? styles.scoreAmber : styles.scoreGreen}>{score}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	loadPlate = (item) => {
		global.tweaks = 0;
		global.maximum = 100;
		global.totals = {};
		global.plate = JSON.parse(JSON.stringify(item.plate));
		platedb.remove({}, { multi: true }, function (err, numRemoved) {
			platedb.insert(global.plate, function (err, newDocs) {
			});
		});
		Alert.alert("Plate Loaded");
	};
}


const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		flex: 1,
	},
	nothingText: {
		marginTop: "45%",
		textAlign: "center",
		fontSize: 24,
	},
	image: {
		width: 50,
		height: 50,
		margin: 4,
	},
	itemStyle: {
		flex: 1,
		flexDirection: 'row',
		padding: 8,
		marginTop: 3,
		backgroundColor: '#c1c1c1',
	},
	scoreTextView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: "center",
	},
	scoreRed: {
		flex: 1,
		fontSize: 24,
		textAlign: "right",
		marginRight: 10,
		color: "red",
	},
	scoreGreen: {
		flex: 1,
		fontSize: 24,
		textAlign: "right",
		marginRight: 10,
		color: "green",
	},
	scoreAmber: {
		flex: 1,
		fontSize: 24,
		textAlign: "right",
		marginRight: 10,
		color: "yellow",
	},
	title: {
		flex: 1,
		fontSize: 24,
		textAlign: "left",
		fontWeight: "bold",
		marginLeft: "5%",
	},

});