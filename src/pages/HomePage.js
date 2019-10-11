import React, { useState, useEffect } from "react";
import "./stylePages2.css";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import actionMain from "../store/actions";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
import HomeNavBar from "../Components/NavBar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Moment from "react-moment";

const useStyles = makeStyles(theme => ({
    diviver4: {
        marginBottom: "30px",
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            marginBottom: "15px"
        }
    },
    searchAvatar: {
        width: 50,
        height: 50
    },
    sidMenuIcon: {
        marginRight: 15
    },
    searchInput: {
        marginLeft: theme.spacing(1),
        flex: 1,
        width: "50vw",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "60vw"
        }
    },
    papersearch: {
        borderRadius: 90,
        padding: "5px 20px",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            padding: "2px 20px"
        },
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            padding: "1px 15px"
        }
    },
    iconButton: {
        padding: 10
    },
    paperAnswersBox: {
        padding: "14px 20px",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            padding: "8px 15px"
        },
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            padding: "5px 10px"
        }
    },
    appBar: {
        boxShadow: "none",
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff"
    },
    pagsButton: {
        padding: "10px",
        margin: "0px",
        marginRight: "5px",
        fontSize: "16px"
    }
}));
const override = css`
    display: block;
`;

function HomePage(props) {
    const classes = useStyles();
    const [searchValue, setSearchValue] = useState("");

    const [searchLoader, setsearchLoader] = useState("hidden");
    const [noansDisplay, setnoansDisplay] = useState("none");
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [questions, setQuestions] = React.useState([]);
    const [searchLoad, setSearchLoad] = React.useState(true);
    const [pageCount, setpageCount] = React.useState([]);
    const [currentPage, setcurrentPage] = React.useState(1);
    const [pagDisplay, setpagDisplay] = useState("none");
    const [dataChanged, setdataChanged] = useState(false);
    const [pagLoader, setpagLoader] = useState("hidden");

    useEffect(() => {
        if (props.userInfo.userLogedIn === false) {
            props.history.push("/");
        }
    }, []);
    useEffect(() => {
        fetchSearchData(1, false);
    }, []);
    useEffect(() => {
        if (dataChanged === true) {
            searchQs();
            setpagLoader("hidden");
        }
    }, [dataChanged]);

    const fetchSearchData = (page, callSearchFunc) => {
        if (callSearchFunc === true) {
            setdataChanged(false);
        } else {
            setsearchLoader("visible");
        }
        //fetching Questions
        var oldQuestionState = [];
        getRequest(`https://umidesk-api.herokuapp.com/api/questions/all?page=${page}`)
            .then(dataresponse => {
                if (dataresponse.questions) {
                    let i;
                    let pagarray = [];
                    for (i = 1; i <= dataresponse.pageCount; i++) {
                        if (i === dataresponse.page) {
                            pagarray.push(1);
                        } else {
                            pagarray.push(0);
                        }
                    }
                    setpageCount([...pagarray]);
                    setcurrentPage(dataresponse.page);
                }

                let totalQuestions = dataresponse.questions.length;
                let ansCount = 0;
                dataresponse.questions.map((data, index) => {
                    var newObj = {};
                    newObj = data;
                    newObj.display = "none";

                    //getting answers
                    var ansReq = getRequest(`https://umidesk-api.herokuapp.com/api/questions/${newObj.id}`).then(ansresponse => {
                        if (ansresponse.length > 0) {
                            let answersArray = [];
                            ansresponse.map((data2, index2) => {
                                answersArray.push(data2.answers);
                            });

                            return answersArray;
                        } else {
                            return [];
                        }
                    });
                    ansReq.then((res, indx) => {
                        ansCount = ansCount + 1;
                        newObj.answers = res;
                        oldQuestionState.push(newObj);

                        if (totalQuestions === ansCount) {
                            //last Ans
                            setsearchLoader("hidden");
                            setSearchLoad(false);
                            setQuestions([...oldQuestionState]);
                            if (callSearchFunc === true) {
                                setdataChanged(true);
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.log("error", error);
                setSearchLoad(false);
            });
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

    const inputHandleChange = event => {
        setSearchValue(event.target.value);
    };
    const _handleKeyDown = e => {
        if (e.key === "Enter") {
            searchQs();
        }
    };

    const searchQs = () => {
        if (searchValue === "") {
            setSnackText("Enter Question");
            SnackhandleClick();
        } else {
            setsearchLoader("visible");
            setnoansDisplay("flex");
            setpagDisplay("block");
            //auto suggestion
            var oldQuestionState = questions;
            console.log("data", oldQuestionState);
            questions.map((data, index) => {
                let currentQs = data.questions;
                if (currentQs.indexOf(searchValue) !== -1) {
                    oldQuestionState[index].display = "block";
                } else {
                    oldQuestionState[index].display = "none";
                }
                setQuestions([...oldQuestionState]);
            });
            setTimeout(() => {
                setsearchLoader("hidden");
            }, 600);
        }
    };

    const getRequest = url => {
        return fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: { Authorization: props.userInfo.token, "Content-Type": "application/json" },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(response => response.json());
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

    const submitQuestion = () => {
        setsearchLoader("visible");

        let data = {
            questions: searchValue
        };
        postRequest("https://umidesk-api.herokuapp.com/api/questions/all", data)
            .then(dataresponse => {
                if (dataresponse.command === "INSERT") {
                    setSnackText("Question Submitted ");
                    SnackhandleClick();
                    window.setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                setsearchLoader("hidden");
            })
            .catch(error => {
                console.log("error", error);
                setSnackText(error);
                SnackhandleClick();
                setsearchLoader("hidden");
            });
    };

    const pagClicked = page => {
        fetchSearchData(page, true);
        setpagLoader("visible");
    };

    return (
        <div>
            <AppBar className={classes.appBar}>
                <div style={{ display: "block" }}>
                    <HomeNavBar history={props.history} />
                </div>
            </AppBar>
            {/* //search bar */}
            <div className="companyLogo">
                <img className="avgImg" alt="company logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRYtpMci9uacnpn0SDZCxFeUXZuqBEtYVy9_5aNKaojw-PlobcV" />
            </div>
            <div className="searchCon">
                <Paper className={classes.papersearch}>
                    <InputBase disabled={searchLoad} onKeyDown={_handleKeyDown} onChange={inputHandleChange} value={searchValue} className={classes.searchInput} placeholder="Ask your question" inputProps={{ "aria-label": "Ask your question" }} />
                    <IconButton
                        onClick={() => {
                            searchQs();
                        }}
                        className={classes.iconButton}
                        aria-label="search"
                        disabled={searchLoad}
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            <div className="searchloaderCon" style={{ visibility: searchLoader }}>
                <BeatLoader css={override} sizeUnit={"px"} size={12} color={"#447DC1"} loading={true} />
            </div>
            {/* //search results */}
            <div className="searchResultsCon">
                <div className="noAnswerCon" style={{ display: noansDisplay }}>
                    <span className="noAnswerContext">No Answers?</span>
                    <Button onClick={submitQuestion} color="primary" variant="outlined">
                        submit question
                    </Button>
                </div>
                <div style={{ display: noansDisplay }}>
                    <Divider className={classes.diviver4} />
                </div>
                {questions.map((data, index) => {
                    return (
                        <div style={{ display: data.display }} className="searchResults" key={index + 0.9}>
                            <Paper className={classes.paperAnswersBox}>
                                <h2 className="answerText">
                                    <span className="Qicon">A</span>
                                    {data.answers && (
                                        <span className="ansTextCon">
                                            {data.answers.length > 0 &&
                                                data.answers.map((a, b) => {
                                                    return <span key={b + 0.2} className="ansText" dangerouslySetInnerHTML={{ __html: a }}></span>;
                                                })}
                                            {data.answers.length === 0 && <span className="ansText" dangerouslySetInnerHTML={{ __html: "no answers" }}></span>}
                                        </span>
                                    )}
                                </h2>
                                <div className="questionFromBox">
                                    <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.searchAvatar} />
                                    <div className="ansFrom">
                                        Rosa Gonzal | Admin Respondet
                                        <p className="dateText">
                                            {" "}
                                            <Moment format="MMMM DD, YYYY LT">{data.created_at}</Moment>
                                        </p>
                                    </div>
                                </div>
                                <h3 className="questionText">
                                    <span className="Qicon">Q</span>
                                    <div style={{ display: "inline-block" }} dangerouslySetInnerHTML={{ __html: data.questions }} />
                                </h3>
                            </Paper>
                        </div>
                    );
                })}
            </div>
            {/* //pagination */}
            <div className="pagCon1" style={{ display: pagDisplay }}>
                Page:
                <div className="pagCon">
                    {pageCount.map((a, b) => {
                        return (
                            <IconButton onClick={() => pagClicked(b + 1)} key={"pag" + b} color={a === 1 ? "primary" : "inherit"} className={classes.pagsButton}>
                                {b + 1}
                            </IconButton>
                        );
                    })}
                </div>
                <div className="searchloaderCon" style={{ visibility: pagLoader }}>
                    <BeatLoader css={override} sizeUnit={"px"} size={12} color={"#447DC1"} loading={true} />
                </div>
            </div>
            <div className={(pagDisplay === 'block' ? "paraText bd6 otherpagesFooter1" : " paraText bd6 otherpagesFooter2")}>
                <p>Copyright © 2019 UmiDesk Inc. All rights reserved. </p>
            </div>
            {/* extras */}
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
)(HomePage);
