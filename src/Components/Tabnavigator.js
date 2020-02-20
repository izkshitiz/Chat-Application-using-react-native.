import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatStack from '../Containers/Chat/ChatStack';
import Logout from './Logout';

export default Tabnavigator = createMaterialBottomTabNavigator(
  {
    ChatStack: {
      screen: ChatStack,
      navigationOptions: ({navigation}) => {
        return {
          title: 'Chat',
          headerTitle: 'Chat',
          tabBarIcon: (
            <MaterialCommunityIcons name="chat" size={25} color="#ee2762" />
          ),
        };
      },
    },
    LogoutScreen: {
      screen: Logout,
      navigationOptions: ({navigation}) => {
        return {
          title: 'Profile',
          headerTitle: 'Your Profile',
          tabBarIcon: (
            <MaterialCommunityIcons name="account" size={25} color="#ee2762" />
          ),
        };
      },
    },
  },

  {
    initialRouteName: 'ChatStack',
    activeColor: '#000',
    inactiveColor: '#3e2465',
    barStyle: {backgroundColor: '#fff'},
  },
);
