import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';

class AuthCheckScreen extends Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.onUserStateChange(true);
        this.props.navigation.navigate(
          firebase.auth().currentUser.displayName === null
            ? 'NewSignUpForm'
            : 'InsideApp',
        );
      } else {
        this.props.onUserStateChange(false);
        this.props.navigation.navigate('Authenticate');
      }
    });
  }

  render() {
    return (
      <View>
        <Text>AuthCheckScreen</Text>
        {console.log('Login ' + this.props.userState)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userState: state.GlobalDataReducer.loggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUserStateChange: userstate =>
      dispatch({type: 'USER_STATE', userstate: userstate}),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthCheckScreen);
