import { userState } from "../atoms/user";
import {selector} from "recoil";
import { courseState } from "../atoms/course";

export const isCourseLoading = selector({
  key: 'isCourseLoaingState',
  get: ({get}) => {
    const state = get(courseState);
    return state.isLoading;
  },
});


export const courseTitle = selector({
  key: 'courseTitleState',
  get: ({get}) => {
    const state = get(courseState);
    if (state.course) {
        return state.course.courseTitle;
    }
    return "";
  },
});

export const courseInstructor = selector({
  key: 'courseInstructorState',
  get: ({get}) => {
    const state = get(courseState);
    if (state.course) {
      return state.course.courseInstructor;
    }
    return "";
    // return state.course;
  },
});


export const courseImageLink = selector({
  key: 'courseImageLinkState',
  get: ({get}) => {
    const state = get(courseState);
    if (state.course) {
        return state.course.imageLink;
    }
    return "";
  },
});

export const courseSubscribers = selector({
  key: 'courseSubscribersState',
  get: ({get}) => {
    const state = get(courseState);
    if (state.course) {
        return state.course.subscribers;
    }
    return "";
  },
});

