import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Button,
} from 'react-native';
import {Input} from 'galio-framework';
import {TapGestureHandler} from 'react-native-gesture-handler';
import firebase, {firestore} from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
const {height, width} = Dimensions.get('window');
var options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class NewSignUpForm extends Component {
  constructor() {
    super();
  }

  state = {
    age: null,
    height: null,
    name: null,
    showError: null,
    showSpinner: false,
    image_uri:
      'https://firebasestorage.googleapis.com/v0/b/chatapp-783a3.appspot.com/o/avataaars%20(1).png?alt=media&token=c44aab0a-ba78-4dd3-b670-f3003bda24dc',
  };

  uploadnewImage = path => {
    return new Promise((resolve) => {
      console.log('file url ' + path);
      let imageRef = firebase
        .storage()
        .ref()
        .child(`${firebase.auth().currentUser.uid}/avtar.jpeg`);
      let scndImageRef = imageRef;
      scndImageRef.putFile(path, {contentType: 'image/jpeg'}).then(function() {
        resolve(imageRef.getDownloadURL());
      });
    });
  };

  getImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.uploadnewImage(response.path)
          .then(url => {
            alert('uploaded');
            console.log(url);
            this.setState({image_uri: url});
          })
          .catch(error => console.log('new upload error' + error));
      }
    });
  };

  onNameTextChange = text => {
    this.setState({...this.state, name: text});
  };

  onAgeTextChange = text => {
    this.setState({...this.state, age: text});
  };

  onHeightTextChange = text => {
    this.setState({...this.state, height: text});
  };

  saveUserData = async (image, name, age, height) => {
    this.setState({...this.state, showError: null, showSpinner: true});
    let data = {name, age, height, avatar: image};

    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: name,
        photoURL: image,
      })
      .then(function() {
        console.log('Profile updated successfully!');
      })
      .catch(function(error) {
        console.error('Error updating profile: ' + error);
      });

    await firestore()
      .collection('users')
      .doc(`${firebase.auth().currentUser.uid}`)
      .set(data)
      .then(function() {
        console.log('Document successfully written! ');
      })
      .catch(function(error) {
        console.error('Error writing document: ' + error);
      });
    this.setState({...this.state, showError: null, showSpinner: false});
    this.props.navigation.navigate('InsideApp');
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.welcome}>
          Welcome, please fill out the details below.
        </Text>
        <View style={{flex: 1, height: height}}>
          <View style={{alignSelf: 'center'}}>
            <Image
              style={{width: 150, height: 150}}
              resizeMethod="resize"
              resizeMode="contain"
              borderRadius={50}
              source={{uri: this.state.image_uri}}
            />
          </View>

          <View
            style={{width: width / 2, alignSelf: 'center', marginVertical: 5}}>
            <Button onPress={this.getImage} title="Change Image" color="blue" />
          </View>
          <View style={{height: height / 10}} />
          <View style={styles.containerInput}>
            <View style={styles.containerInput1}>
              <Input
                style={{height: 50}}
                onChangeText={text => this.onNameTextChange(text)}
                placeholder="NAME"
                placeholderTextColor="black"
                rounded
              />
            </View>
            <View style={styles.containerInput1}>
              <Input
                style={{height: 50}}
                onChangeText={text => this.onAgeTextChange(text)}
                placeholder="AGE"
                placeholderTextColor="black"
                rounded
              />
            </View>
            <View style={styles.containerInput1}>
              <Input
                style={{height: 50}}
                onChangeText={text => this.onHeightTextChange(text)}
                placeholder="HEIGHT"
                placeholderTextColor="black"
                rounded
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
              this.saveUserData(
                this.state.image_uri,
                this.state.name,
                this.state.age,
                this.state.height,
              )
            }>
            <View style={styles.button}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>SAVE</Text>
            </View>
          </TapGestureHandler>
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
    marginHorizontal: 30,
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
  welcome: {
    fontSize: 20,
    margin: 15,
  },
});

export default NewSignUpForm;
