import React, {
  Alert,
  Component,
  // Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

function runOnEachPage() {

  var url = document.location.href;

  var REDIRECTS = {
    '/': '/auth/native',
    '/auth/login': '/auth/native',
  };

  if (url.startsWith(this.state.baseURL)) {
    let path = url.substring(this.state.baseURL.length);
    let redirect = REDIRECTS[path]
    if (redirect !== undefined) {
      document.location.href = redirect;
    }
  }
  else {
    window.history.back();
    url;
  }
}

var StaffjoyHome = React.createClass({

  getInitialState() {
    var baseURL;
    let defaultPath = '/auth/native';

    if (this.props.baseURL) {
      // remove trailing slash if present
      baseURL = this.props.baseURL.replace(/\/?$/, '');
    }
    else {
      baseURL = 'https://www.staffjoy.com';
    }

    let url = baseURL + defaultPath;

    return {
      baseURL: baseURL,
      defaultPath: defaultPath,
      url: url
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground} />
        <WebView
          source={{uri: this.props.source, headers: {'X-App-Id': 'Staffjoy Native Mobile'}}}
          style={styles.web}
          onLoad={this.onLoad}
          injectedJavaScript={this.javaScriptToInject()}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />
      </View>
    );
  },

  javaScriptToInject() {
    let fn = runOnEachPage.toString();
    fn = fn.replace(RegExp('this.state.baseURL', 'g'), '\'' + this.state.baseURL + '\'');
    fn = fn.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
    // fn += '\nrunOnEachPage();';
    return fn;
  },

  onLoad(event) {
    let url = event.nativeEvent.jsEvaluationValue;
    if (url !== undefined && url !== '')
    {
      Alert.alert('External URL', 'I should be opening ' + url + ' in an external browser right about now!');
    }
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
