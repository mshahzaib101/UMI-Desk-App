import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import img1 from "../images/4.jpg";
import "./stylePages.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import actionMain from "../store/actions";
import { Link } from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography component="div" role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
            <Box>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    textField: {
        display: "block",
        marginBottom: "15px"
    },
    textFieldInline: {
        display: "inline-block",
        width: "30%"
    },
    textFieldMargin: {
        marginRight: "5%"
    },
    submitbutton: {
        padding: "10px 30px 10px 30px"
    },
    loader: {
        marginLeft: "20px",
        marginTop: "20px"
    },
    textFieldInput: {
        backgroundColor: "white"
    },
    textFieldInput1: {
        backgroundColor: "white",
        paddingLeft: "5px",
        paddingRight: "5px"
    }
}));

function LoginPage(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [values, setValues] = React.useState({
        email: "",
        password: ""
    });
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [showLoader1, setShowLoader1] = React.useState(false);

    const postRequest = (url, data) => {
        return fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        }).then(response => response.json());
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    const FormHandleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    const validateEmail = email => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    const onsubmitCompany = () => {
        if (!validateEmail(values.email)) {
            setSnackText("Enter a Valid Email Address");
            SnackhandleClick();
        } else if (values.password.length < 6) {
            setSnackText("Password must be at least 6 characters");
            SnackhandleClick();
        } else {
            setShowLoader1(true);
            SnackhandleClose();
            let data = {
                email: values.email,
                password: values.password
            };
            postRequest("https://umidesk-api.herokuapp.com/api/auth/company/login ", data)
                .then(dataresponse => {
                    console.log("dataresponse", dataresponse);
                    if (dataresponse.message) {
                        setShowLoader1(false);
                        props.updatingUserInfo({
                            token: dataresponse.token,
                            email: values.email,
                            userLogedInAs: "company",
                            userLogedIn: true
                        });
                        props.history.push("/Register-User");
                    } else {
                        setShowLoader1(false);
                        setSnackText(dataresponse.error);
                        SnackhandleClick();
                    }
                })
                .catch(error => {
                    setShowLoader1(false);
                    setSnackText(error);
                    SnackhandleClick();
                });
        }
    };
    const onsubmitUser = () => {
        if (!validateEmail(values.email)) {
            setSnackText("Enter a Valid Email Address");
            SnackhandleClick();
        } else if (values.password.length < 6) {
            setSnackText("Password must be at least 6 characters");
            SnackhandleClick();
        } else {
            setShowLoader1(true);
            SnackhandleClose();
            let data = {
                email: values.email,
                password: values.password
            };
            postRequest("https://umidesk-api.herokuapp.com/api/auth/users/login", data)
                .then(dataresponse => {
                    console.log("user", dataresponse);
                    if (dataresponse.message) {
                        setShowLoader1(false);
                        props.updatingUserInfo({
                            token: dataresponse.token,
                            email: values.email,
                            userLogedInAs: "user",
                            userLogedIn: true
                        });
                        props.history.push("/Home-Page");
                    } else {
                        setShowLoader1(false);
                        setSnackText(dataresponse.error);
                        SnackhandleClick();
                    }
                })
                .catch(error => {
                    setShowLoader1(false);
                    setSnackText(error);
                    SnackhandleClick();
                });
        }
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

    return (
        <div className="ruser-con">
            <div className="signup-con">
                <div className="signup-c1">
                    <h1 className="headStyle1">Login</h1>
                    <p className="headp">
                        <span className="headpSpan">as</span>
                    </p>
                    <div className="form form2">
                        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="full width tabs example">
                            <Tab label="Company" {...a11yProps(0)} />
                            <Tab label="User" {...a11yProps(1)} />
                        </Tabs>
                        <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}>
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                {/* //company login */}

                                <div style={{ padding: "30px 0px 20px 0px" }}>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        className={classes.textField}
                                        value={values.email}
                                        onChange={FormHandleChange("email")}
                                        fullWidth
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.textFieldInput
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
                                        onChange={FormHandleChange("password")}
                                        fullWidth
                                        type="password"
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.textFieldInput
                                            }
                                        }}
                                        variant="outlined"
                                    />
                                    {showLoader1 === false && (
                                        <div className="loadercon">
                                            <Button color="primary" variant="outlined" className={classes.submitbutton} onClick={onsubmitCompany}>
                                                Login
                                            </Button>
                                            <Link to="/Register-Company">
                                                {" "}
                                                <span className="registerOpt">Register Your Company</span>
                                            </Link>
                                        </div>
                                    )}
                                    {showLoader1 === true && (
                                        <div className="loadercon">
                                            <CircularProgress size={40} className={classes.loader} />
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1} dir={theme.direction}>
                                {/* //user login */}

                                <div style={{ padding: "30px 0px 20px 0px" }}>
                                    <TextField
                                        id="email1"
                                        label="Email"
                                        className={classes.textField}
                                        value={values.email}
                                        onChange={FormHandleChange("email")}
                                        fullWidth
                                        type="email"
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.textFieldInput1
                                            }
                                        }}
                                        variant="outlined"
                                    />

                                    <TextField
                                        id="password1"
                                        label="Password"
                                        className={classes.textField}
                                        value={values.password}
                                        onChange={FormHandleChange("password")}
                                        fullWidth
                                        type="password"
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.textFieldInput1
                                            }
                                        }}
                                        variant="outlined"
                                    />
                                    {showLoader1 === false && (
                                        <div className="loadercon">
                                            <Button color="primary" variant="outlined" className={classes.submitbutton} onClick={onsubmitUser}>
                                                Login
                                            </Button>
                                        </div>
                                    )}
                                    {showLoader1 === true && (
                                        <div className="loadercon">
                                            <CircularProgress size={40} className={classes.loader} />
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                        </SwipeableViews>
                    </div>
                </div>
                <div className="signup-c2" style={{ backgroundImage: `url(${img1})` }}></div>
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
        </div>
    );
}

// Mapping the component's property to Redux's state
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
)(LoginPage);
