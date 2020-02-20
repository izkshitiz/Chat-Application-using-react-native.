import React, {Component} from 'react';
import {View} from 'react-native';
import MainNavigation from './MainNavigation';

class Wrapper extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <MainNavigation />
      </View>
    );
  }
}

export default Wrapper;
