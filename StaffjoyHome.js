import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView
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
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  web: {
    flex: 1
  }
});

module.exports = StaffjoyHome;
