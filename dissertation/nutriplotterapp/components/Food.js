import React, {Component} from 'react';
import {
    Image,
} from 'react-native';


export default class Food extends Component {
    state = {name: ''}


    Food(name){
        this.state.name = name;
    }



    render(){
        return (
                <Image 
                style={{width: 50, height: 50, padding: 10}}
                source={require('../assets/images/coffee.png')}/>
        )
    }
}