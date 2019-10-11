import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import NotifyIcon from "@material-ui/icons/Notifications";
import ContactIcon from "@material-ui/icons/PhoneRounded";
import MenuArrowIcon from "@material-ui/icons/KeyboardArrowDown";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import { Divider } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import SettingsIcon from "@material-ui/icons/Settings";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import ResetIcon from "@material-ui/icons/Restore";
import "../pages/./stylePages2.css";
import { connect } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import actionMain from "../store/actions";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
    topIbtn: {
        marginRight: "0px"
    },
    navAvatar: {
        marginLeft: 10,
        width: 50,
        height: 50
    },
    searchAvatar: {
        width: 50,
        height: 50
    },
    topButtonIbtnDown: {
        color: "rgba(0, 0, 0, 0.54)",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "16px"
    },
    listNavBtn: {
        fontFamily: "proxima-n-w01-reg,sans-serif",
        textTransform: "none",
        fontSize: "18px",
        fontWeight: "bold",
        letterSpacing: "-0.5px",
        color: "rgba(0, 0, 0, 0.54)",
        width: "100%",
        marginBottom: "10px"
    },
    sidMenuIcon: {
        marginRight: 15
    },
    divider3: {
        marginBottom: "30px"
    },
    sidMenuIcon1: {
        marginRight: 5
    },
    resetdialogCon: {
        marginTop: "-10px"
    },
    resetdialogTextField: {
        width: "100%"
    }
}));

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5"
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center"
        }}
        {...props}
    />
));

function HomeNavBar(props) {
    const classes = useStyles();
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const SnackhandleClick = () => {
        setOpenSnack(true);
    };
    const SnackhandleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnack(false);
    };
    const [drawerstate, setdrawerstate] = useState({
        left: false
    });
    const [navMenuAnchorEl, setNavMenuAnchorEl] = useState(null);
    const [resetPass, setResetPass] = useState("");

    const logOutUser = () => {
        props.updatingUserInfo({
            token: "",
            email: "",
            userLogedInAs: "",
            userLogedIn: false
        });
        navMenuHandleClose();
        props.history.push("/");
    };
    const toggleDrawer = open => event => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        setdrawerstate({ left: open });
    };
    const navMenuHandleClick = event => {
        setNavMenuAnchorEl(event.currentTarget);
    };
    const resetHandler = event => {
        setResetPass(event.target.value);
    };
    const navMenuHandleClose = () => {
        setNavMenuAnchorEl(null);
    };
    const [opendialog, setOpendialog] = React.useState(false);

    const handleClickOpenDialog = () => {
        setOpendialog(true);
    };

    const validateEmail = email => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const postRequest = (url, data) => {
        return fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                Authorization: props.userInfo.token,
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        }).then(response => response.json());
    };

    const ResetPassword = () => {
        if (!validateEmail(resetPass)) {
            setSnackText("Enter a Valid Email Address");
            SnackhandleClick();
        } else {
            let data = {
                email: resetPass
            };
            postRequest("https://umidesk-api.herokuapp.com/api/auth/users/reset", data)
                .then(dataresponse => {
                    if (dataresponse.accepted) {
                        setSnackText("A verification email has been sent to you!");
                        SnackhandleClick();
                        handleCloseDialog();
                    } else {
                        setSnackText(dataresponse.Error);
                        SnackhandleClick();
                    }
                    console.log("res", dataresponse);
                })
                .catch(error => {
                    console.log("error", error);
                });
        }
    };

    const handleCloseDialog = () => {
        setOpendialog(false);
    };
    return (
        <div>
            <div className="HomeNav">
                <div className="homnavImg" onClick={() => props.history.push("/Home-Page")}>
                    <img className="avgImg" alt="UmiDesk" src="https://static.wixstatic.com/media/9359a5_c2f65aacf2da4f14a511f16a60329be7~mv2.jpg/v1/fill/w_234,h_60,al_c,q_80,usm_0.66_1.00_0.01/UmiDesk%20%26%20Logo%20HD_JPG.webp" />
                </div>
                <div className="hom-nav-icons">
                    <IconButton onClick={() => props.history.push("/Notifications")} className={classes.topIbtn} aria-label="notifications" className={classes.margin}>
                        <NotifyIcon />
                    </IconButton>
                    <IconButton onClick={() => props.history.push("/Contacts")} aria-label="contact" className={classes.topIbtn} className={classes.margin}>
                        <ContactIcon />
                    </IconButton>
                    <Button className={classes.topButtonIbtnDown} onClick={navMenuHandleClick}>
                        Kyle Kelly
                        <MenuArrowIcon />
                    </Button>
                    <Avatar onClick={() => props.history.push("/Home-Page")} alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.navAvatar} />
                </div>
                <div className="hom-nav-icons-Mobile">
                    <IconButton onClick={toggleDrawer(true)} className={classes.topIbtn} aria-label="notifications">
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>
            <div className="divider2">
                <Divider />
            </div>

            {/* //extras */}
            <StyledMenu id="userInfo-menu" anchorEl={navMenuAnchorEl} keepMounted open={Boolean(navMenuAnchorEl)} onClose={navMenuHandleClose}>
                <MenuItem onClick={navMenuHandleClose}>
                    <SettingsIcon className={classes.sidMenuIcon1} />
                    Settings
                </MenuItem>
                <MenuItem onClick={handleClickOpenDialog}>
                    <ResetIcon className={classes.sidMenuIcon1} />
                    Reset Password
                </MenuItem>
                <MenuItem onClick={logOutUser}>
                    <LogoutIcon className={classes.sidMenuIcon1} />
                    Log Out
                </MenuItem>
            </StyledMenu>
            <Drawer open={drawerstate.left} onClose={toggleDrawer(false)}>
                <div className="homedrawerCon" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <List>
                        <div className="mobile-nav">
                            <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" onClick={() => props.history.push("/Home-Page")} className={classes.navAvatar} />
                            <span className="mobile-nav-text"> Kyle Kelly</span>
                        </div>
                        <Divider className={classes.divider3} />
                        <ListItem button className={classes.listNavBtn} onClick={() => props.history.push("/Notifications")}>
                            <NotifyIcon className={classes.sidMenuIcon} /> Notifications
                        </ListItem>
                        <ListItem onClick={() => props.history.push("/Contacts")} button className={classes.listNavBtn}>
                            <ContactIcon className={classes.sidMenuIcon} /> Contacts
                        </ListItem>
                        <ListItem button className={classes.listNavBtn}>
                            <SettingsIcon className={classes.sidMenuIcon} /> Settings
                        </ListItem>
                        <ListItem onClick={handleClickOpenDialog} button className={classes.listNavBtn}>
                            <LogoutIcon className={classes.sidMenuIcon} /> Reset Password
                        </ListItem>
                        <ListItem onClick={logOutUser} button className={classes.listNavBtn}>
                            <LogoutIcon className={classes.sidMenuIcon} /> Log Out
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                open={openSnack}
                autoHideDuration={4000}
                onClose={SnackhandleClose}
                ContentProps={{
                    "aria-describedby": "message-id"
                }}
                message={<span id="message-id">{snackText}</span>}
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" className={classes.close} onClick={SnackhandleClose}>
                        <CloseIcon />
                    </IconButton>
                ]}
            />

            <Dialog open={opendialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <div className="resetDialogCon">
                    <DialogTitle id="form-dialog-title"> Reset Password</DialogTitle>
                    <DialogContent className={classes.resetdialogCon}>
                        <TextField autoFocus id="name" label="Email Address" type="email" className={classes.resetdialogTextField} value={resetPass} onChange={resetHandler} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={ResetPassword} color="primary">
                            Reset
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
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
)(HomeNavBar);
