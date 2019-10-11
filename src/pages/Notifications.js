import React, { useEffect } from "react";
import HomeNavBar from "../Components/NavBar";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Notify1Icon1 from "@material-ui/icons/NotificationsNone";
import Notify1Icon2 from "@material-ui/icons/NotificationsActive";
import Notify1Icon3 from "@material-ui/icons/NotificationsPaused";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import moment from "moment";
import "./stylePages2.css";

const drawerWidth = 240;
const oldActiveVals = [1, 0, 0];
const oldPags = [0, 0, 1];

const useStyles = makeStyles(theme => ({
    contactAvatar: {
        width: 50,
        height: 50
    },
    root: {
        display: "flex"
    },
    body: {
        backgroundColor: "#ffffff"
    },
    appBar: {
        boxShadow: "none",
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    MenuButton: {
        marginLeft: "300px",
        marginTop: "100px"
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        paddingTop: 200,
        zIndex:1

    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: 0,
        margin: 0,
        margin: "30px 30px 20px 30px",
        marginTop: "3%",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            margin: "60px 30px 20px 30px"
        },
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            margin: "40px 10px 30px 10px"
        }
    },
    buttonTab: {
        margin: "0px 5px 0px 5px"
    },
    activeMenu: {
        backgroundColor: "#00000014"
    },
    buttonTabActive: {
        backgroundColor: "#00000014"
    }
}));
function NotificationsPage(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setdrawerOpen] = React.useState(true);
    const [currentSideMenu, setCurrentSideMenu] = React.useState("All");
    const [activeSideMenu, setactiveSideMenu] = React.useState(oldActiveVals);
    const [PagsState, setPagsState] = React.useState(oldPags);
    const [notificationsData, setNotificationsData] = React.useState([]);

    const [state, setState] = React.useState({
        checkedA: false,
        checkedB: false,
        checkedF: false
    });

    useEffect(() => {
        if (props.userInfo.userLogedIn === false) {
            props.history.push("/");
        }
    }, []);

    useEffect(() => {
        //static company id
        getRequest(`https://umidesk-api.herokuapp.com/api/questions/users/answers/5`)
            .then(dataResponse => {
                console.log(dataResponse);
                dataResponse.map((a, b) => {
                    dataResponse[b].display = "block";
                });
                setNotificationsData([...dataResponse]);
            })
            .catch(error => {
                console.log("error", error);
            });
    }, []);

    const getRequest = url => {
        return fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: { Authorization: props.userInfo.token, "Content-Type": "application/json" },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(response => response.json());
    };

    const checkBoxHandleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    const handleDrawerClose = () => {
        setdrawerOpen(!drawerOpen);
    };
    useEffect(() => {
        var x = window.matchMedia("(max-width: 800px)");
        if (x.matches) {
            setdrawerOpen(false);
        }
    }, []);
    const sideMenuClicked = (text, index) => {
        const oldVals = [0, 0, 0];
        oldVals[index] = 1;
        setactiveSideMenu(oldVals);
        setCurrentSideMenu(text);
    };

    const pagChanged = index => {
        let oldPagss = [0, 0, 0];
        oldPagss[index] = 1;
        setPagsState([...oldPagss]);
        var oldNotificationsState = notificationsData;
        if (index === 0) {
            oldNotificationsState.map((data, index2) => {
                if (moment(data.created_at).format("MMM Do YY") === moment().format("MMM Do YY")) {
                    oldNotificationsState[index2].display = "block";
                } else {
                    oldNotificationsState[index2].display = "none";
                }
            });
        } else if (index === 1) {
            oldNotificationsState.map((data, index2) => {
                if ((moment().format("YY") === moment(data.created_at).format("YY") && moment().format("MMM") === moment(data.created_at).format("MMM") && moment().format("ww"), moment(data.created_at).format("ww"))) {
                    oldNotificationsState[index2].display = "block";
                } else {
                    oldNotificationsState[index2].display = "none";
                }
            });
        } else {
            oldNotificationsState.map((data, index2) => {
                oldNotificationsState[index2].display = "block";
            });
        }

        setNotificationsData([...oldNotificationsState]);
    };

    return (
        <div>
            <div className={classes.root}>
                {/* //top nav */}
                <AppBar className={clsx(classes.appBar)}>
                    <div style={{ display: "block" }}>
                        <HomeNavBar history={props.history} />
                    </div>
                </AppBar>
                {/* //drawer */}
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: drawerOpen,
                            [classes.drawerClose]: !drawerOpen
                        })
                    }}
                    open={drawerOpen}
                >
                    <div className="cDrawer">
                        <div className={classes.toolbar}>
                            <IconButton onClick={handleDrawerClose}>{drawerOpen === false ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                        </div>
                        <Divider />
                        <List>
                            {["All", "Urgent", "General"].map((text, index) => (
                                <ListItem
                                    className={clsx({
                                        [classes.activeMenu]: activeSideMenu[index]
                                    })}
                                    button
                                    key={text}
                                    onClick={() => sideMenuClicked(text, index)}
                                >
                                    <ListItemIcon>
                                        <span>
                                            {index === 0 && <Notify1Icon1 />}
                                            {index === 1 && <Notify1Icon2 />}
                                            {index === 2 && <Notify1Icon3 />}
                                        </span>
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
                {/* page content */}
                <div style={{width:'100%'}}>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {/* //top bar */}
                    <div className="tabsBtnCon">
                        <Button
                            className={clsx(classes.buttonTab, {
                                [classes.buttonTabActive]: PagsState[0]
                            })}
                            onClick={() => pagChanged(0)}
                        >
                            Today
                        </Button>
                        |
                        <Button
                            className={clsx(classes.buttonTab, {
                                [classes.buttonTabActive]: PagsState[1]
                            })}
                            onClick={() => pagChanged(1)}
                        >
                            This Week
                        </Button>
                        |
                        <Button
                            className={clsx(classes.buttonTab, {
                                [classes.buttonTabActive]: PagsState[2]
                            })}
                            onClick={() => pagChanged(2)}
                        >
                            All Time
                        </Button>
                    </div>
                    <Divider />
                    {currentSideMenu === "All" && (
                        //  {/* //notifications */}
                        <div className="allNotifis">
                            {notificationsData.map((data, index) => {
                                return (
                                    <div style={{ display: data.display }} key={`notiall-${index}`} className="notifiItemSizing">
                                        <Card>
                                            <div className="notifyItemCon">
                                                <div className="notifyItemCon1">
                                                    <h5>Sales</h5>
                                                    <p className="notifyItemCon1" dangerouslySetInnerHTML={{ __html: data.answers }} />
                                                </div>
                                                <Checkbox
                                                    checked={state.checkedB}
                                                    onChange={checkBoxHandleChange("checkedB")}
                                                    value="checkedB"
                                                    color="primary"
                                                    inputProps={{
                                                        "aria-label": "secondary checkbox"
                                                    }}
                                                />
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {currentSideMenu === "Urgent" && (
                        //  {/* // Urgent notifications */}
                        <div className="allNotifis">
                            <div className="notifiItemSizing">
                                <Card>
                                    <div className="notifyItemCon">
                                        <div className="notifyItemCon1">
                                            <h5>Sales</h5>
                                            <p>You should always turn the lights off when you leave the office.</p>
                                        </div>
                                        <Checkbox
                                            checked={state.checkedB}
                                            onChange={checkBoxHandleChange("checkedB")}
                                            value="checkedB"
                                            color="primary"
                                            inputProps={{
                                                "aria-label": "secondary checkbox"
                                            }}
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                    {currentSideMenu === "General" && (
                        //  {/* // General notifications */}
                        <div className="allNotifis">
                            <div className="notifiItemSizing">
                                <Card>
                                    <div className="notifyItemCon">
                                        <div className="notifyItemCon1">
                                            <h5>Sales</h5>
                                            <p>You should always turn the lights off when you leave the office.</p>
                                        </div>
                                        <Checkbox
                                            checked={state.checkedB}
                                            onChange={checkBoxHandleChange("checkedB")}
                                            value="checkedB"
                                            color="primary"
                                            inputProps={{
                                                "aria-label": "secondary checkbox"
                                            }}
                                        />
                                    </div>
                                </Card>
                            </div>
                            <div className="notifiItemSizing">
                                <Card>
                                    <div className="notifyItemCon">
                                        <div className="notifyItemCon1">
                                            <h5>Sales</h5>
                                            <p>You should always turn the lights off when you leave the office.</p>
                                        </div>
                                        <Checkbox
                                            checked={state.checkedB}
                                            onChange={checkBoxHandleChange("checkedB")}
                                            value="checkedB"
                                            color="primary"
                                            inputProps={{
                                                "aria-label": "secondary checkbox"
                                            }}
                                        />
                                    </div>
                                </Card>
                            </div>
                            <div className="notifiItemSizing">
                                <Card>
                                    <div className="notifyItemCon">
                                        <div className="notifyItemCon1">
                                            <h5>Sales</h5>
                                            <p>You should always turn the lights off when you leave the office.</p>
                                        </div>
                                        <Checkbox
                                            checked={state.checkedB}
                                            onChange={checkBoxHandleChange("checkedB")}
                                            value="checkedB"
                                            color="primary"
                                            inputProps={{
                                                "aria-label": "secondary checkbox"
                                            }}
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
                <div className="footetCon">
                <div className="paraText bd6 otherpagesFooter3">
                <p>Copyright © 2019 UmiDesk Inc. All rights reserved. </p>
            </div>
            </div>
            </div>
            </div>
        </div>
    );
}

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
)(NotificationsPage);
