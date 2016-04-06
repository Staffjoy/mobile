import React, {
  Platform,
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import WebViewWrapper from './WebViewWrapper';

let DEFAULT_BASE_URL = 'https://www.staffjoy.com';
let INITIAL_PATH = '/auth/native';
let CUSTOM_HEADERS = {'X-Staffjoy-Native': Platform.OS};

var StaffjoyHome = React.createClass({

  propTypes: {
    ...View.propTypes,

    baseURL: PropTypes.string
  },

  render() {

    var baseURL = this.props.baseURL || DEFAULT_BASE_URL;
    baseURL = baseURL.replace(/\/?$/, ''); // remove trailing slash if present

    return (
      <WebViewWrapper
        baseURL={baseURL}
        path={INITIAL_PATH}
      />
    );
  }

});

module.exports = StaffjoyHome;
