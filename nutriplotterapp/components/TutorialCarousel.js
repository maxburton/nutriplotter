/*
	Renders a side item that displays around the plate in Homescreen. These are toggleable buttons that add specific food items to the outside of your plate.
	Current items: Apple, yoghurt, slide of bread, soda

	In effect, when we want to add an accompaniment to our meal, we also want to make sure that it impacts the nutrition
	score of the plate without taking up any place on it.

	Room for growth: Implement modals on press and provide a checklist of items to be added to the side of plate.

	
*/
import React from 'react';
import { Text, View, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export default class TutorialCarousel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			// tutorial modal carousel items
			activeIndex: 0,
			carouselItems: [
				{
					title: "Using The App",
					text: "This quick tutorial will give you a basic rundown to help you get started making plates right away!",
				},
				{
					title: "Finding Your Foods",
					text: "Search for your favourite foods on the search bar below the plate. We currently have 2000+ items, so there's plenty of choice. \n\nAfter searching, click on the desired items to add them to your plate.",
					image: require("../assets/images/tutSearch.png"),
				},
				{
					title: "Fixing Your Plate",
					text: "After adding some foods to your plate, you can adjust the amount by tapping on the plate itself. \n\nUse the sliders to increase the weight quickly, or use the increment buttons for precision. You can also remove any or all foods from the plate in this menu.",
					image: require("../assets/images/tutFood.png"),
				},
				{
					title: "A Little On The Side",
					text: "Click on the food icons at the plates corners to add a serving of a special food. We've hand chosen foods that often accompany meals (e.g. drinks, desserts) that are considered separate from the main plate. See what effect adding an apple has on your score!",
					image: require("../assets/images/tutSide.png"),
				},
				{
					title: "Submitting your plate",
					text: "After your plate is ready, press submit and you'll see a nutritional summary of your plate. If you're happy with this, you can submit it for scoring, or return to your plate to tweak it.",
				},
				{
					title: "Scoring",
					text: "After submitting, you'll be taken to the score screen. Scores are calculated against how nutritionally balanced your plate is, and an in-depth breakdown of each nutrient can be reviewed. You can also click on each nutrient to learn more about it's benefits and foods rich in it. Tweak your plate for better scores or save them for later. Try to get as close to a perfect score as possible!",
					image: require("../assets/images/tutScore.png"),
				},
				{
					title: "That's It!",
					text: "Go and start making your first plate! \n\nIf you ever need to review these instructions or view more tips, check out the help tab.",
				},
			]
		}
	}

	// render each carousel item
	_renderCarouselItem({ item, index }) {
		const contentPadding = [global.styles.paddingFromLeft, global.styles.paddingFromRight];
		let img = null;
		if ("image" in item) {
			img =
			<Image
				resizeMode="contain"
				source={item.image} 
				style={[global.styles.imageWide, global.styles.marginFromBottom]} 
			/>
		}
		return (
			<View
				style={[global.styles.carouselContainer, contentPadding]}
			>
				<Text style={[global.styles.header]}>{item.title}</Text>
				{img}
				<Text style={[global.styles.textMed]}>{item.text}</Text>
			</View>

		);
	};

	render() {
		return (
			<View style={[global.styles.flex1, global.styles.flexCenter]}>
				<Carousel
					layout={"default"}
					enableMomentum={true}
					ref={ref => this.carousel = ref}
					data={this.state.carouselItems}
					// This is dependant on how wide the modal container is in globalstyles (i.e. may need to update if that style changes its horizontal margins)
					sliderWidth={global.styleConstants.width - global.styleConstants.offset}
					itemWidth={global.styleConstants.width - global.styleConstants.offset}
					renderItem={this._renderCarouselItem}
					onSnapToItem={index => this.setState({ activeIndex: index })}
				/>
				<View >
					<Pagination
						dotsLength={this.state.carouselItems.length}
						activeDotIndex={this.state.activeIndex}
						dotStyle={global.styles.carouselDotStyle}
						inactiveDotStyle={global.styles.carouselDotStyle}
						inactiveDotOpacity={0.4}
						inactiveDotScale={0.6}
						tappableDots={true}
					/>
				</View>
			</View>
		)
	}
}
