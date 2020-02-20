import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';

// {oPhotoUrl,oUserName:"Bot",lastMessage:"Tap on the user below to start the conversation."}

let chatlist = [
  {
    oAvatarUrl,
    oUserName: 'Bot',
    lastMessage: 'Tap on the user below to start the conversation.',
    chatId: 'None',
  },
];
let oUserName;
let oAvatarUrl;

class UserList extends Component {
  constructor(props) {
    super();
  }

  // state = {
  //   listData: chatlist,
  // };
  componentDidMount() {
    this.getChats(this.updateData);
  }

  updateData = () => {
    this.props.onListStateChange(chatlist);
    // this.setState({listData: [...chatlist]});
  };
  getChats = updateData => {
    // console.log('working');
    firebase
      .firestore()
      .collection('chats')
      .where(`${firebase.auth().currentUser.uid}`, '==', true)
      .onSnapshot(querySnapshot => {
        // console.log('querysnap', querySnapshot);
        // console.log('listlength', this.props.listData);
        // if (querySnapshot === this.props.listData) {
        //   return;
        // }
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          let lastMessage = doc.data().lastmessage;
          let oUserid = doc.id.replace(
            `${firebase.auth().currentUser.uid}`,
            '',
          );
          let chatId = doc.id;
          let userRef = firebase
            .firestore()
            .collection('users')
            .doc(`${oUserid}`);
          userRef
            .get()
            .then(function(doc) {
              if (doc.exists) {
                oAvatarUrl = doc.data().avatar;
                oUserName = doc.data().name;
                chatlist.push({oAvatarUrl, oUserName, lastMessage, chatId});
                updateData();
              } else {
                // doc.data() will be undefined in this case
                // console.log('No such document!');
              }
            })
            .catch(function(error) {
              // console.log('Error getting document:', error);
            });

          // console.log(doc.id, " => ", doc.data());
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View>
        {/* <Text>this should do!</Text> */}
        {/* <Button onPress={()=>{this.getChats(this.updateData)}} title='getData'></Button> */}
        {/* <Button onPress={()=>{this.getCurrentId()}} title='getEmail'></Button> */}

        {/* {console.log('from flatlist ' + this.props.listData)} */}
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.listData}
          renderItem={({item}) => (
            <ListItem
              onPress={() => {
                this.props.navigation.navigate('ChatRoom', {
                  oAvatarUrl: item.oAvatarUrl,
                  oUserName: item.oUserName,
                  chatId: item.chatId,
                });
              }}
              roundAvatar
              bottomDivider
              title={item.oUserName}
              subtitle={item.lastMessage}
              leftAvatar={{
                source: {uri: item.oAvatarUrl},
                size: 'large',
              }}
              chevron
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    listData: state.UserDataReducer.chatList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onListStateChange: List =>
      dispatch({type: 'SAVE_CHATLIST', chatList: List}),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);
