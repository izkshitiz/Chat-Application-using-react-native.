// problem: limiting the amount of data received.
// solution: prepend or append depending on the source of message.

import React, {Component} from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';

class ChatRoom extends Component {
  oAvatarUrl = null;
  oUserName = null;
  chatId = null;
  uid = '';
  userName = null;
  messagesRef = null;
  firstMessagesRef = null;
  unsubscribe = null;
  source = null;

  constructor(props) {
    super(props);
    this.oAvatarUrl = this.props.navigation.getParam(
      'oAvatarUrl',
      'default hai ye',
    );
    this.oUserName = this.props.navigation.getParam(
      'oUserName',
      'default hai ye',
    );
    this.chatId = this.props.navigation.getParam('chatId', 'default hai ye');
    // console.log('chatid '+this.chatId);
    this.setUid(firebase.auth().currentUser.uid);
    this.setUserName(firebase.auth().currentUser.displayName);
  }

  state = {
    messages: [],
  };

  setUserName(value) {
    this.userName = value;
  }

  getUserName() {
    return this.userName;
  }

  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }

  componentDidMount() {
    this.loadFirstMessages(message => {
      this.setState(previousState => {
        return {
          messages: GiftedChat.prepend(previousState.messages, message),
        };
      });
    });

    this.loadNewMessages(message => {
      if (message.createdAt == null) {
        //this is for local messages
        this.setState(previousState => {
          return {
            messages: GiftedChat.append(previousState.messages, message),
          };
        });
      } else {
        this.setState(previousState => {
          //  message._id=Math.random()
          return {
            messages: GiftedChat.append(previousState.messages, message),
          };
        });
      }
    });
  }

  sendMessage = async message => {
    const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
    let d = new Date();
    const genDocId = this.messagesRef.doc();
    // const genDocIdGet = await genDocId.get();
    for (let i = 0; i < message.length; i++) {
      let data = {
        // id:genDocIdGet.id,
        date: d,
        text: message[i].text,
        user: message[i].user,
        createdAt: timeStamp,
      };

      genDocId
        .set(data)
        .then(function() {
          // console.log('Document Added');
        })
        .catch(function() {
          // console.error('Error adding document: ', error);
        });
    }
  };

  async loadFirstMessages(firstcallback) {
    this.firstMessagesRef = await firebase
      .firestore()
      .collection('chats')
      .doc(`${this.chatId}`)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();

    this.firstMessagesRef.docs.map(doc => {
      let text = doc.data().text;

      let createdAt = doc.data().createdAt;
      let formatDate = null;
      createdAt ? (formatDate = createdAt.toDate()) : (formatDate = createdAt);
      let messageId = doc.id;
      let user = doc.data().user;

      firstcallback({
        _id: messageId,
        text: text,
        createdAt: formatDate,
        user: {
          _id: user._id,
          name: user.name,
        },
      });
    });
  }

  loadNewMessages(callback) {
    this.messagesRef = firebase
      .firestore()
      .collection('chats')
      .doc(`${this.chatId}`)
      .collection('messages');
    this.messagesRef
      .orderBy('createdAt', 'desc')
      .limit(15)
      .onSnapshot(function(snapshot) {
        console.log('snapshot', snapshot);
        if (snapshot._changes.length > 1) {
          return;
        }
        snapshot.docChanges.forEach(function(change) {
          if (change.type === 'added') {
            let text = change.doc.data().text;
            // let id = doc.data().id;
            let createdAt = change.doc.data().createdAt;
            let formatDate = null;
            createdAt
              ? (formatDate = createdAt.toDate())
              : (formatDate = createdAt);
            let messageId = change.doc.id;
            let user = change.doc.data().user;

            callback({
              _id: messageId,
              text: text,
              createdAt: formatDate,
              user: {
                _id: user._id,
                name: user.name,
              },
            });

            // }
          }
          if (change.type === 'modified') {
            // console.log('Modified city: ', change.doc.data());
          }
          if (change.type === 'removed') {
            // console.log('Removed city: ', change.doc.data());
          }
        });
      });
  }

  componentWillUnmount() {
    this.closeChat();
  }

  closeChat() {
    if (this.messagesRef) {
      //   this.unsubscribe();
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={message => {
            this.sendMessage(message);
          }}
          user={{
            _id: this.getUid(),
            name: this.getUserName(),
            avatar: firebase.auth().currentUser.photoURL,
          }}
        />
      </View>
    );
  }
}
export default ChatRoom;
