import React from 'react';
import { Platform} from 'react-native';
import {SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class PopulateDatabase extends React.Component {
	constructor(){
		super();
		db.transaction(tx => {
			tx.executeSql(
				'insert or ignore into test (name) values ("anothertest");'
			);
		});
	}
}