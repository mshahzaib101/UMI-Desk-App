import React, { useState } from "react";
import "./stylePages.css";
import img1 from "../images/4.jpg";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

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
        padding: "10px 30px"
    },
    loader: {
        marginLeft: "20px",
        marginTop: "20px"
    }
}));

function RegisterCompanyPage(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        companyName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        email: "",
        password: ""
    });
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [showLoader1, setShowLoader1] = React.useState(false);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    const validateEmail = email => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    const onsubmitFunc = () => {
        if (values.companyName.length === 0) {
            setSnackText("Enter Company Name");
            SnackhandleClick();
        } else if (values.address.length === 0) {
            setSnackText("Enter Company Address");
            SnackhandleClick();
        } else if (values.city.length === 0) {
            setSnackText("Enter City Name");
            SnackhandleClick();
        } else if (values.state.length === 0) {
            setSnackText("Enter State Name");
            SnackhandleClick();
        } else if (values.zipCode.length === 0) {
            setSnackText("Enter Zipcode");
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
                name: values.companyName,
                address: values.address,
                city: values.city,
                state: values.state,
                zipcode: values.zipCode,
                email: values.email,
                password: values.password
            };
            postRequest(
                "https://umidesk-api.herokuapp.com/api/auth/company/register",
                data
            )
                .then(dataresponse => {
                    console.log(dataresponse);
                    setShowLoader1(false);
                    if (dataresponse.token) {
                        setSnackText("Company Registered");
                        SnackhandleClick();
                        setTimeout(() => {
                            props.history.push("/Login");
                        }, 1000);
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
            headers: { "Content-Type": "application/json" },
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

    return (
        <div className="ruser-con">
            <div className="signup-con">
                <div
                    className="signup-c2"
                    style={{ backgroundImage: `url(${img1})` }}
                ></div>
                <div className="signup-c1">
                    <h1 className="headStyle1">Company SignUp</h1>
                    <div className="form">
                        <TextField
                            id="companyName"
                            label="Company Name"
                            className={classes.textField}
                            value={values.companyName}
                            onChange={handleChange("companyName")}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="address"
                            label="Address"
                            className={classes.textField}
                            value={values.address}
                            onChange={handleChange("address")}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="city"
                            label="City"
                            className={clsx(
                                classes.textField,
                                classes.textFieldInline,
                                classes.textFieldMargin
                            )}
                            value={values.city}
                            onChange={handleChange("city")}
                            // fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="state"
                            label="State"
                            className={clsx(
                                classes.textField,
                                classes.textFieldInline,
                                classes.textFieldMargin
                            )}
                            value={values.state}
                            onChange={handleChange("state")}
                            // fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        <TextField
                            id="zipCode"
                            label="Zip Code"
                            className={clsx(
                                classes.textField,
                                classes.textFieldInline
                            )}
                            value={values.zipCode}
                            onChange={handleChange("zipCode")}
                            // fullWidth
                            InputProps={{
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            type="number"
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
                                classes: {
                                    input: classes.textFieldInput
                                }
                            }}
                            variant="outlined"
                        />
                        {showLoader1 === false && (
                            <div className="loadercon">
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    className={classes.submitbutton}
                                    onClick={onsubmitFunc}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                        {showLoader1 === true && (
                            <div className="loadercon">
                                <CircularProgress
                                    size={40}
                                    className={classes.loader}
                                />
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
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={SnackhandleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </div>
    );
}

export default RegisterCompanyPage;
