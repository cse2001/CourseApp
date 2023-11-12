import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import {isUserLoading} from "../store/selectors/isUserLoading.js";
import VioletButton from "./VioletButton.jsx";
import { userTypeState } from "../store/selectors/userType.js";
import {userState} from "../store/atoms/user.js";
import {useRecoilState} from "recoil";
import {useSetRecoilState} from "recoil";
import { useState } from "react";

import {
    createTheme,
    ThemeProvider,
    alpha,
    getContrastRatio,
  } from '@mui/material/styles';

  // Update the Button's color options to include a violet option

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);

const theme = createTheme({
  palette: {
    violet: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
      contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
});

export const Landing = () => {
    const navigate = useNavigate()
    // const [user, setUser] = useRecoilState(userState);
    const [user, setUser] = useRecoilState(userState);

    // const userEmail = useRecoilValue(userEmailState);
    const userEmail = user.userEmail;
    // const userLoading = useRecoilValue(isUserLoading);
    const userLoading = user.isLoading;
    // const userType = useRecoilValue(userTypeState);
    const userType = user.userType;

    console.log("user type landin:");
    console.log(userType);
    // console.log("user email:");
    // console.log(userEmail);

    return <div>
        <Grid container style={{padding: "7vw" }} spacing={2}>
            <Grid item xs={12} md={6} lg={6}  style={{marginTop: 20, display: "flex", justifyContent: "center"}}>
                <img src={"/appicon.jpeg"} width={"300px"} height={"300px"} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <div style={{marginTop: 100}}>
                    <Typography variant={"h3"}>
                        UNILINE Homepage 
                    </Typography>
                    <br />
                    
                    {!userLoading && !userEmail && <div style={{ marginTop: 20}}>
                    <Typography variant={"h6"}>
                        Are you a student or an instructor?
                    </Typography><br />
                        <div style={{display: "flex" }}>
                            {/* <div style={{marginRight:20}}><VioletButton text={"Student"} link={"/student_login"}  /> </div> */}
                            <div style={{marginRight:20}}>
                            <ThemeProvider theme={theme}>
                                <Button
                                color="violet"
                                    size={"large"}
                                    variant={"contained"}
                                    onClick={() => {
                                        navigate("/student_login");
                                        console.log("/student_login");
                                        // setUser({...user, userType : "student"});
                                        const newUser = {...user, userType : "student"};
                                        setUser(newUser);
                                    }}
                                >Student</Button>
                            </ThemeProvider>
                            </div>

                            {/* <div><VioletButton text={"Instructor"} link={"/admin_login"}/></div> */}
                            <div style={{marginRight:20}}>
                            <ThemeProvider theme={theme}>
                                <Button
                                color="violet"
                                    size={"large"}
                                    variant={"contained"}
                                    onClick={() => {
                                        navigate("/admin_login");
                                        console.log("/admin_login");
                                        const newUser = {...user, userType : "admin"};
                                        setUser(newUser);
                                    }}
                                >Instructor</Button>
                            </ThemeProvider>
                            </div>
                        </div>
                    </div>}
                </div>
                <div>
                </div>
            </Grid>
            
        </Grid>
    </div>
}