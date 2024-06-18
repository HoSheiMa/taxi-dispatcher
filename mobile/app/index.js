import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { PureWhite } from "../class/helper/Theme";
import { ADMIN } from "../class/helper/constants";
import Auth from "../class/api/auth";

export default function App() {
  // check login status
  useEffect(() => {
    new Auth().check().then((check) => {
      // console.log("check", check);
      if (check == true) {
        router.replace("home");
      } else if (check == false) {
        router.replace("signIn");
      }
    });
  }, []);

  // redirect to home or signin depend on status
  // loading feedback
  return (
    <View>
      <Text>LOADING</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PureWhite,
    alignItems: "center",
    justifyContent: "center",
  },
});
