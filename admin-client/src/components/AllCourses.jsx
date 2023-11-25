import { Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { BASE_URL } from "../config.js";
import axios from "axios";
import BackgroundHeader from "./BackgroundHeader.jsx";
import VioletButton from "./VioletButton.jsx";
import { useRecoilValue, useRecoilState } from "recoil";
import {useSetRecoilState} from "recoil";
import { userEmailState } from "../store/selectors/userEmail.js";
import { userCoursesState } from "../store/selectors/userCourses.js";
import { userTypeState } from "../store/selectors/userType.js";
import {userState} from "../store/atoms/user.js";
import {courseState} from "../store/atoms/course.js";
import { CardActionArea, CardActions, CardContent  } from '@mui/material';

function AllCourses() {
    const [allCourses, setAllCourses] = useState([]);
    const user = useRecoilValue(userState);    
    const userType = user.userType;
    var userCourses = user.userCourses;
    
    // console.log("user courses AAL:")
    // console.log(userCourses);
    // console.log("user type AAl:");
    // console.log(userType);
    // console.log("user email AAl:");
    // console.log(user.userEmail);

    const init = async (userType) => {
        const response = await axios.get(`${BASE_URL}/${userType}/courses/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setAllCourses(response.data.courses);
    }
    
    useEffect(() => {
        init(userType);
    }, [userType]);

    return <div>
        <BackgroundHeader text={"All Courses"}/>
        <div style={{display:"flex", justifyContent:"space-between", marginLeft:200, marginTop:40}}>
            <img src={"/appicon.jpeg"} width={"200px"} height={"200px"} />
            <div style={{zIndex:2, marginRight:200, marginTop:80}}>
            <VioletButton text={"+ Create New Course"} link={"/createcourse"}/>
            </div>
        </div>
        
        <div style={{display: "flex", flexWrap: "wrap", justifyContent:"left", marginTop:20, marginLeft:80}}>
        {allCourses.map(course => {
            return <Course course={course}/>}
        )}
        </div>

    </div>
}

export function Course(props) {
    const navigate = useNavigate();
    const userEmail = useRecoilValue(userEmailState);
    // console.log(userEmail);
    const userCourses = useRecoilValue(userCoursesState);
    // console.log(userCourses);
    // const setUserCourses = useSetRecoilState(userCoursesState);
    const [user, setUser] = useRecoilState(userState);
    const [course, setCourse] = useRecoilState(courseState);
    const userType = user.userType;
    return <Card style={{
        margin: 10,
        width: 280,
        minHeight: 180,
        padding: 20
    }}>
        <CardActionArea onClick={()=>{
            navigate("/coursecontent/" + props.course.courseId);
            setCourse({isLoading: false,
                        course: props.course,} );
            }}>
            <CardContent>
            <Typography textAlign={"center"} variant="h5">{props.course.courseTitle}</Typography>
            <Typography textAlign={"center"} variant="subtitle1"><i>Instructor: {props.course.courseInstructor}</i></Typography>
            {userCourses && userCourses.includes(props.course.courseId) && <div style={{marginRight: 20}}>
            <Typography textAlign={"center"} variant="subtitle1">Enrolled !</Typography>
            </div>}
            <img src={props.course.imageLink} style={{width: 250}} ></img>
            </CardContent>
        </CardActionArea>
        <CardActions>
        <div style={{display: "flex", justifyContent:"space-between", marginTop: 20}}>
            
            {!userCourses && <div style={{marginRight: 20}}>
            {/* Enroll button if user courses is null*/}
            <EnrollButton userType={userType} courseId={props.course.courseId} courseTitle={props.course.courseTitle}/>
            </div>}

            {userCourses && !userCourses.includes(props.course.courseId) && <div style={{marginRight: 20}}>
            {/* Enroll button if userCourses does not contains this courseId*/}
            <EnrollButton userType={userType} courseId={props.course.courseId} courseTitle={props.course.courseTitle}/>
            </div>}

            {userCourses && userCourses.includes(props.course.courseId) && <div style={{marginRight: 20}}>
            
            <Button
            size={"small"}
            variant="contained"
            onClick={async () => {
                const res = await axios.put(`${BASE_URL}/${userType}/deletecourse/${props.course.courseId}`, {
                    username: userEmail
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-type": "application/json"
                    }
                });
                const data = res.data;
                console.log(data);
                alert(res.data.message);
                const newUserCourses = userCourses.filter(item => item !== props.course.courseId);
                setUser({
                    ...user,
                    userCourses: newUserCourses,
                });
            }}>Drop</Button>
            </div>}

            
            {(userType == "admin") && <div>
            <Button variant="contained" size="small" onClick={() => {
                {/* Add condition for EDIT button to only appear for ADMIN */}
                navigate("/courses/" + props.course.courseId);
                setCourse({isLoading: false,
                    course: props.course,});
            }}>Edit</Button>
            </div>}
        </div>
        </CardActions>
    </Card>
}

function EnrollButton(props){
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    return (<Button
            size={"small"}
            variant="contained"
            onClick={async () => {
                const res = await axios.post(`${BASE_URL}/admin/courses/${props.courseId}/${props.courseTitle}`, {
                    username: user.userEmail
                }, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-type": "application/json"
                    } 
                });
                const data = res.data;
                console.log(data);
                alert(res.data.message);
                var newUserCourses = [];
                if (user.userCourses){
                    newUserCourses = [...user.userCourses, props.courseId];
                }
                else{
                    newUserCourses = [props.courseId];
                }
                
                // setUserCourses(newUserCourses);
                setUser({
                    ...user,
                    userCourses: newUserCourses,
                });


                navigate("/allcourses");
            }}>Enroll</Button>)
}

export default AllCourses;