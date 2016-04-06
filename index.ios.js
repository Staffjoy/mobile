/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  PropTypes,
  View
} from 'react-native';

import StaffjoyHome from './js/StaffjoyHome';

class StaffjoyMobile extends Component {

  static get propTypes() {
    return {
      ...View.propTypes,

      baseURL: PropTypes.string
    }
  }

  render() {

    return (
      <StaffjoyHome baseURL={this.props.baseURL} />
    );
  }
}

AppRegistry.registerComponent('StaffjoyMobile', () => StaffjoyMobile);
