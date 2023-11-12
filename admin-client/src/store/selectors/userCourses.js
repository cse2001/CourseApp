import { userState } from "../atoms/user";
import {selector} from "recoil";

export const userCoursesState = selector({
  key: 'userCoursesState',
  get: ({get}) => {
    const state = get(userState);
    return state.userCourses;
  },
});