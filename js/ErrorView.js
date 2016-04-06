import React, {
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

module.exports = ErrorView;
