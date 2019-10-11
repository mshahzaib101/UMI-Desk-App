import React, { useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import "./stylePages.css";
import Button from "@material-ui/core/Button";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
import { timeout } from "q";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const override = css`
    display: block;
`;
const useStyles = makeStyles(theme => ({
    resetTextField: {
        width: "70%",
        marginTop: "20px",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%"
        }
    }
}));
function ResetPassword(props) {
    const classes = useStyles();

    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [tokenValid, setTokenValid] = React.useState(false);
    const [userEmail, setuserEmail] = React.useState("");
    const [resetPass, setresetPass] = React.useState("");
    const [showLoader, setshowLoader] = React.useState(false);

    const SnackhandleClick = () => {
        setOpenSnack(true);
    };
    const SnackhandleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnack(false);
    };
    const resetHandler = event => {
        setresetPass(event.target.value);
    };
    useEffect(() => {
        getRequest(`https://umidesk-api.herokuapp.com/api/questions/reset`)
            .then(dataresponse => {
                console.log(dataresponse);

                if (dataresponse.message === "link is a ok") {
                    setTokenValid(true);
                    setuserEmail(dataresponse.users_email);
                } else {
                    setTokenValid(false);
                }
            })
            .catch(error => {
                console.log("error", error);
            });
    }, []);

    const getRequest = url => {
        return fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: { Authorization: props.match.params.token, "Content-Type": "application/json" },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(response => response.json());
    };

    const putRequest = (url, data) => {
        return fetch(url, {
            method: "PUT",
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(data)
        }).then(response => response.json());
    };

    const ResetPass = () => {
        if (resetPass.length < 6) {
            setSnackText("Password must be at least 6 characters");
            SnackhandleClick();
        } else {
            setshowLoader(true);
            let data = {
                email: userEmail,
                password: resetPass
            };
            putRequest(`https://umidesk-api.herokuapp.com/api/auth/users`, data)
                .then(dataresponse => {
                    console.log(dataresponse);
                    if (dataresponse.message === "Password updated successfully") {
                        setSnackText(dataresponse.message);
                        SnackhandleClick();
                        window.setTimeout(() => {
                            props.history.push("/Login");
                        }, 1000);
                    } else {
                        setSnackText(dataresponse.message);
                        SnackhandleClick();
                    }
                    setshowLoader(false);
                })
                .catch(error => {
                    console.log("error", error);
                });
        }
    };
    return (
        <div>
            {tokenValid === false && <div>Your Token has Expired please reset again</div>}
            {tokenValid === true && (
                <div>
                    <div className="resetpassImg">
                        <img className="avgImg" alt="UmiDesk" src="https://static.wixstatic.com/media/9359a5_c2f65aacf2da4f14a511f16a60329be7~mv2.jpg/v1/fill/w_234,h_60,al_c,q_80,usm_0.66_1.00_0.01/UmiDesk%20%26%20Logo%20HD_JPG.webp" />
                    </div>
                    <div className="resetPassCon">
                        Enter New Password for: {userEmail}
                        <TextField variant="outlined" id="name" label="New Password" className={classes.resetTextField} type="password" value={resetPass} onChange={resetHandler} />
                        <div className="resetcon2">
                            <Button onClick={ResetPass} color="primary">
                                Reset
                            </Button>
                            <BeatLoader css={override} sizeUnit={"px"} size={12} color={"#447DC1"} loading={showLoader} />
                        </div>
                    </div>
                </div>
            )}

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
                    <IconButton key="close" aria-label="close" color="inherit" onClick={SnackhandleClose}>
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </div>
    );
}

export default ResetPassword;
