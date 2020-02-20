//giving image height a value breaks the functionality of the keyboard

import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {Input} from 'galio-framework';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
const {height, width} = Dimensions.get('window');
const {
  Value,
  event,
  block,
  concat,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
}

class LoginScreen extends Component {
  constructor() {
    super();
    this.buttonOpacity = new Value(1);
    // this.onStateChange = event([{
    //     nativeEvent:({state})=>
    //     block([cond(eq(state, State.END),set(this.buttonOpacity,runTiming(new Clock(), 1, 0))
    //       )])
    // }]);
    this.onStateChange = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ]);

    this.onStateClose = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1)),
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 2, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP,
    });
  }

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

  signInUser = (email, password) => {
    this.setState({...this.state, showError: null, showSpinner: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.onEmailPasswordSubmit(email, password);
        // this.setState({...this.state,showSpinner:false}); commented because component tries to update state after its done loggin in to home screen thus causing warning.
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

  render() {
    return (
      <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'flex-end'}}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{translateY: this.bgY}],
          }}>
          <Image
            source={require('../../../assets/Images/Chatloginnew.png')}
            style={{flex: 1, width: null, height: null}}
          />
        </Animated.View>

        <View style={{height: height / 2.8, justifyContent: 'center'}}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{translateY: this.buttonY}],
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>

          <TapGestureHandler
            onHandlerStateChange={() => {
              this.props.navigation.navigate('SignupScreen');
            }}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{translateY: this.buttonY}],
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN UP</Text>
            </Animated.View>
          </TapGestureHandler>

          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              height: height / 2,
              top: null,
              justifyContent: 'center',
              zIndex: this.textInputZindex,
              opacity: this.textInputOpacity,
              transform: [{translateY: this.textInputY}],
            }}>
            <TapGestureHandler onHandlerStateChange={this.onStateClose}>
              <Animated.View style={styles.closeHead}>
                <Image
                  source={require('../../../assets/Images/text.png')}
                  style={{width: width / 2}}
                  resizeMode="contain"
                />
              </Animated.View>
            </TapGestureHandler>

            <TapGestureHandler onHandlerStateChange={this.onStateClose}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    transform: [{rotate: concat(this.rotateCross, 'deg')}],
                  }}>
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <FontAwesome name="facebook" size={35} color="#ee2762" />
              <FontAwesome name="google" size={35} color="#ee2762" />
              <FontAwesome name="apple" size={35} color="#ee2762" />
            </View>

            <View style={{marginVertical: 15}}>
              <Text style={{textAlign: 'center'}}>──────── Or ────────</Text>
            </View>

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
              <View style={styles.containerInput2}>
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
            {/* <TextInput
placeholder='EMAIL'
style={styles.textInput}
placeholderTextColor="black"
/>

<TextInput
placeholder='PASSWORD'
style={styles.textInput}
placeholderTextColor="black"
textContentType='newPassword'
/> */}
            {this.state.showSpinner ? (
              <View>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            ) : null}
            <TapGestureHandler
              onHandlerStateChange={() =>
                this.signInUser(this.state.email, this.state.password)
              }>
              <Animated.View style={{...styles.button}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN IN</Text>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
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
  containerInput2: {
    marginHorizontal: -80,
    alignSelf: 'center',
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
    elevation: 10,
  },
  closeHead: {
    position: 'absolute',
    top: -height / 3,
    left: width / 2 - width / 4,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onEmailPasswordSubmit: (smail, spass) =>
      dispatch({type: 'EMAIL_PASSWORD', email: smail, pass: spass}),
    onIncreaseCounter: () => dispatch({type: 'COUNTER'}),
  };
};
//user state is updated in wrapper.js

export default connect(
  null,
  mapDispatchToProps,
)(LoginScreen);
