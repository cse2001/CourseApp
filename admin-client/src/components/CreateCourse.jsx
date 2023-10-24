import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Card, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import { BASE_URL } from "../config.js"
function CreateCourse() {
    const [title, setTitle] = useState("");
    const [instructor, setInstructor] = useState("");
    const [imageLink, setImageLink] = useState("");

    return <div style={{display: "flex", justifyContent: "center", minHeight: "80vh", justifyContent: "center", flexDirection: "column"}}>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card varint={"outlined"} style={{width: 400, padding: 20, marginTop: 30, height: "100%"}}>
                <Typography style={{marginBottom:10}}>
                    Enter details to create new course:
                </Typography>
                <TextField
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
                    style={{marginBottom: 10}}
                    onChange={(e) => {
                        setImageLink(e.target.value)
                    }}
                    fullWidth={true}
                    label="ImageLink"
                    variant="outlined"
                    size="small"
                />


                <Button
                    size={"small"}
                    variant="contained"
                    onClick={async () => {
                        await axios.post(`${BASE_URL}/admin/courses`, {
                            title: title,
                            instructor: instructor,
                            imageLink: imageLink,
                            subscribers: []
                        }, {
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem("token")
                            }
                        });
                        alert("Added New Course Successfully");
                    }}
                > Create Course</Button>
            </Card>
        </div>
    </div>
}

export default CreateCourse;