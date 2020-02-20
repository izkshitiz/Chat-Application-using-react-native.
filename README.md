# reactNativeFirebaseChatApp
 Chat Application react-native, firebase and redux.

## Made with
* Fireabse
* Redux
* [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat).

## Database Schema
* collection of 'users' - inside a document is created with user id of every user that signs up. This document further contains user info.

* collection of 'chats' - inside a document is created by combining user id's of participating users - this document contains userid's of both the users set to boolean true. This helps identify the active users of the this chat.

* collection of 'messages' inside every document of collection 'chats' - 'messages' collection will create document for each text users send.



## Screenshot

![Chat](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/chatone.png)

![Login](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/login.jpg)

![Chat](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/chatone.png)

![Logintwo](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/logintwo.jpg)

![logout](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/logout.jpg)

![User](https://raw.githubusercontent.com/th3knigh7/Chat-Application-using-react-native./master/assets/Screenshots/user.jpg)



## HOW TO USE
* Clone the Project.
* Place your google-services.json in android/app/
* Run npm install in root directory.
* Run npx react-native run-android.

##### To start a chat between users a document inside collection 'chats' needs to be created with value of respective users userid's set to true.