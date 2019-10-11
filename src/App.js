import React, { useEffect } from "react";
import { Route, Router } from "react-router-dom";
import RegisterUserPage from "./pages/Register-User";
import RegisterCompanyPage from "./pages/Register-Company";
import LoginPage from "./pages/login";
import history from "./history"; //a seprate history file
import LandingPage from "./pages/landingPage";
import HomePage from "./pages/HomePage";
import { connect } from "react-redux";
import actionMain from "./store/actions";
import NotificationsPage from './pages/Notifications';
import ContactsPage from './pages/Contacts';
import ResetPassword from './pages/passwordReset'
class AppRoutes extends React.Component {
    componentWillMount() {
        let userData = localStorage.getItem("UmiDeskAuthorization1.1");
        let data = JSON.parse(userData)
        if (data !== null) {
            data.userLogedIn = true
            this.props.updatingUserInfo(data);
        }
    }
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/Register-User" component={RegisterUserPage} />
                    <Route exact path="/Login" component={LoginPage} />
                    <Route exact path="/Register-Company" component={RegisterCompanyPage} />
                    <Route exact path="/Home-Page" component={HomePage} />
                    <Route exact path="/Contacts" component={ContactsPage} />
                    <Route exact path="/Notifications" component={NotificationsPage} />
                    <Route exact path="/reset/:token" component={ResetPassword} />

                </div>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.User_Login_Updater
    };
}
function mapDispatchToProps(dispatch) {
    return {
        updatingUserInfo: function(data) {
            dispatch(actionMain.user_loged_in_meh(data));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppRoutes);
