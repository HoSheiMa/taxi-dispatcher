import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Button, TextInput } from "react-native-paper";
import { FullHeight, PureWhite } from "../../class/helper/Theme";
import { ScrollView } from "react-native";
import { supabase } from "../../class/utils/supabase";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import Auth from "../../class/api/auth";

export default function Page() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.WrapperContent}>
          <View style={styles.content}>
            <Image
              source={require("../../assets/texi.png")}
              style={styles.image}
            />
            <Formik
              initialValues={{
                email: "driver@admin.com",
                password: "driver@admin.com",
              }}
              onSubmit={async ({ email, password }) => {
                // console.log("Login with", email);
                setLoading(true);
                let response = await new Auth().login(email, password);
                if (response == false) {
                  setLoading(false);
                  return setError(
                    "Unexpected error occurred please try again later."
                  );
                }
                router.replace("home");
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    style={styles.input}
                    value={values.email}
                  />
                  <TextInput
                    mode="outlined"
                    secureTextEntry={true}
                    label="Password"
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <Button
                    disabled={loading}
                    style={styles.loginButton}
                    mode="contained-tonal"
                    onPress={handleSubmit}
                  >
                    Login
                  </Button>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  ></View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  WrapperContent: {
    backgroundColor: PureWhite,
    alignItems: "center",
  },
  content: {
    height: FullHeight,
    justifyContent: "flex-start",
    padding: 15,
    width: "100%",
    maxWidth: 600,
  },
  loginButton: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 6,
  },
  registerButtonText: {
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 30,
  },
  input: {
    marginTop: 12,
  },
  txt1: {
    marginTop: 6,
  },
});
