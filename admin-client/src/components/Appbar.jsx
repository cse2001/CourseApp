import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { isUserLoading } from "../store/selectors/isUserLoading";
import {useSetRecoilState, useRecoilValue} from "recoil";
import { userState } from "../store/atoms/user.js";
import { userEmailState } from "../store/selectors/userEmail"

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

function Appbar({}) {
    const navigate = useNavigate()
    const userLoading = useRecoilValue(isUserLoading);
    const userEmail = useRecoilValue(userEmailState);
    const setUser = useSetRecoilState(userState);

    if (userLoading) {
        return <></>
    }

    if (userEmail) {
        return <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 4,
            zIndex: 1
        }}>
            <div style={{marginLeft: 10, cursor: "pointer"}} onClick={() => {
                navigate("/")
            }}>
                <Typography variant={"h6"}><b>UNLINE</b></Typography>
            </div>
    
            <div style={{display: "flex"}}>
                <div style={{marginRight: 10, display: "flex"}}>
                    <div style={{marginRight: 10, paddingTop:8}}>
                        <b>{userEmail}</b>
                    </div>

                <div style={{marginRight: 10}}>
                    
                    <ThemeProvider theme={theme}>
                        <Button color="violet"
                            variant={"contained"}
                            onClick={() => {
                                navigate("/")
                            }}
                        >Home</Button>
                    </ThemeProvider>
                </div>

                    <div style={{marginRight: 10}}>
                        <ThemeProvider theme={theme}>
                        <Button
                            color="violet"
                            variant={"contained"}
                                onClick={() => {
                                    navigate("/allcourses")
                                }}
                        >Courses</Button>
                        </ThemeProvider>
                    </div>
                    <ThemeProvider theme={theme}>
                    <Button
                    color="violet"
                        variant={"contained"}
                        onClick={() => {
                            localStorage.setItem("token", null);
                            navigate("/");
                            setUser({
                                isLoading: false,
                                userEmail: null,
                                userType: null,
                                userCourses: null
                            });
                        }}
                    >Logout</Button>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    } else {
        return <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 4,
            zIndex: 1
        }}>
            <div style={{marginLeft: 10, cursor: "pointer"}} onClick={() => {
                navigate("/")
            }}>
                <Typography variant={"h6"}><b>UNLINE</b></Typography>
            </div>
    
            <div style={{display: "flex"}}>
                <div style={{marginRight: 20}}>
                    <ThemeProvider theme={theme}>
                        <Button color="violet"
                                variant={"contained"} 
                            onClick={() => {
                                navigate("/")
                            }}
                        >Home</Button>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    }
}

export default Appbar;