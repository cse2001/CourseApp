import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { userEmailState } from "../store/selectors/userEmail"
import {isUserLoading} from "../store/selectors/isUserLoading.js";
import VioletButton from "./VioletButton.jsx";
import { userTypeState } from "../store/selectors/userType.js";

// import {
//     createTheme,
//     ThemeProvider,
//     alpha,
//     getContrastRatio,
//   } from '@mui/material/styles';

//   // Update the Button's color options to include a violet option

// const violetBase = '#7F00FF';
// const violetMain = alpha(violetBase, 0.7);

// const theme = createTheme({
//   palette: {
//     violet: {
//       main: violetMain,
//       light: alpha(violetBase, 0.5),
//       dark: alpha(violetBase, 0.9),
//       contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
//     },
//   },
// });

export const Landing = () => {
    // const navigate = useNavigate()
    const userEmail = useRecoilValue(userEmailState);
    const userLoading = useRecoilValue(isUserLoading);
    const userType = useRecoilValue(userTypeState);
    console.log("user type:");
    console.log(userType);
    console.log("user email:");
    console.log(userEmail);
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
                            <div style={{marginRight:20}}><VioletButton text={"Student"} link={"/student_login"}  /> </div>
                            <div><VioletButton text={"Instructor"} link={"/admin_login"}/></div>
                        </div>
                    </div>}
                </div>
                <div>
                </div>
            </Grid>
            
        </Grid>
    </div>
}