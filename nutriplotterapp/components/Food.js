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
    
    
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            plate: props.plate,
            onPlate: false
        };  // Set the name of the food from the name prop if given, otherwise default is ''

        // Record the x,y position of the component: this can be used to check if we've added it
        // to the plate or not.
        this.animatedValue = new Animated.ValueXY();
        this.animatedValue.addListener((value) => this._value=value);
        this._value = {x: 0, y: 0};


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
                })
                this.animatedValue.setValue({
                    x: 0, y: 0
                })
            },
    
            // Animate a short but gradual deceleration when you let go.
            onPanResponderRelease: (e, gestureState) => {
                this.animatedValue.flattenOffset();  
                Animated.decay(this.animatedValue, {
                    deceleration: 0.998,
                    velocity: {x: gestureState.vx, y: gestureState.vy}
                }).start();
                console.log("Food now at:");
                console.log(this._value);
                var plateState = this.state.plate.state;
                var foods = this.state.plate.state.foods;

                if (!this.state.onPlate && this.withinPlateDisk() ){
                    alert("Food on plate!");
                    plateState.empty = false;
                    
                    foods.push(this);
                    this.state.onPlate = true;
                // If we were on the plate but aren't any longer
                } else if (this.state.onPlate && !this.withinPlateDisk()) {
                    // Only iterate through foods if we know this food is on the plate (to be removed)
                    for (i = 0; i < foods.length; i++) {
                        if (foods[i].name === this.state.name) {
                            delete foods[i];
                        }
                    }
                    if (foods.length < 1){
                        plateState.empty = true;
                    }

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
                <Image 
                    
                    source={require('../assets/images/fruit.png')}/>
            </Animated.View>
        )
    }

    // Check if the coords of this food fall within the plate's region
    withinPlateDisk() {    
        var plateDim = this.state.plate.state.dimensions;
        var foodRadius = Math.sqrt(Math.pow( plateDim.center.x - this._value.x, 2) 
                            + Math.pow(plateDim.center.y - this._value.y, 2)
                        );
        var plateRadius = Math.floor(plateDim.radius / 2);
        console.log("::: "+foodRadius <= plateRadius);
        console.log(foodRadius);
        console.log(plateRadius);
		return foodRadius <= plateRadius;
    }
    
    // Update the pie chart %
    updatePieProgress(amount) {

    }

}


// Make sure that the default name is just an empty string
Food.defaultProps = {
    name: '', plate: null
}

const styles = StyleSheet.create({
    zIndex: 10
});