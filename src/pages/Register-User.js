import React, { useState, useEffect } from "react";
import "./stylePages.css";
import img1 from "../images/3.jpg";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import InputAdornment from "@material-ui/core/InputAdornment";
import Randomstring from 'randomstring' 
import HomeNavBar from "../Components/NavBar";

const useStyles = makeStyles(theme => ({
    textField: {
        display: "block",
        marginBottom: "15px",
        padding: 0
    },
    submitbutton: {
        padding: "10px 30px"
    },
    loader: {
        marginLeft: "20px",
        marginTop: "20px"
    },
    randomBtn: {
        textTransform: "none",
        fontSize: "10px",
        padding: "4px",
        lineHeight: 1.5
    }
}));

function RegisterUserPage(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [showLoader1, setShowLoader1] = React.useState(false);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    useEffect(() => {
        if (props.userInfo.userLogedIn === false || props.userInfo.userLogedInAs === "user") {
            props.history.push("/");
        }
    }, []);
    const validateEmail = email => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    const onsubmitFunc = () => {
        if (values.firstName.length === 0) {
            setSnackText("Enter First Name");
            SnackhandleClick();
        } else if (values.lastName.length === 0) {
            setSnackText("Enter Last Name");
            SnackhandleClick();
        } else if (!validateEmail(values.email)) {
            setSnackText("Enter a Valid Email Address");
            SnackhandleClick();
        } else if (values.password.length < 6) {
            setSnackText("Password must be at least 6 characters");
            SnackhandleClick();
        } else {
            setShowLoader1(true);
            let data = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                password: values.password
            };
            console.log("data", data);
            postRequest("https://umidesk-api.herokuapp.com/api/auth/users/register", data)
                .then(dataresponse => {
                    console.log(dataresponse, props.userInfo.token);
                    setShowLoader1(false);
                    if (dataresponse.token) {
                        setSnackText("User Created");
                        SnackhandleClick();
                    } else {
                        setSnackText(dataresponse.error.detail);
                        SnackhandleClick();
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    setShowLoader1(false);
                    setSnackText("error");
                    SnackhandleClick();
                });
        }
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

    const SnackhandleClick = () => {
        setOpenSnack(true);
    };

    const SnackhandleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnack(false);
    };

    const randomPassword = () => {
        setValues({ ...values, password: Randomstring.generate(6) });

    };

    return (
        <div>
            <HomeNavBar />
        <div className="ruser-con">
            <div className="signup-con">
                <div className="signup-c2" style={{ backgroundImage: `url(${img1})` }}></div>
                <div className="signup-c1">
                    <h1 className="headStyle">User SignUp</h1>
                    <div className="form">
                        <TextField
                            id="firstName"
                            label="First Name"
                            className={classes.textField}
                            value={values.firstName}
                            onChange={handleChange("firstName")}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="lastName"
                            label="Last Name"
                            className={classes.textField}
                            value={values.lastName}
                            onChange={handleChange("lastName")}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="email"
                            label="Email"
                            className={classes.textField}
                            value={values.email}
                            onChange={handleChange("email")}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                            type="email"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            className={classes.textField}
                            value={values.password}
                            onChange={handleChange("password")}
                            fullWidth
                            type="password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button color="primary" onClick={randomPassword} variant="outlined" className={classes.randomBtn}>
                                            Generate Password
                                        </Button>
                                    </InputAdornment>
                                ),
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        {showLoader1 === false && (
                            <div className="loadercon">
                                <Button color="primary" variant="outlined" className={classes.submitbutton} onClick={onsubmitFunc}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                        {showLoader1 === true && (
                            <div className="loadercon">
                                <CircularProgress size={40} className={classes.loader} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        </div></div>
    );
}

// Mapping the component's property to Redux's state
function mapStateToProps(state) {
    return {
        userInfo: state.User_Login_Updater
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterUserPage);
