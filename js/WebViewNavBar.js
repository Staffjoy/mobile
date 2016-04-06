import React, {
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native';

let NAVBAR_HEIGHT = 44;

var NavButton = React.createClass({

  propTypes: {
    useSmallText: PropTypes.bool,
    disabled: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  },

  render() {

    var textStyle = [this.props.disabled ? styles.navButtonDisabledText : styles.navButtonText];
    if (this.props.useSmallText)
    {
      textStyle.push(styles.navButtonSmallText);
    }

    return (
      <TouchableOpacity style={styles.navButton} onPress={this.props.onPress} disabled={this.props.disabled}>
        <Text style={textStyle}>{this.props.text}</Text>
      </TouchableOpacity>
    );
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
      <View style={[styles.navBarContainer, {height: (this.props.hidden ? 0 : NAVBAR_HEIGHT)}]}>
        <View style={styles.navBar}>
          <NavButton text={'<'} disabled={!this.props.backButtonEnabled} onPress={this.props.onBackButtonPress} />
          <NavButton text={'>'} disabled={!this.props.forwardButtonEnabled} onPress={this.props.onForwardButtonPress} />
          <Text numberOfLines={1} style={styles.addressField}>{this.props.domain}</Text>
          <NavButton text={'Open In Browser'} useSmallText={true} onPress={this.props.onOpenInBrowserButtonPress} />
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navBarContainer: {
    overflow: 'hidden'
  },
  navBar: {
    height: NAVBAR_HEIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressField: {
    height: NAVBAR_HEIGHT/2,
    opacity: 0.5,
    flex:1,
    backgroundColor:'lightgray',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2
  },
  navButton: {
    marginTop: -2,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center'
  },
  navButtonText: {
    color: '#48B7AB',
    fontSize: 24,
    flex: 1
  },
  navButtonSmallText: {
    fontSize: 12
  },
  navButtonDisabledText: {
    color: '#48B7AB',
    opacity: 0.4,
    backgroundColor: 'transparent',
    fontSize: 24
  }
});

module.exports = WebViewNavBar;
