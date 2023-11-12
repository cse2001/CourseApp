import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, TextField } from "@mui/material";
import {Loading} from "./Loading";
import { isCourseLoading, courseTitle, courseInstructor, courseImageLink, courseSubscribers } from "../store/selectors/course";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { courseState } from "../store/atoms/course";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import axios from "axios";
import { BASE_URL } from "../config.js";
import {userState} from "../store/atoms/user.js";
import { rowState } from "../store/atoms/row.js";
import { userCoursesState } from "../store/selectors/userCourses.js";


import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';


var courseId;

function EditToolbar(props) {
  // const { setRows, setRowModesModel } = props;
  const { tableColumns, setTableColumns } = props;
  const [newColumnName, setNewColumnName ] = useState(null);

  const handleClick =  () => {
    // ADD SIGNUP FUNCTIONALITY HERE  
    // const id = randomId();
    // setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    // setRowModesModel((oldModel) => ({
    //   ...oldModel,
    //   [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    // }));
    
    // setTableColumns([...tableColumns, ])
  };

  return (<div><Typography variant="h4" style={{display:"flex", justifyContent:"center", margin:5}}>Grades</Typography>
    <GridToolbarContainer >{/*style={{marginTop:10}}  for GridToolbarContainer*/ }
      {/* <div style={{display:"flex", justifyContent:"center"}}> */}
      
      <Grid item>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add New Test Column
        </Button>
      </Grid>
      <Grid item>      
        {<TextField
                  // style={{marginBottom: 10}}
                  onChange={(e) => {
                      setNewColumnName(e.target.value)
                  }}
                  fullWidth={true}
                  label="New Test Name"
                  variant="outlined"
                  size="small"
              />}
      </Grid>
      {/* </div> */}
    </GridToolbarContainer>
    </div>);
}

export default function Grading(){
  const [courseInfo, setCourseInfo] = useRecoilState(courseState);
  const setRows = useSetRecoilState(rowState);
  console.log("grading");
  var participantsList = [];
  
    useEffect(() => {
      axios.get(`${BASE_URL}/admin/courses/${courseInfo.course.courseId}/marks/${courseInfo.course.courseTitle}`, 
        {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          console.log("users do grading:");
          console.log(res.data.participants);
          participantsList = res.data.participants;
          participantsList = participantsList.map(row => {
            var newrow = {
              id: row.studentid,
              studentid: row.studentid,
              studentemail: row.studentemail,
              quiz: row.quiz,
              midsem: row.midsem,
              endsem: row.endsem
            }
            return newrow;
          })
          console.log("Particapants 2:");
          console.log(participantsList);
          setRows(participantsList);

          console.log("rows 2");
          // console.log(rows);
          

      })
      .catch(e => {
          // setCourse({isLoading: false, course: null});
          console.log("Particapants 2:");
          console.log(e);
      });
  }, []);

  return <FullFeaturedCrudGrid2 />
  
}

export function FullFeaturedCrudGrid2(props) {
  // var rows = props.rows;
  // var setRows = props.setRows;
  // const [rows, setRows] = React.useState([]);
  const [rows, setRows] = useRecoilState(rowState);
  const [courseInfo, setCourseInfo] = useRecoilState(courseState);
  const [user, setUser] = useRecoilState(userState);
  const userCourses = useRecoilValue(userCoursesState);
  const [rowModesModel, setRowModesModel] = React.useState({});

  console.log("rows fff");
  console.log(rows)

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: false },
    
  ];

  const [tableColumns, setTableColumns] = useState([{
    field: 'email',
    headerName: 'Email',
    width: 220,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },]);

  // const [tableColumns, setTableColumns] = useState(columns);
  // useEffect(() => {
  //   setTableColumns(columns);
  // } , []);
  

  courseId = courseInfo.course.courseId;

    // get marks table column names
    useEffect(() => {
      axios.get(`${BASE_URL}/admin/courses/${courseInfo.course.courseId}/marksTableCols`,
        {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      }).then(res => {
          console.log(res.data);
          var newcols = res.data.columns.map( (col) => {
            if (col == "studentid" ) {
              return {
                field: col,
                headerName: col,
                width: 80,
                align: 'left',
                headerAlign: 'left',
                editable: false,
              }              
            }
            else if(col == "studentemail"){
              return {
                field: col,
                headerName: col,
                width: 220,
                align: 'left',
                headerAlign: 'left',
                editable: false,
              }              
            }
            else{
              return {
                field: col,
                headerName: col,
                width: 100,
                align: 'left',
                headerAlign: 'left',
                editable: true
              }
            }
          });
          newcols.push({
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              // const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
              // if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                      color: 'primary.main',
                    }}
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              // }
              
              /* Disabled edit and delete icons
              return [
                // <GridActionsCellItem
                //   icon={<EditIcon />}
                //   label="Edit"
                //   className="textPrimary"
                //   onClick={handleEditClick(id)}
                //   color="inherit"
                // />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
              */
            },
          },)
          setTableColumns(newcols )

      })
      .catch(e => {
          // setCourse({isLoading: false, course: null});
          console.log(e);
      });
  }, [rows]);
 
  // var participantsList = [];
  
  //   useEffect(() => {
  //     axios.get(`${BASE_URL}/admin/courses/${courseInfo.course.courseId}/marks/${courseInfo.course.courseTitle}`, 
  //       {
  //         headers: {
  //             "Authorization": "Bearer " + localStorage.getItem("token")
  //         }
  //       }).then(res => {
  //         console.log("users do grading:");
  //         console.log(res.data.participants);
  //         participantsList = res.data.participants;
  //         participantsList = participantsList.map(row => {
  //           var newrow = {
  //             id: row.studentid,
  //             studentid: row.studentid,
  //             studentemail: row.studentemail,
  //             quiz: row.quiz,
  //             midsem: row.midsem,
  //             endsem: row.endsem
  //           }
  //           return newrow;
  //         })
  //         console.log("Particapants 2:");
  //         console.log(participantsList);
  //         setRows(participantsList);

  //         console.log("rows 2");
  //         // console.log(rows);
          

  //     })
  //     .catch(e => {
  //         // setCourse({isLoading: false, course: null});
  //         console.log("Particapants 2:");
  //         console.log(e);
  //     });
  // }, []);


  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    
    console.log("handle save")
    // console.log("rows from save")
    // console.log(rows);
    // console.log("id");
    // console.log(id);
    // console.log("thisrow");
  };


  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  

  const processRowUpdate = async (newRow) => {
    // const updatedRow = { ...newRow, isNew: false };
    const updatedRow = { ...newRow};
    console.log("process row update, updated row")
    console.log(updatedRow);
    console.log("process row update, rows")
    console.log(rows);
    setRows(rows.map((row) => (row.id == newRow.id ? updatedRow : row)));

    // var thisrow = rows.filter((row) => row.id == newRow.id);
    var thisrow = updatedRow;
    console.log("thisrow")
    console.log(thisrow);
    var email = thisrow.studentemail;
    var quiz = thisrow.quiz;
    var midsem = thisrow.midsem;
    var endsem = thisrow.endsem;

    if (!quiz && !midsem && !endsem){
      alert("Null values in marks");
      return;
    }

    const res = await axios.post(`${BASE_URL}/admin/courses/${courseInfo.course.courseId}/marks/${courseInfo.course.courseTitle}`,
        {
            studentemail: email,
            quiz,
            midsem,
            endsem
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-type": "application/json"
            }
        });

      console.log(res.data);
      alert(res.data.message);

    return updatedRow;
  };

  // useEffect(processRowUpdate, [rows]);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  
  return <div style={{display:"flex", justifyContent:"center"}}>
    <Box
      sx={{
        backgroundColor:"white",
        minHeight: 300,
        maxHeight: 500,
        marginBottom:10,
        width: '65%',
        borderRadius:6,
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        style={{borderRadius:22}}
        rows={rows}
        // columns={columns}
        columns={tableColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(err) => console.log(err)}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { tableColumns, setTableColumns },
        }}
      />
    </Box>
    </ div>;
}
