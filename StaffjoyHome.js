import React, {
  Alert,
  Component,
  LayoutAnimation,
  Linking,
  Platform,
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';

let INITIAL_PATH = '/auth/native';
let WEBVIEW_REF = 'webview';
let NAVBAR_HEIGHT = 44;
let CUSTOM_HEADERS = {'X-Staffjoy-Native': Platform.OS};

var StaffjoyHome = React.createClass({

  propTypes: {
    ...View.propTypes,

    baseURL: PropTypes.string.isRequired
  },

  render() {
    return (
      <WebViewWrapper
        baseURL={this.props.baseURL.replace(/\/?$/, '')}
        path={INITIAL_PATH}
      />
    );
  }

});

var WebViewWrapper = React.createClass({

  propTypes: {
    ...View.propTypes,

    baseURL: PropTypes.string.isRequired,
    path: PropTypes.string
  },

  getInitialState() {

    return {
      baseURL: this.props.baseURL,
      url: this.props.baseURL + (this.props.path || ''),
      domain: '',
      showNav: false,
      canGoBack: false,
      canGoForward: false
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <WebViewNavBar
          hidden = {!this.state.showNav}
          domain={this.state.domain}
          backButtonEnabled={this.state.canGoBack}
          forwardButtonEnabled={this.state.canGoForward}
          onOpenInBrowserButtonPress={this.openInBrowser}
          onBackButtonPress={this.goBack}
          onForwardButtonPress={this.goForward}
        />
        <WebView
          ref={WEBVIEW_REF}
          style={styles.web}
          source={{
            uri: this.state.url,
            headers: CUSTOM_HEADERS
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onNavigationStateChange={this.onNavigationStateChange}
          renderError={this.renderError}
        />
      </View>
    );
  },

  setupNavBarSlideAnimation() {
    let config = LayoutAnimation.create(
      300, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(config);
  },

  onNavigationStateChange(navState) {

    this.setupNavBarSlideAnimation();

    // extract domain name
    let matches = navState.url && navState.url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
    let domain = matches ? matches[1] : '';

    let isOnOriginDomain = (navState.url.indexOf(this.state.baseURL) != -1);

    this.setState({
      url: navState.url,
      showNav: !isOnOriginDomain,
      domain: isOnOriginDomain ? '' : domain,
      canGoBack: navState.canGoBack && !navState.loading,
      canGoForward: navState.canGoForward && !navState.loading
    });

  },

  renderError(errorDomain, errorCode, errorDesc) {
    return (
      <ErrorView
        description={errorDesc}
        buttonText={'Try Again'}
        onButtonPress={this.reload}
      />
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
    let config = LayoutAnimation.create(
      300, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(config);

    this.setState({
      navBarHeight: this.state.navBarHeight ? 0 : NAVBAR_HEIGHT,
      navBarAlpha: this.state.navBarAlpha ? 0 : 1
    });

    this.refs[WEBVIEW_REF].reload();
  }

});

var WebViewNavBar = React.createClass({

  propTypes: {
    ...View.propTypes,

    hidden: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    backButtonEnabled: PropTypes.bool.isRequired,
    forwardButtonEnabled: PropTypes.bool.isRequired,
    onBackButtonPress: PropTypes.func.isRequired,
    onForwardButtonPress: PropTypes.func.isRequired,
    onOpenInBrowserButtonPress: PropTypes.func.isRequired
  },

  render() {
    return (
      <View style={{height: (this.props.hidden ? 0 : NAVBAR_HEIGHT), overflow:'hidden'}}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={this.props.onBackButtonPress} disabled={!this.props.backButtonEnabled}>
            <Text style={this.props.backButtonEnabled ? styles.navButtonText : styles.navButtonDisabledText}>&lt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={this.props.onForwardButtonPress} disabled={!this.props.forwardButtonEnabled}>
            <Text style={this.props.forwardButtonEnabled ? styles.navButtonText : styles.navButtonDisabledText}>&gt;</Text>
          </TouchableOpacity>
          <Text numberOfLines={1} style={{height: NAVBAR_HEIGHT/2, opacity: 0.5, flex:1, backgroundColor:'lightgray', paddingLeft: 10, paddingRight: 10}}>{this.props.domain}</Text>
          <TouchableOpacity style={styles.navButton} onPress={this.props.onOpenInBrowserButtonPress}>
            <Text style={[styles.navButtonText, {fontSize: 12}]}>Open in browser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var ErrorView = React.createClass({

  propTypes: {
    ...View.propTypes,

    description: PropTypes.string,
    buttonText: PropTypes.string,
    onButtonPress: PropTypes.func
  },

  render() {

    let button = this.props.buttonText ? (
      <TouchableOpacity style={styles.button}>
        <Text style={{color:'white'}} onPress={this.props.onButtonPress}>Try Again</Text>
      </TouchableOpacity>
    ) : null;

    let description = this.props.description ? (
      <Text style={styles.errorDescription}>{this.props.description}</Text>
    ) : null;

    return (
      <View style={styles.error}>
        <Text style={styles.h1}>Oops!</Text>
        <Text style={styles.body}> There was an error loading the page.</Text>
        {description}
        {button}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'white'
  },
  navBarContainer: {
    overflow: 'hidden'
  },
  navBar: {
    height: NAVBAR_HEIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  navButton: {
    height: NAVBAR_HEIGHT,
    margin: 6,
    paddingLeft: 6,
    paddingRight: 6,
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
