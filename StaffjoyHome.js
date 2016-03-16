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
          onError={this.onError}
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          //renderError={this.renderError}
          startInLoadingState={true}
          injectedJavaScript={this.javaScriptToInject()}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />
        <TouchableOpacity onPress={this.reload} style={
          (this.state.error ? {flex: 1} : undefined)
        }>
          <View style={{
            backgroundColor:'red',
            height:(this.state.error ? 100 : undefined),
            width:100
          }} />
        </TouchableOpacity>
      </View>
    );
  },

  javaScriptToInject() {
    let fn = runOnEachPage.toString();
    fn = fn.replace(RegExp('this.state.baseURL', 'g'), '\'' + this.state.baseURL + '\'');
    fn = fn.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
    return fn;
  },

  onLoad(event) {

    this.setState({
      error: false,
      lastSuccessfulUrl: event.url
    });

    let url = event.nativeEvent.jsEvaluationValue;
    if (url !== undefined && url !== '')
    {
      Linking.openURL(url).catch(err => console.error('Unable to open url (' + url + ')', err));
    }
  },

  onError(event) {
    console.log("onError: " + event);
    this.setState({
      error: true
    });
  },

  onNavigationStateChange: function(navState) {
    // this.setState({
    //   url: navState.url
    // });
  },

  renderError(event) {
    return (
      <TouchableOpacity onPress={this.reload}>
        <View style={{
          backgroundColor:'red',
          height:100,
          width:100
        }} />
      </TouchableOpacity>
    );
  },

  reload() {
    // this.setState({
    //   error: false,
    //   url: this.state.lastSuccessfulUrl || this.getInitialState().url
    // })
    this.refs[WEBVIEW_REF].reload();
    // this.setState(this.getInitialState());
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
s = StaffjoyHome;
