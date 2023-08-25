/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';


global.btoa = require('base-64').encode;

AppRegistry.registerComponent(appName, () => App);
