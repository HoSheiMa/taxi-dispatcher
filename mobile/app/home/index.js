import { View, Text, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../class/utils/supabase";
import { router } from "expo-router";
import Auth from "../../class/api/auth";
import { useEffect, useState } from "react";
import { Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Danger,
  FullHeight,
  FullWidth,
  Primary,
} from "../../class/helper/Theme";
import Online from "../../components/home/online";
import JobDescription from "../../components/home/JobDescription";
import AppointmentsModel from "../../components/home/AppointmentsModel";
import { Image } from "expo-image";

export default function Page() {
  return (
    <SafeAreaView style={{ backgroundColor: "f6f6f6" }}>
      <Online />
      <JobDescription />
      <AppointmentsModel />
      {/* <View>
        <Button
          mode="contained-tonal"
          onPress={() => {
            new Auth().logout().then(() => router.replace("/"));
          }}
        >
          Logout
        </Button>
      </View> */}
    </SafeAreaView>
  );
}
