import React, { useEffect } from "react";
import clsx from "clsx";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";
import { connect } from "react-redux";
import actionMain from "../store/actions";
import Img1 from "../images/3.jpg";
import Img2 from "../images/4.jpg";
import Img3 from "../images/2.jpg";
import Img4 from "../images/5.jpg";
import Img5 from "../images/1.jpg";
import "./stylePages.css";

import * as Scroll from "react-scroll";
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from "react-scroll";

import "./stylePages.css";
const useStyles = makeStyles(theme => ({
    NavButton: {
        fontFamily: "proxima-n-w01-reg,sans-serif",
        textTransform: "none",
        color: "#414141",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "-0.5px",
        marginRight: "10px"
    },
    listNavBtn: {
        fontFamily: "proxima-n-w01-reg,sans-serif",
        textTransform: "none",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "-0.5px",
        color: "#414141",
        width: "100%",
        marginBottom: "10px"
    },
    navbtn2: {
        fontFamily: "proxima-n-w01-reg,sans-serif",
        textTransform: "none",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "-0.5px",
        borderRadius: "0px",
        borderColor: "#999997",
        paddingLeft: "15px",
        paddingRight: "15px"
    },
    tryBtn: {
        fontFamily: "proxima-n-w01-reg,sans-serif",
        textTransform: "none",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "-0.5px",
        borderColor: "#999997",
        margin: "5px auto",
        paddingLeft: "20px",
        paddingRight: "20px",
        display: "block",
        [theme.breakpoints.down("sm")]: {
            fontSize: "15px"
        }
    }
}));
const ColorButton = withStyles(theme => ({
    root: {
        color: "#414141",
        "&:hover": {
            color: "#ffffff",
            backgroundColor: "#bfe5fb",
            borderColor: "#bfe5fb"
        }
    }
}))(Button);
const clickedFunc = to => {
    scroller.scrollTo(to, { duration: 500, offset: -100, smooth: true });
};
function LandingPage(props) {
    const classes = useStyles();
    const [drawerstate, setdrawerstate] = React.useState({
        left: false
    });
    const toggleDrawer = open => event => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        setdrawerstate({ left: open });
    };
    useEffect(() => {
        let userData = localStorage.getItem("UmiDeskAuthorization1.1");
        let data = JSON.parse(userData)

        if (data !== null) {
            data.userLogedIn = true
            props.updatingUserInfo(data);

        }
    }, []);
    return (
        <div>
            <div className="navBar">
                <div className="navImgCon">
                    <img className="navImg" alt="UmiDesk" src="https://static.wixstatic.com/media/9359a5_c2f65aacf2da4f14a511f16a60329be7~mv2.jpg/v1/fill/w_234,h_60,al_c,q_80,usm_0.66_1.00_0.01/UmiDesk%20%26%20Logo%20HD_JPG.webp" />
                </div>
                <div className="pgNaviDiv">
                    <Button className={clsx(classes.NavButton)}>
                        <Link to="about" smooth={true} offset={-100} duration={500}>
                            About
                        </Link>
                    </Button>
                    <Button className={clsx(classes.NavButton)}>
                        <Link to="pricing" smooth={true} offset={-100} duration={500}>
                            Pricing
                        </Link>
                    </Button>
                </div>
                {props.userInfo.userLogedIn === false && (
                    <div className="loginDiv">
                        <Button
                            className={clsx(classes.NavButton)}
                            onClick={() => {
                                props.history.push("/Login");
                            }}
                        >
                            Sign in
                        </Button>
                        <ColorButton
                            variant="outlined"
                            className={clsx(classes.navbtn2)}
                            onClick={() => {
                                props.history.push("/Register-Company");
                            }}
                        >
                            Sign up
                        </ColorButton>
                    </div>
                )}
                {props.userInfo.userLogedIn === true && props.userInfo.userLogedInAs === "company" && (
                    <div className="loginDiv">
                        <Button
                            className={clsx(classes.NavButton)}
                            onClick={() => {
                                props.history.push("/Home-Page");
                            }}
                        >
                            Ask Questions
                        </Button>
                        <Button
                            className={clsx(classes.NavButton)}
                            onClick={() => {
                                props.history.push("/Register-User");
                            }}
                        >
                            Register User
                        </Button>
                        <ColorButton
                            variant="outlined"
                            className={clsx(classes.navbtn2)}
                            onClick={() => {
                                props.updatingUserInfo({
                                    token: "",
                                    email: "",
                                    userLogedInAs: "",
                                    userLogedIn: false
                                });
                            }}
                        >
                            Log out
                        </ColorButton>
                    </div>
                )}
                {console.log(props.userInfo)}
                {props.userInfo.userLogedIn === true && props.userInfo.userLogedInAs === "user" && (
                    <div className="loginDiv">
                        <Button
                            className={clsx(classes.NavButton)}
                            onClick={() => {
                                props.history.push("/Home-Page");
                            }}
                        >
                            Ask Questions
                        </Button>
                        <ColorButton
                            variant="outlined"
                            className={clsx(classes.navbtn2)}
                            onClick={() => {
                                props.updatingUserInfo({
                                    token: "",
                                    email: "",
                                    userLogedInAs: "",
                                    userLogedIn: false
                                });
                            }}
                        >
                            Log out
                        </ColorButton>
                    </div>
                )}

                <div className="loginDivMob">
                    <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>
            <div className="divider1">
                <Divider />
            </div>
            <Drawer open={drawerstate.left} onClose={toggleDrawer(false)}>
                <div className="drawerCon" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <List>
                        <ListItem onClick={() => clickedFunc("about")} button className={classes.listNavBtn}>
                            About
                        </ListItem>
                        <ListItem onClick={() => clickedFunc("pricing")} button className={classes.listNavBtn}>
                            Pricing
                        </ListItem>
                        {props.userInfo.userLogedIn === false && (
                            <ListItem
                                onClick={() => {
                                    props.history.push("/Login");
                                }}
                                button
                                className={classes.listNavBtn}
                            >
                                Sign in
                            </ListItem>
                        )}
                        {props.userInfo.userLogedIn === false && (
                            <ListItem
                                onClick={() => {
                                    props.history.push("/Register-Company");
                                }}
                                button
                                className={classes.listNavBtn}
                            >
                                Sign up
                            </ListItem>
                        )}
                        {props.userInfo.userLogedIn === true && props.userInfo.userLogedInAs === "company" && (
                            <ListItem
                                onClick={() => {
                                    props.history.push("/Register-User");
                                }}
                                button
                                className={classes.listNavBtn}
                            >
                                Register User
                            </ListItem>
                        )}
                         {props.userInfo.userLogedIn === true && (
                        <ListItem
                            button
                            className={classes.listNavBtn}
                            onClick={() => {
                                props.history.push("/Home-Page");
                            }}
                        >
                            Ask Questions
                        </ListItem>
                        )}
                        {props.userInfo.userLogedIn === true && (
                            <ListItem
                                button
                                className={classes.listNavBtn}
                                onClick={() => {
                                    props.updatingUserInfo({
                                        token: "",
                                        email: "",
                                        userLogedInAs: "",
                                        userLogedIn: false
                                    });
                                }}
                            >
                                Log out
                            </ListItem>
                        )}
                       
                    </List>
                </div>
            </Drawer>
            {/* //nav end */}
            <div>
                <h1 className="headText bh1">
                    Need answers at work, about <br />
                    work?
                </h1>
                <h3 className="paraText bh3">Use A Search Engine About Your Company</h3>
                <div className="paraText bd1">
                    <div className="bd1-1">
                        <div className="searchBox">Search</div>
                        <div className="searchItems">
                            <p>How often do I order office supplies?</p>
                            <p>What filing system do we use?</p>
                            <p>Do I turn the lights off when I leave?</p>
                        </div>
                    </div>
                    <div className="bd1-2">
                        <img src={Img1} className="bd2img" />
                    </div>
                </div>
                <Element name="about">
                    <div className="paraText bd2">
                        <div className="bd2-1">
                            <h2 className="headText headText1">About</h2>
                            <p>UmiDesk was invented to stop the repetition of asking the same questions at work that others have already asked. When you need an answer to a work question, ask it through Umi, let your office manager answer it, and your whole office use it!</p>
                        </div>
                        <div className="bd2-2">
                            <img className="bd2img" src={Img2} />
                        </div>
                    </div>
                </Element>
                <div className="paraText bd2 bd3">
                    <div className="bd2-2 ">
                        <img className="bd2img" src={Img3} />
                    </div>
                    <div className="bd2-1 bd3-2">
                        <h2 className="headText headText1">Onboarding Win</h2>
                        <p>Around 25% of companies spend less than one-day onboarding a new hire. The reason is often cost. People learn by repetition, which takes time and money. With UmiDesk, your database gives new hires all of the answers they need to do their job on day one.</p>
                    </div>
                </div>
                <div className="paraText bd2 bd4">
                    <div className="bd2-1 bd3-2">
                        <h2 className="headText headText1">Uses</h2>
                        <ul>
                            <li>Understanding employee learning expectations and training goals.</li>
                            <li>Onboarding new employees faster and more cost effectively.</li>
                            <li>Provide and access answers on the go with mobile.</li>
                            <li>Building a custom search engine and AI platform for employee's questions and answers.</li>
                        </ul>
                    </div>
                    <div className="bd2-2">
                        <img className="bd2img" src={Img4} />
                    </div>
                </div>
                <Element name="pricing">
                    <div className=" paraText bd2 bd5">
                        <h2 className="headText headText1 bd5-h1">Pricing</h2>
                        <div className="bd5-5">
                            <div className="bd5-1">
                                <h2 className="headText headText1 headText2 ">1 month free trial on all plans</h2>
                                <h3 className="headText headText1 bd5-3">Standard</h3>
                                <p className=" headText1 headText3">$9.99/user</p>
                                <ul className="paraText1 costUl ">
                                    <li>Unlimited users.</li>
                                    <li>Custom search engine.</li>
                                    <li>Contacts</li>
                                    <li>Mobile integration.</li>
                                </ul>
                                <Button variant="outlined" className={clsx(classes.tryBtn)}>
                                    Try Free
                                </Button>
                            </div>
                            <div className="bd5-2" style={{ backgroundImage: `url(${Img5})` }}></div>
                        </div>
                    </div>
                </Element>
                <div className=" paraText bd6">
                    <p>Copyright © 2019 UmiDesk Inc. All rights reserved. </p>
                </div>
            </div>
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
)(LandingPage);
