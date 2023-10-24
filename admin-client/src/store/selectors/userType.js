import { userState } from "../atoms/user";
import {selector} from "recoil";

export const userTypeState = selector({
  key: 'userTypeState',
  get: ({get}) => {
    const state = get(userState);
    return state.userType;
  },
});