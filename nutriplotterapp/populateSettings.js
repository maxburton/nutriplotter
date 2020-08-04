/*
	Populates a mongodb database with default settings
*/

import React from 'react';

var Datastore = require('react-native-local-mongodb'),
    settingsdb = new Datastore({ filename: 'settings', autoload: true });

export default class PopulateSettings extends React.Component {
    constructor() {
        super();

        settingsdb.insert([
            { _id: "darkMode", value: false }
        ], function (err, newDocs) {
            if (err) {
                console.log("Errors: " + err);
                throw err;
            }
            global.populatedSettings = true;
        });
    }
}