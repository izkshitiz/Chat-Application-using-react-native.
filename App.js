import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Block, Text} from 'galio-framework';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import {PersistGate} from 'redux-persist/integration/react';
import UserDataReducer from './Store/Reducer/UserDataReducer';
import GlobalDataReducer from './Store/Reducer/GlobalDataReducer';
import Wrapper from './src/Containers/Wrapper';

const rootReducer = combineReducers({
  GlobalDataReducer,
  UserDataReducer,
});

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const persistor = persistStore(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<Text>Rehydrating....</Text>}
          persistor={persistor}>
          <Block fluid style={styles.container}>
            <Wrapper />
          </Block>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//Chat Logo font - inkfree, Gradient - #e95656(left) to #ee2762
//Login Background Gradient #ee245f(top) to #f9bec8
