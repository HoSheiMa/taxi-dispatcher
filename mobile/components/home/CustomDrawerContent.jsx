// components/CustomDrawerContent.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FullHeight } from "../../class/helper/Theme";
import Auth from "../../class/api/auth";
import { router } from "expo-router";

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={() => {
              new Auth().logout().then(() => {
                router.replace("signIn");
              });
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            alignItems: "center",
          }}
          onPress={() =>
            Linking.openURL("https://www.freelancer.com/u/wadielnatrontv")
          }
        >
          <Text>Powered By Qandil</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  logoutContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logoutText: {
    fontSize: 14,
    color: "red",
  },
});

export default CustomDrawerContent;
