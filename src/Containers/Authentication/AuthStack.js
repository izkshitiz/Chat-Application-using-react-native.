import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import {createStackNavigator} from 'react-navigation-stack';

export default Chatstack = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  },
  SignupScreen: {
    screen: SignupScreen,
    navigationOptions: () => {
      return {
        headerTransparent: true,
      };
    },
  },
});
