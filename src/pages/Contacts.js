import React, { useEffect } from "react";
import HomeNavBar from "../Components/NavBar";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AllContactIcon from "@material-ui/icons/Contacts";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountigIcon from "@material-ui/icons/ContactMail";
import PhoneIcon from "@material-ui/icons/ContactPhone";
import PublicRelIcon from "@material-ui/icons/PermContactCalendar";
import SalesIcon from "@material-ui/icons/ImportContacts";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import MenuArrowIcon from "@material-ui/icons/KeyboardArrowDown";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./stylePages2.css";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";

const override = css`
    display: block;
`;

const drawerWidth = 240;
const oldActiveVals = [1, 0, 0, 0, 0];
const useStyles = makeStyles(theme => ({
    pagsButton: {
        padding: "10px",
        margin: "0px",
        marginRight: "5px",
        marginTop:'-10px',
        fontSize: "16px"
    },
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
        margin: "0px 5px 0px 5px",
        color: "rgba(0, 0, 0, 0.54)",
        fontWeight: "bold"
    },
    activeMenu: {
        backgroundColor: "#00000014"
    }
}));
function ContactsPage(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setdrawerOpen] = React.useState(true);
    const [currentSideMenu, setCurrentSideMenu] = React.useState("All");
    const [activeSideMenu, setactiveSideMenu] = React.useState(oldActiveVals);
    const [contactsData, setcontactsData] = React.useState([]);
    const [currentSortMenuVal, setcurrentSortMenuVal] = React.useState("A - Z");

    const [pagLoader, setpagLoader] = React.useState("hidden");
    const [pageCount, setpageCount] = React.useState([]);
    const [currentPage, setcurrentPage] = React.useState(1);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const sortMenuhandleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const sortMenuhandleClose = () => {
        setAnchorEl(null);
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
    const sortClicked = val => {
        const oldContactsData = contactsData;
        if (val === "A - Z") {
            oldContactsData.sort(function(a, b) {
                if (a.first_name < b.first_name) {
                    return -1;
                }
                if (a.first_name > b.first_name) {
                    return 1;
                }
                return 0;
            });
        } else {
            oldContactsData.sort(function(a, b) {
                if (b.first_name < a.first_name) {
                    return -1;
                }
                if (b.first_name > a.first_name) {
                    return 1;
                }
                return 0;
            });
        }
        setcurrentSortMenuVal(val);
        sortMenuhandleClose();
        setcontactsData([...oldContactsData]);
    };

    useEffect(() => {
        if (props.userInfo.userLogedIn === false) {
            props.history.push("/");
        }
    }, []);

    useEffect(() => {
        fetchContactsData(1,false)
    }, []);

    const fetchContactsData = (page,callSearchFunc)=>{
        getRequest(`https://umidesk-api.herokuapp.com/api/questions/all/users?page=${page}`)
        .then(dataResponse => {
            if (dataResponse.users) {
                let i;
                let pagarray = [];
                for (i = 1; i <= dataResponse.pageCount; i++) {
                    if (i === dataResponse.page) {
                        pagarray.push(1);
                    } else {
                        pagarray.push(0);
                    }
                }
                setpageCount([...pagarray]);
                setcurrentPage(dataResponse.page);
            }
            setpagLoader("hidden");
            console.log(dataResponse);
            dataResponse.users.sort(function(a, b) {
                if (a.first_name < b.first_name) {
                    return -1;
                }
                if (a.first_name > b.first_name) {
                    return 1;
                }
                return 0;
            });
            setcontactsData(dataResponse.users);
        })
        .catch(error => {
            console.log("error", error);
        });
    }

    const pagClicked = page => {
        fetchContactsData(page, true);
        setpagLoader("visible");
    };

    const handleDrawerOpen = () => {
        setdrawerOpen(true);
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
        const oldVals = [0, 0, 0, 0, 0];
        oldVals[index] = 1;
        setactiveSideMenu(oldVals);
        setCurrentSideMenu(text);
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
                            {["All", "Accounting", "Human Resources", "Public Relations", "Sales"].map((text, index) => (
                                <ListItem
                                    button
                                    key={text}
                                    onClick={() => sideMenuClicked(text, index)}
                                    className={clsx({
                                        [classes.activeMenu]: activeSideMenu[index]
                                    })}
                                >
                                    <ListItemIcon>
                                        <span>
                                            {index === 0 && <AllContactIcon />}
                                            {index === 1 && <AccountigIcon />}
                                            {index === 2 && <PhoneIcon />}
                                            {index === 3 && <PublicRelIcon />}
                                            {index === 4 && <SalesIcon />}
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
                    <div className="tabsBtnCon">
                        <Button onClick={sortMenuhandleClick} className={classes.buttonTab}>
                            {currentSortMenuVal} <MenuArrowIcon />
                        </Button>
                    </div>
                    <Divider />
                    {currentSideMenu === "All" && (
                        //{/* // all contacts */}
                        <div className="allontacts">
                            {contactsData.map((data, index) => {
                                return (
                                    <div key={`contact${index}`} className="contactItemSizing">
                                        <Card>
                                            <div className="contactItemCon">
                                                <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.contactAvatar} />

                                                <div className="contactText">
                                                    <p>
                                                        {data.first_name} {data.last_name}
                                                    </p>
                                                    <p>Accounting</p>
                                                </div>
                                            </div>
                                            <div className="contactItemCon2">
                                                <p>Phone | 090909090</p>
                                                <p>Email | {data.email}</p>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {currentSideMenu === "Accounting" && (
                        //{/* // Accounting contacts */}
                        <div className="allontacts">
                            {contactsData.map((data, index) => {
                                return (
                                    <div key={`contact${index}`} className="contactItemSizing">
                                        <Card>
                                            <div className="contactItemCon">
                                                <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.contactAvatar} />

                                                <div className="contactText">
                                                    <p>
                                                        {data.first_name} {data.last_name}
                                                    </p>
                                                    <p>Accounting</p>
                                                </div>
                                            </div>
                                            <div className="contactItemCon2">
                                                <p>Phone | 090909090</p>
                                                <p>Email | {data.email}</p>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {currentSideMenu === "Human Resources" && (
                        //{/* // Human Resources contacts */}
                        <div className="allontacts">
                            {contactsData.map((data, index) => {
                                return (
                                    <div key={`contact${index}`} className="contactItemSizing">
                                        <Card>
                                            <div className="contactItemCon">
                                                <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.contactAvatar} />

                                                <div className="contactText">
                                                    <p>
                                                        {data.first_name} {data.last_name}
                                                    </p>
                                                    <p>Human Resources</p>
                                                </div>
                                            </div>
                                            <div className="contactItemCon2">
                                                <p>Phone | 090909090</p>
                                                <p>Email | {data.email}</p>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {currentSideMenu === "Public Relations" && (
                        //{/* // Public Relations contacts */}
                        <div className="allontacts">
                            {contactsData.map((data, index) => {
                                return (
                                    <div key={`contact${index}`} className="contactItemSizing">
                                        <Card>
                                            <div className="contactItemCon">
                                                <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.contactAvatar} />

                                                <div className="contactText">
                                                    <p>
                                                        {data.first_name} {data.last_name}
                                                    </p>
                                                    <p>Public Relations</p>
                                                </div>
                                            </div>
                                            <div className="contactItemCon2">
                                                <p>Phone | 090909090</p>
                                                <p>Email | {data.email}</p>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {currentSideMenu === "Sales" && (
                        //{/* // Sales contacts */}
                        <div className="allontacts">
                            {contactsData.map((data, index) => {
                                return (
                                    <div key={`contact${index}`} className="contactItemSizing">
                                        <Card>
                                            <div className="contactItemCon">
                                                <Avatar alt="Remy Sharp" src="https://cdn.onebauer.media/one/empire-tmdb/people/500/profiles/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg?quality=50&width=1000&ratio=1-1&resizeStyle=aspectfit&format=jpg" className={classes.contactAvatar} />

                                                <div className="contactText">
                                                    <p>
                                                        {data.first_name} {data.last_name}
                                                    </p>
                                                    <p>Sales</p>
                                                </div>
                                            </div>
                                            <div className="contactItemCon2">
                                                <p>Phone | 090909090</p>
                                                <p>Email | {data.email}</p>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* //pagination */}
                    <div style={{width:'100%'}}>
                    <div className="pagCon1 pagCon2" >
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
              </div>
            
                </main>
                <div className="paraText bd6 otherpagesFooter3">
                <p>Copyright © 2019 UmiDesk Inc. All rights reserved. </p>
            </div>
            </div>
            </div>
           
            {/* //extras */}
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={sortMenuhandleClose}>
                <MenuItem onClick={() => sortClicked("A - Z")}>A - Z</MenuItem>
                <MenuItem onClick={() => sortClicked("Z - A")}>Z - A</MenuItem>
            </Menu>
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
)(ContactsPage);
