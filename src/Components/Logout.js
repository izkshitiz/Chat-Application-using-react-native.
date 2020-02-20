import React, {Component} from 'react';
import {Block, Button, Text} from 'galio-framework';
import {StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';

class Logout extends Component {
  signOutUser = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <Block style={styles.LogoutButtonContainer}>
        <Block>
          <Text>{firebase.auth().currentUser.displayName}</Text>
        </Block>
        <Button
          onPress={this.signOutUser}
          radius={30}
          style={styles.LogoutButton}>
          Logout
        </Button>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  LogoutButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LogoutButton: {
    width: 100,
    backgroundColor: '#ee2762',
  },
});

export default Logout;
