import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { userEmailState } from "../store/selectors/userEmail"
import {isUserLoading} from "../store/selectors/isUserLoading.js";
import Link from '@mui/material/Link';
import LoginBox from "./LoginBox";
import BackgroundHeader from "./BackgroundHeader";

import {
    createTheme,
    ThemeProvider,
    alpha,
    getContrastRatio,
    useThemeProps,
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


export const AdminLogin = () => {

    return <div >
    
    <BackgroundHeader text={"UNLINE - ADMIN"} />
    <div style={{marginTop:100}}>
        <LoginArea />
    </div>
    
</div>

}

function LoginArea() {
    const navigate = useNavigate()
    const userEmail = useRecoilValue(userEmailState);
    const userLoading = useRecoilValue(isUserLoading);
    
    return <div style={{zIndex:2}}>
        <Grid container style={{padding: "7vw" }} spacing={2}>
            <Grid item xs={12} md={6} lg={6}  style={{ display: "flex", justifyContent: "center"}}>
                <img src={"/appicon.jpeg"} width={"300px"} height={"300px"} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <div style={{marginTop: 80, marginLeft: -100}}>
                    
                    {!userLoading && !userEmail && <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Typography variant={"h6"} >
                                To create a new account click to 
                            </Typography>
                            <div style={{marginRight: 10}}>
                                
                                    <Button
                                        size={"small"}
                                        variant={"contained"}
                                        onClick={() => {
                                            navigate("/signup")
                                        }}
                                    >Signup</Button>
                                
                            {/* <Link href="/signup">
                                <Typography variant={"h6"} style={{marginLeft:10 , marginRight:20}}>
                                    Register Admin 
                                </Typography>
                            </Link> */}
                            </div>
                        </div>
                         
                        <div>
                            {/* <ThemeProvider theme={theme}>
                                <Button
                                 color="violet"
                                    size={"large"}
                                    variant={"contained"}
                                    onClick={() => {
                                        navigate("/signin")
                                    }}
                                >Login</Button>
                            </ThemeProvider> */}
                            < LoginBox type={"admin"}/>
                        </div>
                    </div>}

                    {!userLoading && userEmail && <div >
                        <Typography variant={"h6"} >
                            Currently logged in as <b>{userEmail}</b>
                        </Typography>
                        <br />
                        <ThemeProvider theme={theme} style={{display:"flex", justifyContent: "center"}}>
                            <Button
                                color="violet"
                                size={"small"}
                                variant={"contained"}
                                onClick={() => {
                                    navigate("/courses")
                                }}
                            >View Courses</Button>
                        </ThemeProvider>
                    </div> }

                </div>
                
            </Grid>
        </Grid>
    </div>
}