import {atom} from "recoil";

export const rowState = atom({
  key: 'rowState',
  default: {
    isLoading: true,
    row: null
  },
});