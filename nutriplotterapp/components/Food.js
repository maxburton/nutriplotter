import React, {Component} from 'react';
import {
    Image, 
    Animated, 
    PanResponder, 
    StyleSheet
} from 'react-native';


/*
    React Component representing an item of food by a draggable image.
    The idea is to be able to encapsulate an individual item of food and allow the
    user to drag it onto the plate.

    Current member is only the name.

    The object would represent a food item from the database of foods with its members being
    the database attributes. 

*/

export default class Food extends Component {
    
    // We store the nutrition scores for the food for adding to the plate. 
    // In the constructor, we pass a score object as a prop wherefrom we update the food's
    // scores. (As this doesn't change over time, it is not stored in the state of the component.)
    score = {
        calcium: 0,
        calories: 0,
        carbs: 0,
        fats: 0,
        fibre: 0,
        group: 0,
        omega3: 0,
        protein: 0,
        satfat: 0,
        sugar: 0,
        vitA: 0,
        vitB1: 0,
        vitB9: 0,
        vitC: 0
      }

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            plate: props.plate,
            foodCategory: props.foodCategory,
            onPlate: false,
        };  // Set the name of the food from the name prop if given, otherwise default is ''

        // Record the x,y position of the component: this can be used to check if we've added it
        // to the plate or not.
        this.animatedValue = new Animated.ValueXY();
        this.animatedValue.addListener((value) => this._value=value);
        this._value = {x: 200, y: 200};

        

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            
            // Show the food moving to the new position
            onPanResponderMove: Animated.event([
                null, {dx: this.animatedValue.x, dy: this.animatedValue.y}
            ]),
    
            // Update the position of the food after it's been moved: prevents snapping to the new position on touch
            onPanResponderGrant: (e, gestureState) => {
                this.animatedValue.setOffset({
                    x: this._value.x,
                    y: this._value.y
                });
                this.animatedValue.setValue({
                    x: 0, y: 0
                });

            },
    
            // Animate a short but gradual deceleration when you let go.
            onPanResponderRelease: (e, gestureState) => {
                this.animatedValue.flattenOffset();  
                Animated.decay(this.animatedValue, {
                    deceleration: 0.998,
                    velocity: {x: gestureState.vx, y: gestureState.vy}
                }).start();

                if (this.withinPlateDisk() && !this.addedToPlate()){
                        // Placed within plate but was not previously added to it 
                        this.state.plate.addFood(this);
                        this.state.onPlate = true;
                } else if (!this.withinPlateDisk() && this.addedToPlate()){
                        // Placed outwith the plate (!withinPlateDisk) but was previously  added.
                        this.state.plate.removeFood(this);
                        this.state.onPlate = false;
                }
                
            },
        })
    }



    render(){
        const animatedStyle = {
            transform: this.animatedValue.getTranslateTransform()
        }

        return (
            <Animated.View style={[animatedStyle, styles]} {...this.panResponder.panHandlers}>
                <Image source={require('../assets/images/fruit.png')}/>
            </Animated.View>
        )
    }

    // Check if the coords of this food fall within the plate's region (determined using pythagoras to find food displacement
    // from plate centre.)
    withinPlateDisk() {    
        var plateDim = this.state.plate.state.dimensions;
        var foodRadius = Math.sqrt(Math.pow( plateDim.center.x - this._value.x, 2) 
                            + Math.pow(plateDim.center.y - this._value.y, 2)
                        );
        var plateRadius = Math.floor(plateDim.radius / 2);
		return foodRadius <= plateRadius;
    }
    

    // True if this food is on the plate (stored in the Plate's food array) otherwise false
    addedToPlate(){
        return this.state.plate.food.includes(this);
    }


}




// Make sure that the default name is just an empty string
Food.defaultProps = {
    name: '', plate: null, foodCategory: null
}

const styles = StyleSheet.create({
    zIndex: 10
});