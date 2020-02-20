const initialState = {
  email: '',
  password: '',
  loggedIn: null,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'EMAIL_PASSWORD':
      return {
        ...state,
        email: action.email,
        password: action.pass,
      };
    case 'PASSWORD':
      return {
        ...state,
      };
    case 'USER_STATE':
      return {
        ...state,
        loggedIn: action.userstate,
      };
  }
  return state;
};

export default Reducer;
