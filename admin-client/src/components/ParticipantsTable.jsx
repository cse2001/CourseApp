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
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config.js";
import {userState} from "../store/atoms/user.js";
import { userCoursesState } from "../store/selectors/userCourses.js";


import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Student', 'Admin', 'Development'];
// const randomRole = () => {
//   return randomArrayItem(roles);
// };

// const initialRows = [
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   }
// ];

var courseId;

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick =  () => {
    // ADD SIGNUP FUNCTIONALITY HERE
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const courseInfo = useRecoilValue(courseState);
  const [user, setUser] = useRecoilState(userState);
  const userCourses = useRecoilValue(userCoursesState);

  courseId = courseInfo.course.courseId;
  var participantsList = [];
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
    useEffect(() => {
      axios.get(`${BASE_URL}/admin/courses/${courseInfo.course.courseId}/users`, {
          method: "GET",
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      }).then(res => {
          console.log("users:");
          console.log(res.data.users);
          participantsList = res.data.users;
          participantsList = participantsList.map(row => {
            var newrow = {
              id: row.id,
              name: row.name,
              email: row.email,
              joinDate: randomCreatedDate(),
              role: row.type,
            }
            return newrow;
          })
          setRows(participantsList);

      })
      .catch(e => {
          // setCourse({isLoading: false, course: null});
          console.log(e);
      });
  }, []);
 


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
    
    var thisrow = rows.filter((row) => row.id == id);
    var email = thisrow[0].email;
    const res = await axios.post(`${BASE_URL}/admin/courses/${courseId}`, {
          username: email
      }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              "Content-type": "application/json"
          }
      });
      const data = res.data;
      console.log(data);
      alert(res.data.message);

      if (user.userEmail == email){
        const newUserCourses = [...user.userCourses, courseId];
        // setUserCourses(newUserCourses);
        setUser({
            ...user,
            userCourses: newUserCourses,
        });
      }
  };

  const handleDeleteClick = (id) => async () => {
    // id is the userId
    var thisrow = rows.filter((row) => row.id == id);
    var email = thisrow[0].email;

    setRows(rows.filter((row) => row.id !== id));
    const res = await axios.put(`${BASE_URL}/admin/deletecourse/${courseId}`, {
      username: email
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-type": "application/json"
        }
    });
    const data = res.data;
    console.log(data);
    alert(res.data.message);

    if (user.userEmail == email){

      const newUserCourses = userCourses.filter(item => item !== courseId);
      setUser({
          ...user,
          userCourses: newUserCourses,
      });
    }

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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: false },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'joinDate',
      headerName: 'Join date',
      type: 'date',
      width: 180,
      editable: false,
    },
    {
      field: 'role',
      headerName: 'User Type',
      width: 180,
      editable: false,
      type: 'singleSelect',
      valueOptions: ['Student', 'Admin',]
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
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
        }

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
      },
    },
  ];

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
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        // slots={{
        //   toolbar: EditToolbar,
        // }}
        // slotProps={{
        //   toolbar: { setRows, setRowModesModel },
        // }}
      />
    </Box>
    </ div>;
}
