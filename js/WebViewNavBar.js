import React, {
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  Platform
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

    var textStyle = [styles.navButtonText];
    if (this.props.disabled)
    {
      textStyle.push(styles.navButtonDisabledText);
    }
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
        {this.props.hidden ? null :
          <View style={styles.navBar}>
            <NavButton text={'<'} disabled={!this.props.backButtonEnabled} onPress={this.props.onBackButtonPress} />
            <NavButton text={'>'} disabled={!this.props.forwardButtonEnabled} onPress={this.props.onForwardButtonPress} />
            <View style={styles.addressField}>
              <Text numberOfLines={1} style={styles.addressFieldText}>{this.props.domain}</Text>
            </View>
            <NavButton text={'Open Browser'} useSmallText={true} onPress={this.props.onOpenInBrowserButtonPress} />
          </View>
        }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navBarContainer: {
    flexDirection: 'column',
    overflow: 'hidden',
    height: NAVBAR_HEIGHT
  },
  navBar: {
    flex:1,
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
    paddingTop: Platform.OS === 'ios' ? 2 : 0
  },
  addressFieldText: {
    flex: 1
  },
  navButton: {
    height: NAVBAR_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12
  },
  navButtonText: {
    color: '#48B7AB',
    backgroundColor: 'transparent',
    fontSize: 24,
    marginTop: -2,
    flex: 1
  },
  navButtonSmallText: {
    fontSize: 12
  },
  navButtonDisabledText: {
    opacity: 0.4
  }
});

module.exports = WebViewNavBar;
