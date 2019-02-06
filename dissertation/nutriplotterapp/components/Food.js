import React, {Component} from 'react';
import {
    Image, View, Animated, PanResponder
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
    
    // Record the x,y position of the component: this can be used to check if we've added it
    // to the plate or not.
    animatedValue = new Animated.ValueXY();
    _value = {x: 0, y: 0};


    constructor(props) {
        super(props);
        this.state = {name: props.name};  // Set the name of the food from the name prop if given, otherwise default is ''
    }

    panResponder = PanResponder.create({
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
        },
    })

    // Add the association between value and _value before the initial rendering
    componentWillMount(){
        animatedValue.addListener((value) => _value=value);
    }

    render(){
        const animatedStyle = {
            transform: this.animatedValue.getTranslateTransform()
        }

        return (
            <Animated.View style={[animatedStyle]} {... this.panResponder.panHandlers}>
                <Image 
                    style={{width: 50, height: 50, padding: 10}}
                    source={require('../assets/images/coffee.png')}/>
            </Animated.View>
        )
    }
}

// Make sure that the default name is just an empty string
Food.defaultProps = {
    name: ''
}