import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import { BASE_URL } from "../config.js";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../store/atoms/user.js";
import { userTypeState } from "../store/selectors/userType";
import {useRecoilValue} from "recoil";
import {useRecoilState} from "recoil";


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);

    const userType= user.userType;
    // const userType= useRecoilValue(userTypeState);
    console.log("user type in stdnt signup");
    console.log(userType);

    return <div>
            <div style={{
                paddingTop: 150,
                marginBottom: 10,
                display: "flex",
                justifyContent: "center"
            }}>
                <Typography variant={"h6"}>
                Welcome to UNILINE. Enter details below to Register.
                </Typography>
            </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card varint={"outlined"} style={{width: 400, padding: 20}}>
                <TextField
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                    fullWidth={true}
                    label="Full Name"
                    variant="outlined"
                />
                <br/><br/>
                <TextField
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                    fullWidth={true}
                    label="Email"
                    variant="outlined"
                />
                <br/><br/>
                <TextField
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    fullWidth={true}
                    label="Password"
                    variant="outlined"
                    type={"password"}
                />
                <br/><br/>
                {/* <TextField
                    onChange={(e) => {
                        setUserType(e.target.value);
                    }}
                    fullWidth={true}
                    label="User Type"
                    variant="outlined"
                /> */}
                <br/><br/>
                <Button
                    size={"large"}
                    variant="contained"
                    onClick={async () => {
                        const response = await axios.post(`${BASE_URL}/${userType}/signup`, {
                            username: email,
                            password: password,
                            name: name,
                            type: userType
                        })
                        let data = response.data;
                        console.log(data);
                        localStorage.setItem("token", data.token);
                        // window.location = "/"
                        setUser({userEmail: email,
                                isLoading: false,
                                userType: userType,
                                userCourses: null});
                        alert(`User created: ${response.data}`);
                        navigate("/allcourses")
                    }}

                > Signup</Button>
            </Card>
        </div>
    </div>
}

export default Signup;