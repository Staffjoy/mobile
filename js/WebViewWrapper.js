import React, {
  Component,
  LayoutAnimation,
  Linking,
  Platform,
  PropTypes,
  StyleSheet,
  View,
  WebView
} from 'react-native';

import WebViewNavBar from './WebViewNavBar';
import ErrorView from './ErrorView';

let WEBVIEW_REF = 'webview';
let CUSTOM_HEADERS = {'X-Staffjoy-Native': Platform.OS};

var WebViewWrapper = React.createClass({

  propTypes: {
    ...View.propTypes,

    baseURL: PropTypes.string.isRequired,
    path: PropTypes.string
  },

  getInitialState() {

    return {
      baseURL: this.props.baseURL,
      lastURL: '',
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
          hidden={!this.state.showNav}
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
            uri: this.props.baseURL + (this.props.path || ''),
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
      lastURL: navState.url,
      showNav: !isOnOriginDomain,
      domain: (isOnOriginDomain ? '' : domain),
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
    let url = this.state.lastURL;
    Linking.openURL(url).catch(err => console.error('Unable to open url (' + url + ')', err));
  },

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  },

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  },

  reload() {
    this.refs[WEBVIEW_REF].reload();
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
  web: {
    flex: 1
  }
});

module.exports = WebViewWrapper;
