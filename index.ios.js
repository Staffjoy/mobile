/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component
} from 'react-native';

var StaffjoyHome = require('./StaffjoyHome');

class StaffjoyMobile extends Component {

  render() {
    return (
      <StaffjoyHome />
    );
  }
}

AppRegistry.registerComponent('StaffjoyMobile', () => StaffjoyMobile);
