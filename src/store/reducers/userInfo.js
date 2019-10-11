import actionMain from "../actions";

const INITIAL_STATE = {
    userLogedIn: false,
    userLogedInAs: "",
    token: "",
    email: ""
};

function User_Login_Updater(state = INITIAL_STATE, action){
    // console.log('user reducer',state)
    switch (action.type) {
        case actionMain.user_loged_in:
            if (action.payload.userLogedIn === true) {
                    let data = {
                        userLogedInAs: action.payload.userLogedInAs,
                        // userLogedIn: action.payload.userLogedIn,
                        token: action.payload.token,
                        // email: action.payload.email
                    };
                    localStorage.setItem("UmiDeskAuthorization1.1", JSON.stringify(data));
               // }
            } else {
                localStorage.removeItem("UmiDeskAuthorization1.1");
            }
            return Object.assign({}, state, {
                userLogedInAs: action.payload.userLogedInAs,
                userLogedIn: action.payload.userLogedIn,
                token: action.payload.token,
                email: action.payload.email
            });

        default:
            return state;
    }
}

export default User_Login_Updater;
