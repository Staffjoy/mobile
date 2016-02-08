import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
  Platform
} from 'react-native';

var StaffjoyHome = React.createClass({

  getInitialState() {
    return {
      url: 'https://www.staffjoy.com'
    };
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground} />
        <WebView
          url={this.state.url}
          style={styles.web}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'white'
  },
  web: {
    flex: 1
  }
});

module.exports = StaffjoyHome;
