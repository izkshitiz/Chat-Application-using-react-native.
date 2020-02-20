const initialState = {
  chatList: [],
  Chats: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_CHATLIST':
      return {
        ...state,
        chatList: action.chatList,
      };

    case 'SAVE_CHAT':
      return {
        ...state,
        Chats: action.chats,
      };
  }
  return state;
};

export default Reducer;
