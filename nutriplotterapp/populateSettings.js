/*
	Populates a mongodb database with default settings
*/

import React from 'react';

var Datastore = require('react-native-local-mongodb'),
globalSettingsdb = new Datastore({ filename: 'globalSettings', autoload: true });

export default class PopulateSettings extends React.Component {
    constructor() {
        super();


    }
}