import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {Input, Text, Block, Button} from 'galio-framework';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LogoImage from '../Components/Image/LogoImage';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';

class Login extends Component {
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
        this.setState({...this.state, showSpinner: false});
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

  signInUser = (email, password) => {
    this.setState({...this.state, showError: null, showSpinner: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.onEmailPasswordSubmit(email, password);
        this.setState({...this.state, showSpinner: false});
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          this.setState({
            ...this.state,
            showSpinner: false,
            showError: 'Wrong password.',
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

  render = () => {
    return (
      <Block style={styles.containerLogin}>
        <Block style={styles.containerLogoImage}>
          <LogoImage />
        </Block>

        <Block style={styles.containerInput}>
          <Block style={styles.containerInput1}>
            <Input
              onChangeText={text => this.onEmailTextChange(text)}
              placeholder="Email"
              rounded
            />
          </Block>
          <Block style={styles.containerInput2}>
            <Input
              onChangeText={text => this.onPasswordTextChange(text)}
              placeholder="Passowrd"
              password
              rounded
              viewPass
            />
          </Block>
        </Block>

        <Block>
          <Text p>{this.state.showError}</Text>
        </Block>

        {this.state.showSpinner ? (
          <Block>
            <ActivityIndicator size="large" color="#00ff00" />
          </Block>
        ) : null}

        <Block row style={styles.containerLoginButton}>
          <Block>
            <Button
              onPress={() =>
                this.signInUser(this.state.email, this.state.password)
              }
              radius={30}
              style={styles.containerLoginButton1}>
              Login
            </Button>
          </Block>
          <Block>
            <Button
              onPress={
                () =>
                  this.signUpUser(
                    this.state.email,
                    this.state.password,
                  ) /*()=> this.props.onEmailPasswordSubmit(this.state.email,this.state.password)*/
              }
              radius={30}
              style={styles.containerLoginButton1}>
              Sign Up
            </Button>
          </Block>
        </Block>

        <Block row style={styles.containerSocialLoginButton}>
          <Block>
            <Button
              onPress={() => console.log('facebook' + this.props.userstate)}
              style={styles.containerSocialLoginButton1}
              radius={100}>
              <FontAwesome name="facebook-f" size={22} color="green" />
            </Button>
          </Block>
          <Block>
            <Button
              onPress={this.props.onIncreaseCounter}
              style={styles.containerSocialLoginButton1}
              radius={100}>
              <FontAwesome name="google" size={22} color="green" />
            </Button>
          </Block>
          <Block>
            <Button style={styles.containerSocialLoginButton1} radius={100}>
              <FontAwesome name="twitter" size={22} color="green" />
            </Button>
          </Block>
        </Block>

        <Text style={{backgroundColor: 'blue', color: 'white'}}>
          this {this.props.ctr}
        </Text>
      </Block>
    );
  };
}

const styles = StyleSheet.create({
  containerLogoImage: {
    alignItems: 'center',
  },
  containerLogin: {
    backgroundColor: '#ccc',
    alignSelf: 'stretch',
    flex: 0.9,
    alignContent: 'center',
  },

  containerInput: {
    backgroundColor: 'red',
    flex: 2,
    justifyContent: 'center',
  },
  containerInput1: {
    marginHorizontal: -80,
    alignSelf: 'center',
    elevation: 5,
  },
  containerInput2: {
    marginHorizontal: -80,
    alignSelf: 'center',
  },

  containerLoginButton: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  containerLoginButton1: {
    width: 120,
    elevation: 3,
  },
  containerSocialLoginButton: {
    backgroundColor: 'yellow',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  containerSocialLoginButton1: {
    width: 45,
  },
});

const mapStateToProps = state => {
  return {
    ctr: state.counter,
    userstate: state.loggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEmailPasswordSubmit: (smail, spass) =>
      dispatch({type: 'EMAIL_PASSWORD', email: smail, pass: spass}),
    onIncreaseCounter: () => dispatch({type: 'COUNTER'}),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
