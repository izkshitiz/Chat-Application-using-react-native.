// import React from 'react';
import ChatRoom from './ChatRoom';
import UserList from './UserList';
import {createStackNavigator} from 'react-navigation-stack';

export default Exercisestack = createStackNavigator({
  UserList: {
    screen: UserList,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: 'Chat',
        headerTitleStyle: {
          alignSelf: 'center',
        },
      };
    },
  },
  ChatRoom,
});
