/*
	Prepare global styles in an object
*/

import React from 'react';
import styleMap from "../themes/globalStyles";

export default class GlobalStyles extends React.Component {
    constructor() {
        super();
    }

    colorTheme(isDarkMode){
        if (isDarkMode) {
			return styleMap.darkMode;
		} else {
			return styleMap.lightMode;
		}
    }

    darkTheme(){
        return styleMap.darkMode;
    }
    
    lightTheme(){
        return styleMap.lightMode;
    }

    global(){
        return styleMap.global;
    }

    constants(){
        return styleMap.constants;
    }
}
