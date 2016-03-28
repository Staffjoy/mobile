import React, {
  Alert,
  Component,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';

var WEBVIEW_REF = 'webview';

function runOnEachPage() {

  var url = document.location.href;

  var REDIRECTS = {
    // not yet used
  };

  if (url.startsWith(this.state.baseURL)) {
    let path = url.substring(this.state.baseURL.length);
    let redirect = REDIRECTS[path]
    if (redirect !== undefined) {
      document.location.href = redirect;
    }
  }
  else {
    console.dir({url:url, baseURL: this.state.baseURL})
    window.history.back();
    url;
  }
}

var StaffjoyHome = React.createClass({

  getInitialState() {
    var baseURL;
    let defaultPath = '/auth/native';

    if (this.props.source) {
      // remove trailing slash if present
      baseURL = this.props.source.replace(/\/?$/, '');
    }
    else {
      baseURL = __DEV__ ? 'http://dev.staffjoy.com' : 'https://www.staffjoy.com';
    }

    let url = baseURL + defaultPath;

    return {
      baseURL: baseURL,
      defaultPath: defaultPath,
      url: url,
      error: false
    }
  },

  headers() {
    return {
      uri: this.state.url,
      headers: {
        'X-Staffjoy-Native': Platform.OS
      }
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground} />
        <WebView
          ref={WEBVIEW_REF}
          source={this.headers()}
          style={styles.web}
          onLoad={this.onLoad}
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderError={this.renderError}
          startInLoadingState={true}
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
    return fn;
  },

  onNavigationStateChange(navState) {
    this.setState({
      lastSuccessfulUrl: navState.url
    });
  },

  onLoad(event) {
    let url = event.nativeEvent.jsEvaluationValue;
    if (url !== undefined && url !== '')
    {
      Linking.openURL(url).catch(err => console.error('Unable to open url (' + url + ')', err));
    }
  },

  renderError(errorDomain, errorCode, errorDesc) {
    return (
      <View style={styles.error}>
        <Text style={styles.h1}>Oops!</Text>
        <Text style={styles.body}> There was an error loading the page.</Text>
        <Text style={errorDesc && styles.errorDescription}>{errorDesc}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={{color:'white'}} onPress={this.reload}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  },

  reload() {
    this.refs[WEBVIEW_REF].reload();
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
  },
  error: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 8
  },
  errorDescription: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ddd',
    margin: 16,
    padding: 8
  },
  button: {
    backgroundColor: '#48B7AB',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 3
  }
});

module.exports = StaffjoyHome;
