import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Appbar from "./components/Appbar.jsx";
import CreateCourse from "./components/CreateCourse.jsx";
import AllCourses from "./components/AllCourses";
import Course from "./components/Course";
import {Landing} from "./components/Landing.jsx";
import {AdminLogin} from "./components/AdminLogin.jsx";
import {StudentLogin} from "./components/StudentLogin.jsx";
import { userState } from "./store/atoms/user.js";

import axios from "axios";
import {BASE_URL} from "./config.js";
import {useEffect} from "react";

function App() {
    return (
        <RecoilRoot>
            <div style={{width: "100vw",
                minHeight: "100vh",
                backgroundColor: "#808080"}}
            >
                    <Router>
                        <Appbar />
                        <InitUser />
                        <Routes>
                            <Route path={"/createcourse"} element={<CreateCourse />} />
                            <Route path={"/course/:courseId"} element={<Course />} />
                            <Route path={"/allcourses"} element={<AllCourses />} />
                            <Route path={"/signin"} element={<Signin />} />
                            <Route path={"/signup"} element={<Signup />} />
                            <Route path={"/admin_login"} element={<AdminLogin />} />
                            <Route path={"/student_login"} element={<StudentLogin />} />
                            <Route path={"/"} element={<Landing />} />
                        </Routes>
                    </Router>
            </div>
        </RecoilRoot>
    );
}


function InitUser() {
    const setUser = useSetRecoilState(userState);
    const init = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/me`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })

            if (response.data.username) {
                setUser({
                    isLoading: false,
                    userEmail: response.data.username,
                    userType: response.data.userType,
                    userCourses: response.data.userCourses,
                })
            } else {
                setUser({
                    isLoading: false,
                    userEmail: null,
                    userType: null,
                    userCourses: null,
                })
            }
        } catch (e) {

            setUser({
                isLoading: false,
                userEmail: null,
                userType: null,
                userCourses: null,
            })
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>
}

export default App;