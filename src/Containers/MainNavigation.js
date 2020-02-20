import AuthStack from './Authentication/AuthStack';
import Tabnavigator from '../Components/Tabnavigator';
import AuthCheckScreen from './AuthCheckScreen';
import NewSignUpForm from './UserInfoForm/NewSignUpForm';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthCheck: AuthCheckScreen,
      Authenticate: AuthStack,
      NewSignUpForm,
      InsideApp: Tabnavigator,
    },
    {
      initialRouteName: 'AuthCheck',
    },
  ),
);
