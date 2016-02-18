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

    var baseUrl = this.props.baseUrl || 'https://www.staffjoy.com';
    baseUrl = baseUrl.replace(/\/?$/, ''); // remove trailing slash

    return (
      <StaffjoyHome source={baseUrl + '/auth/native'}/>
    );
  }
}

AppRegistry.registerComponent('StaffjoyMobile', () => StaffjoyMobile);
