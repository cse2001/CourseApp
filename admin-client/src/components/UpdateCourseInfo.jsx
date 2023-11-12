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
import FullFeaturedCrudGrid2 from "./DoGrading.jsx";
import Grading from "./DoGrading.jsx";


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
        <Grid container spacing={2} style={{paddingTop: "8vw", paddingLeft:"4vw", paddingBottom :"4vw", marginTop:140 }} >
            <Grid item lg={4} md={12} sm={12}>
                <CourseCard />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                <UpdateCourseCard />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                <UploadCard courseId={courseId} />
            </Grid>
        </Grid>
        
        
        <FullFeaturedCrudGrid courseID={courseId}/>

        {/* <FullFeaturedCrudGrid2 /> */}

        <Grading />


    

    </div>
}

function UpdateCourseCard() {
    const [courseInfo, setCourse] = useRecoilState(courseState);

    const [title, setTitle] = useState(courseInfo.course.courseTitle);
    const [instructor, setInstructor ] = useState(courseInfo.course.courseInstructor);
    const [imageLink, setImageLink] = useState(courseInfo.course.imageLink);
    const [subscribers, setSubscribers] = useState(courseInfo.course.subscribers);

    return <div style={{display: "flex", justifyContent: "center"}}>
    <Card varint={"outlined"} style={{maxWidth: 400, borderRadius: 20, margin:20}}>
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
                size="small"
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
                size="small"
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
                size="small"
            />


            <div style={{display: "flex", justifyContent: "center"}}>
            <Button
                variant="contained"
                size="small"
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

    return <div style={{display: "flex", justifyContent: "center", width: "100%", marginTop:20, marginLeft:50, minHeight:263}}>
     <Card style={{
        width: 350,
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

function UploadCard(props) {
    const [file, setFile] = useState(null);
    const [fileTitle, setFileTitle] = useState('');
    const [fileType, setFileType] = useState(''); // New state for file type
    const [progress, setProgress] = useState({started: false, pc: 0});
    const [msg, setMsg] = useState(null);

    function handleUpload(){
        if (!file){
            alert("No file selected");
            setMsg("Please select a file");
            return;
        }

        if (!fileType) {
            alert("No file type selected");
            setMsg("Please select a file type");
            return;
        }

        if (!fileTitle) {
            alert("No file title entered");
            setMsg("Please select a file title");
            return;
        }

        const fd = new FormData();
        fd.append('title', fileTitle);
        fd.append('file', file);
        fd.append('type', fileType); // Append file type to form data
        
        setMsg("Uploading...");
        setProgress(prevState => {
            return {...prevState, started: true}
        })
        axios.post(`${BASE_URL}/admin/upload/${props.courseId}`, fd, {
            onUploadProgress: (progressEvent) => { setProgress(prevState => {
                return {...prevState, pc: progressEvent.progress*100 }
            }) },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "fileinfo": JSON.stringify({fileTitle: fileTitle, fileType: fileType})
            }
        })
        .then(res => {
            console.log(res.data);
            setMsg("Upload successfull");
        })
        .catch(err => {
            setMsg("Upload failed");
            console.log(err);
        });
    }

    return <div style={{display: "flex", justifyContent: "center", marginTop:20, marginRight:100, minHeight:263}}><Card style={{
        
        width: 350,
        minHeight: 100,
        borderRadius: 20,
        paddingBottom: 10}}>
        <div style={{display: "flex", justifyContent: "center"}}><h3>Upload Files</h3></div>
        <input onChange={(e) => setFileTitle(e.target.value)} type="text" placeholder="Enter title" />
        <br /><br />
        <div>Select file type:</div> 
        <select onChange={(e) => setFileType(e.target.value)} required>
            <option value="">Select a file type</option> 
            <option value="text">Text</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
        </select>
        <br /><br />
        <div>
        <input onChange={(e) => {setFile(e.target.files[0])}} type="file"/>
        <button onClick={handleUpload}>Upload</button>
        {progress.started && <progress max="100" value={progress.pc}></progress>}
        </div>
        <br/>
        {msg && <span>{msg}</span>}
        
    </Card></div>
}


export default UpdateCourseInfo;