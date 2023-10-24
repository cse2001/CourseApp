import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../store/atoms/user.js";
import { BASE_URL } from "../config.js";

function LoginBox(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const setUser = useSetRecoilState(userState);
    
    return <div>           
              <div style={{display: "flex", justifyContent: "center"}}>
                  <Card varint={"outlined"} style={{width: 380, padding: 20}}>
                      <div style={{
                        display: "flex",
                        justifyContent: "center"
                        }}>
                    
                        <Typography variant={"h6"}>
                        Enter details below to Login:
                        </Typography>
                      </div>
                      <TextField
                          onChange={(e) => {
                              setEmail(e.target.value);
                          }}
                          fullWidth={true}
                          label="Email"
                          variant="outlined"
                          size="small"
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
                          size="small"
                      />
                        <br/><br/>

                      <Button
                        size={"small"}
                        variant="contained"
                        onClick={async () => {
                            const res = await axios.post(`${BASE_URL}/${props.type}/login`, {
                                username: email,
                                password: password,
                            }, {
                                headers: {
                                    "Content-type": "application/json"
                                }
                            });
                            const data = res.data;
                            console.log(data);
                            localStorage.setItem("token", data.token);
                            // window.location = "/"
                            setUser({
                                userEmail: email,
                                userCourses: res.data.user.subscribedCourses,
                                userType: res.data.user.type,
                                isLoading: false
                            })
                            navigate("/allcourses")
                        }}

                      > Login</Button>
                    </Card> 
                </div>
            </div>
}

export default LoginBox;