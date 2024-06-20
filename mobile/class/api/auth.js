import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  APPOINT,
  APPOINTMENT,
  LOGIN,
  LOGOUT,
  ME,
  TOGGLE_AVAILABLE,
  UPDATE_ORDER_STATUS,
} from "../helper/constants";

export default class Auth {
  async check() {
    // get saved token
    var token = await AsyncStorage.getItem("token");

    if (!token) return false;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(ME, requestOptions);
    response = await response.json();
    if (response.error || response.message == "Unauthenticated.") return false;

    return true;
  }

  async getAppointments() {
    // get saved token
    var token = await AsyncStorage.getItem("token");

    if (!token) return false;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(APPOINTMENT, requestOptions);
    response = await response.json();
    if (response.error || response.message == "Unauthenticated.") return false;

    return response;
  }
  async me() {
    // get saved token
    var token = await AsyncStorage.getItem("token");
    if (!token) return false;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    var response = await fetch(ME, requestOptions);
    var response = await response.json();
    if (response.error || response.message == "Unauthenticated.") return false;
    return response;
  }
  async logout() {
    // get saved token
    var token = await AsyncStorage.getItem("token");
    if (!token) return;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(LOGOUT, requestOptions);
    await AsyncStorage.removeItem("token");
  }
  async updateOrderStatus(order, status) {
    // get saved token
    var token = await AsyncStorage.getItem("token");
    if (!token) return;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    // console.log("TOGGLE_AVAILABLE(status)", TOGGLE_AVAILABLE(status));
    // console.log("token", token);

    let response = await fetch(
      UPDATE_ORDER_STATUS(order, status),
      requestOptions
    );
    response = await response.json();

    if (response.error || response.message == "Unauthenticated.") return false;
    return response;
  }
  async toggleAvailable(status, payload = {}) {
    // get saved token
    var token = await AsyncStorage.getItem("token");
    if (!token) return;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(payload),
    };

    // console.log("TOGGLE_AVAILABLE(status)", TOGGLE_AVAILABLE(status));
    // console.log("token", token);

    let response = await fetch(TOGGLE_AVAILABLE(status), requestOptions);
    response = await response.json();
    if (response.error || response.message == "Unauthenticated.") return false;
    return response;
  }
  async appoint(appoint_id) {
    // get saved token
    var token = await AsyncStorage.getItem("token");
    if (!token) return;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(APPOINT(appoint_id), requestOptions);
    response = await response.json();
    if (response.error || response.message == "Unauthenticated.") return false;
    return response;
  }

  async login(email, password) {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        email,
        password,
      }),
      redirect: "follow",
    };
    // do login request
    var response = await fetch(LOGIN, requestOptions);
    var response = await response.json();
    if (
      (response.error && !response.access_token) ||
      response.message == "Unauthenticated."
    ) {
      console.log("Unauthenticated");
      return false;
    }
    // save fresh token
    await AsyncStorage.setItem("token", response.access_token);
    return true;
  }
}
