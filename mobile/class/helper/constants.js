import { Platform } from "react-native";

// roles
const DRIVER = "driver";
const ADMIN = "admin";

// api
let URL = "http://10.0.2.2:8000";
const LOGIN = `${URL}/api/auth/login`;
const LOGOUT = `${URL}/api/auth/logout`;
const ME = `${URL}/api/auth/me`;
const APPOINTMENT = `${URL}/api/order/appointment/me`;
const TOGGLE_AVAILABLE = (status) => `${URL}/api/online/${status}`;
const UPDATE_ORDER_STATUS = (order, status) =>
  `${URL}/api/order/${order}/status/${status}`;

const APPOINT = (appoint_id) => `${URL}/api/order/appointment/${appoint_id}`;
const maxAwaitTimeInSeconds = 10;
export {
  DRIVER,
  ADMIN,
  LOGIN,
  ME,
  LOGOUT,
  TOGGLE_AVAILABLE,
  APPOINT,
  UPDATE_ORDER_STATUS,
  APPOINTMENT,
  maxAwaitTimeInSeconds,
};
