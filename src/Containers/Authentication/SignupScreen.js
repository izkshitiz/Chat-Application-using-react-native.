import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Input} from 'galio-framework';
import {TapGestureHandler} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
const {height} = Dimensions.get('window');

class SignupScreen extends Component {
  state = {
    email: null,
    password: null,
    showError: null,
    showSpinner: false,
  };

  onEmailTextChange = text => {
    this.setState({...this.state, email: text});
  };

  onPasswordTextChange = text => {
    this.setState({...this.state, password: text});
  };

  signUpUser = (email, password) => {
    this.setState({...this.state, showError: null, showSpinner: true});
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.props.onEmailPasswordSubmit(email, password);
        //   this.setState({...this.state,showSpinner:false}); same as in LoginScreen
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          this.setState({
            ...this.state,
            showSpinner: false,
            showError: 'The password is too weak.',
          });
        } else {
          this.setState({
            ...this.state,
            showSpinner: false,
            showError: errorMessage,
          });
        }
        console.log(error);
      });
  };

  render() {
    return (
      <View style={{flex: 1, height: height, justifyContent: 'center'}}>
        <View>
          <View style={styles.containerInput}>
            <View style={styles.containerInput1}>
              <Input
                style={{height: 50}}
                onChangeText={text => this.onEmailTextChange(text)}
                placeholder="EMAIL"
                placeholderTextColor="black"
                rounded
              />
            </View>
            <View style={styles.containerInput1}>
              <Input
                style={{height: 50}}
                onChangeText={text => this.onPasswordTextChange(text)}
                placeholder="PASSWORD"
                placeholderTextColor="black"
                password
                rounded
                viewPass
              />
            </View>
          </View>

          {this.state.showSpinner ? (
            <View>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          ) : null}

          <TapGestureHandler
            onHandlerStateChange={() =>
              this.signUpUser(this.state.email, this.state.password)
            }>
            <View style={styles.button}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN UP</Text>
            </View>
          </TapGestureHandler>
          <View style={{marginVertical: 15}}>
            <Text style={{textAlign: 'center'}}>──────── Or ────────</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 20,
            }}>
            <FontAwesome name="facebook" size={35} color="blue" />
            <FontAwesome name="google" size={30} color="blue" />
            <FontAwesome name="apple" size={35} color="blue" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'white',
    height: 70,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  containerInput: {
    justifyContent: 'center',
  },
  containerInput1: {
    marginHorizontal: -80,
    alignSelf: 'center',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onEmailPasswordSubmit: (smail, spass) =>
      dispatch({type: 'EMAIL_PASSWORD', email: smail, pass: spass}),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(SignupScreen);
