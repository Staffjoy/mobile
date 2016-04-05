import React, {
  Alert,
  Component,
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';

var WEBVIEW_REF = 'webview';
let NAVBAR_HEIGHT = 44;

var StaffjoyHome = React.createClass({

  getInitialState() {
    var baseURL;
    let defaultBaseURL = __DEV__ ? 'http://dev.staffjoy.com' : 'https://www.staffjoy.com';
    let defaultPath = '/auth/native';

    if (this.props.source) {
      // removes trailing slash if present
      baseURL = this.props.source.replace(/\/?$/, '');
    }

    let url = baseURL + defaultPath;

    return {
      baseURL: baseURL,
      defaultPath: defaultPath,
      url: url,
      navBarHeight: 0,
      navBarAlpha: 0,
      canGoBack: false,
      canGoForward: false,
      customHeaders: {
        'X-Staffjoy-Native': Platform.OS
      }
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground} />
        <View style={{height: this.state.navBarHeight, overflow: 'hidden'}}>
          <View style={[styles.navBar, {height: NAVBAR_HEIGHT}]}>
            <TouchableOpacity style={styles.navButton} activeOpacity={this.state.navBarAlpha} onPress={this.goBack} disabled={!this.state.canGoBack}>
              <Text style={this.state.canGoBack ? styles.navButtonText : styles.navButtonDisabledText}>&lt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} activeOpacity={this.state.navBarAlpha} onPress={this.goForward} disabled={!this.state.canGoForward}>
              <Text style={this.state.canGoForward ? styles.navButtonText : styles.navButtonDisabledText}>&gt;</Text>
            </TouchableOpacity>
            <Text onPress={this.toggleNav} style={{height: NAVBAR_HEIGHT/2, opacity: 0.5, flex:1, backgroundColor:'lightgray', paddingLeft: 10, paddingRight: 10}}>{this.state.url}</Text>
            <TouchableOpacity style={styles.navButton} onPress={this.openInBrowser}>
              <Text style={styles.navButtonText}>📲</Text>
            </TouchableOpacity>
            <View style={{width: 20}} />
          </View>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          source={{
            uri: this.state.url,
            headers: this.state.customHeaders
          }}
          style={styles.web}
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderError={this.renderError}
          startInLoadingState={true}
        />
      </View>
    );
  },

  onNavigationStateChange(navState) {
    this.setState({
      url: navState.url,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward
    });

    let isOnStaffjoySite = navState.url.indexOf(this.state.baseURL) != -1;

    // Animated.spring(this.state.navBarHeight, {
    //   toValue: isOnStaffjoySite ? 0 : NAVBAR_HEIGHT
    // });
  },

  toggleNav() {
    // this.state.showNav = !this.state.showNav;
    // Animated.spring(this.state.navBarHeight, {
    //   toValue: this.state.showNav ? 0 : NAVBAR_HEIGHT
    // });
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

  openInBrowser() {
    Linking.openURL(this.state.url).catch(err => console.error('Unable to open url (' + url + ')', err));
  },

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  },

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  },

  reload() {
    // this.setState({showNav: !this.state.showNav});

    // let toValue = this.state.showNav ? NAVBAR_HEIGHT : 0;

    // LayoutAnimation.linear();

    let config = LayoutAnimation.create(
      300, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(config);

    this.setState({
      navBarHeight: this.state.navBarHeight ? 0 : NAVBAR_HEIGHT,
      navBarAlpha: this.state.navBarAlpha ? 0 : 1
    });

    // LayoutAnimation.linear();
    // Animated.spring(this.state.navBarHeight, {
    //   toValue: 44
    // }).start();
    // this.refs[WEBVIEW_REF].reload();
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
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  navButton: {
    height: NAVBAR_HEIGHT,
    margin: 8,
    padding: 8,
    alignItems: 'center'
  },
  navButtonText: {
    color: '#48B7AB',
    fontSize: 24
  },
  navButtonDisabledText: {
    color: '#48B7AB',
    opacity: 0.4,
    backgroundColor: 'transparent',
    fontSize: 24
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
