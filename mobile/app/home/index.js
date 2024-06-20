import { View, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FullHeight } from "../../class/helper/Theme";
import Online from "../../components/home/online";
import JobDescription from "../../components/home/JobDescription";
import AppointmentsModel from "../../components/home/AppointmentsModel";
import { useKeepAwake } from "expo-keep-awake";

export default function Page() {
  useKeepAwake();
  return (
    <SafeAreaView
      style={{
        backgroundColor: "f6f6f6",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Online />
        <JobDescription />
        <AppointmentsModel />
      </View>
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
