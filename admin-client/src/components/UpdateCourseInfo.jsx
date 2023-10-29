import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import {Loading} from "./Loading";
import { BASE_URL } from "../config.js";
import { courseState } from "../store/atoms/course";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { isCourseLoading, courseTitle, courseInstructor, courseImageLink, courseSubscribers } from "../store/selectors/course";
import BackgroundHeader from "./BackgroundHeader";
import FullFeaturedCrudGrid from "./ParticipantsTable";

function UpdateCourseInfo() {
    let { courseId } = useParams();
    const setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);
    const title = useRecoilValue(courseTitle);
    useEffect(() => {
        axios.get(`${BASE_URL}/admin/course/${courseId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({isLoading: false, course: res.data.course});
        })
        .catch(e => {
            setCourse({isLoading: false, course: null});
            console.log(e);
        });
    }, []);

    if (courseLoading) {
        return <Loading />
    }

    return <div>
        <BackgroundHeader text={`Edit Course Info: ${title}`}/>
        <Grid container style={{paddingTop: "8vw", paddingLeft:"4vw", paddingBottom :"4vw", marginTop:140 }} >
            <Grid item lg={5} md={12} sm={12}>
                <CourseCard />
            </Grid>
            <Grid item lg={7} md={12} sm={12}>
                <UpdateCourseCard />
            </Grid>
        </Grid>

        <FullFeaturedCrudGrid courseID={courseId}/>

    </div>
}

function UpdateCourseCard() {
    const [courseInfo, setCourse] = useRecoilState(courseState);

    const [title, setTitle] = useState(courseInfo.course.courseTitle);
    const [instructor, setInstructor ] = useState(courseInfo.course.courseInstructor);
    const [imageLink, setImageLink] = useState(courseInfo.course.imageLink);
    const [subscribers, setSubscribers] = useState(courseInfo.course.subscribers);

    return <div style={{display: "flex", justifyContent: "center"}}>
    <Card varint={"outlined"} style={{maxWidth: 600, borderRadius: 20,}}>
        <div style={{padding: 20 }}>
            <Typography variant='h6' style={{marginBottom: 10, display: "flex", justifyContent: "center"}}>Update Course Info</Typography>
            <TextField
                value={title}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
                fullWidth={true}
                label="Title"
                variant="outlined"
            />

            <TextField
                value={instructor}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setInstructor(e.target.value)
                }}
                fullWidth={true}
                label="Instructor"
                variant="outlined"
            />

            <TextField
                value={imageLink}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setImageLink(e.target.value)
                }}
                fullWidth={true}
                label="imageLink"
                variant="outlined"
            />

            <TextField
                value={subscribers}
                style={{marginBottom: 10}}
                onChange={(e) => {
                    setSubscribers(e.target.value)
                }}
                fullWidth={true}
                label="Subscribers"
                variant="outlined"
            />

            <div style={{display: "flex", justifyContent: "center"}}>
            <Button
                variant="contained"
                onClick={async () => {
                    axios.put(`${BASE_URL}/admin/courses/` + courseDetails.course._id, {
                        title: title,
                        instructor: instructor,
                        imageLink: imageLink,
                        subscribers: subscribers
                    }, {
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    });
                    let updatedCourse = {
                        id: courseInfo.course.courseId,
                        title: title,
                        instructor: instructor,
                        imageLink: imageLink,
                        subscribers: subscribers
                    };
                    setCourse({course: updatedCourse, isLoading: false});
                }}
            > Update course</Button>
            </div>
        </div>
    </Card>
</div>
}

function CourseCard(props) {
    const title = useRecoilValue(courseTitle);
    const imageLink = useRecoilValue(courseImageLink);
    const instructor = useRecoilValue(courseInstructor);

    return <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
     <Card style={{
        width: 550,
        marginLeft: 50,
        minHeight: 200,
        borderRadius: 20,
        paddingBottom: 10,
        // zIndex: 2
    }}>
        <img src={imageLink} style={{width: 450}} ></img>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Typography variant="h5">{title}</Typography>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Typography variant="h6"><i>Instructor:</i> {instructor}</Typography>
        </div>
    </Card>
    </div>
}



export default UpdateCourseInfo;