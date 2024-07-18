import { atom } from "recoil";

export const resultArray = atom({
  key: "resultArray",
  default: [],
});

export const userValue = atom({
  key: "userValue",
  default: {
    name: "",
    email: "",
    cutOff: 0,
  },
});

export const userCommunity = atom({
  key: "userCommunity",
  default: {
    community: "oc",
  },
});
