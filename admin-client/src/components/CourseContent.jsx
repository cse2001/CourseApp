import { ExampleSidebar } from "./SIdeBar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { courseState } from "../store/atoms/course";
import { isCourseLoading, courseTitle, courseInstructor, courseImageLink, courseSubscribers } from "../store/selectors/course";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { useEffect, useState } from "react";
import {Loading} from "./Loading";
import axios from "axios";
import { BASE_URL } from "../config.js";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { Divider, Drawer, Typography } from "@mui/material";
import Box from '@mui/material/Box';

import ReactPlayer from 'react-player';
import { PdfViewer } from "./PdfViewer.jsx";

export default function CourseContent() {
  let { courseId } = useParams();
  const setCourse = useSetRecoilState(courseState);
  const courseLoading = useRecoilValue(isCourseLoading);
  const title = useRecoilValue(courseTitle);
  console.log(`cousre title for above : ${title}`);
  useEffect(() => {
      axios.get(`${BASE_URL}/admin/course/${courseId}`, {
        //   method: "GET",
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

  return (
    <div>
    {/* < PermanentDrawerLeft /> */}
    {/* < ExampleSidebar /> */}
    {/* {"HWLLO"} */}
    <FileList courseId={courseId} courseTitle={title}/>
    
    </div>
  )
}


function FileList(props) {
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileTitle, setFileTitle] = useState(null);
  const navigate = useNavigate();
  const handleFileClick = async (fileTitle) => {
    // console.log(`cousre title in grdaes click: ${props.courseTitle} ${props.courseId}`)
    try {
      const response = await axios.get(`${BASE_URL}/admin/upload/${props.courseId}/${fileTitle}`,{
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "coursetitle": props.courseTitle
        },
        responseType: 'blob' // This is important // new
      });
      const blob = new Blob([response.data], {type: response.headers['content-type']}); //new
      const fileUrl = URL.createObjectURL(blob); //new
      // setFileContent(fileUrl);                   //new
      setFileType(response.headers['content-type']); //new
      setFileTitle(fileTitle); //new

      if (response.headers['content-type'].startsWith('text/')) {
        const reader = new FileReader();
        reader.onloadend = function() {
          setFileContent(reader.result);
        }
        reader.readAsText(blob);
      }      
      else {
        setFileContent(fileUrl);
      }
      // setFileContent(response.data);   // old
    //   console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch file content', error);
    }
  };

  useEffect(() => {
    const getFiles = async () => {
      const response = await axios.get(`${BASE_URL}/admin/upload/${props.courseId}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      setFiles(response.data);    // response.data is a single file name
      console.log(response.data);
    };

    getFiles();
  }, []);

  const drawerWidth =240;
  let fileIndex = 0;

  return (<div>
    {/* // <div style={{marginTop:'64px'}}> */}
    <Box sx={{ display: 'flex', margintop:20, marginLeft:4, marginRight:2}}> 
      <Drawer variant="permanent" anchor="left" sx={{
            flexShrink: 0,
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop:6,
              marginLeft:2,
            },
          }}>
      <Typography variant="h6" style={{ margin: '16px' }}>Contents</Typography>
      <List>
        {(files.length == 0) && 
            <ListItem >
              <ListItemText primary={"No content available"} />
            </ListItem>}
        
        {(files.length !== 0) && files.map((file, index) => {
            if (file !== "Grades"){
              fileIndex += 1;
              return (<ListItem key={index} disablePadding>
                <ListItemButton onClick={() =>{handleFileClick(file)}}>
                    <ListItemText primary={(fileIndex) + '. ' + file} />
                </ListItemButton>
              </ListItem>)
            }
          }
        )}
        <Divider />
        {(files.length !== 0) && files.map((file, index) => {
            if (file == "Grades"){
              return (<ListItem key={index} disablePadding>
                <ListItemButton onClick={() =>{handleFileClick(file)}}>
                    <ListItemText primary={file} />
                </ListItemButton>
            </ListItem>)
            }
          }
        )}
        
      </List>
      </Drawer>
      
      <div style={{flexGrow:1}}>
        <Box sx={{bgcolor: 'background.default', p:2, marginTop:0.4, marginBottom:2}} >
        <div style={{display:"flex", justifyContent:"center"}}><Typography variant="h5">Course: <b>{props.courseTitle}</b></Typography></div>
        </Box>
        <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3,  marginTop:0.4, minHeight:500}}
        >
          <div >
            <div>{!fileType &&<Typography>Select a content from the left menu to view</Typography>}</div><br/>
            <div style={{marginBottom:20}}>{fileType && <Typography variant="h6">Topic : <b>{fileTitle}</b></Typography>}</div><br/>
            <div style={{display:"flex", justifyContent:"center"}}>{fileType && fileType.startsWith('image') && <img src={fileContent} alt="content" maxwidth={600} height={400}/>}</div>
            <div style={{display:"flex", justifyContent:"center"}}>{fileType && fileType.startsWith('video') && <ReactPlayer url={fileContent} controls={true} />}</div>
            <div style={{display:"flex", justifyContent:"center"}}>{fileType && fileType.startsWith('text') && <Typography variant="h7" >{fileContent}</Typography>}</div>
            <div style={{display:"flex", justifyContent:"center"}}>{fileType && fileType === 'application/pdf' && <PdfViewer fileContent={fileContent} />}</div>
          </div>
        </ Box>
      </div>
    </Box>
      
    <div>
    </div>
    
  </div>);
}
