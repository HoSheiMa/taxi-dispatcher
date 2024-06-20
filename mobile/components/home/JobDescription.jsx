import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  TouchableOpacity,
} from "react-native";
import Auth from "../../class/api/auth";
import { PureComponent, useEffect, useState } from "react";
import { Button, Surface } from "react-native-paper";
import {
  Black,
  Danger,
  Primary,
  PureWhite,
  Secondary,
  White,
} from "../../class/helper/Theme";
import { Icon, MD3Colors } from "react-native-paper";
import moment from "moment";
import { Image } from "expo-image";
import ReactNativeModal from "react-native-modal";
export default function () {
  let [order, setOrder] = useState(null);
  let [showConfirmModel, setShowConfirmModel] = useState(false);
  useEffect(() => {
    setInterval(() => {
      new Auth().getAppointments().then(async (__appointment) => {
        if (
          __appointment.order &&
          ["delivered", "delivering", "accepted"].includes(
            __appointment.order.status
          )
        ) {
          setOrder(__appointment.order);
        } else {
          setOrder(null);
        }
      });
    }, 1000);
  }, []);

  function startOrder() {
    new Auth().updateOrderStatus(order.id, "delivering").then(() => {
      Linking.openURL(
        `https://www.google.es/maps/dir/'${order.start_location_lat_long}'/'${order.end_location_lat_long}'`
      );
    });
  }

  function deliveredOrder() {
    new Auth().updateOrderStatus(order.id, "delivered");
  }
  function openOrderLocation() {
    // Linking.openURL(
    //   `https://www.google.es/maps/dir/'${order.start_location_lat_long}'` +
    //     (order.end_location_lat_long
    //       ? `/'${order.end_location_lat_long}'`
    //       : "/''")
    // );

    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${order.start_location_lat_long}`;
    const label = "Start Location";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }
  function cancelOrder(confirm = false) {
    if (confirm) {
      setShowConfirmModel(false);
      new Auth().updateOrderStatus(order.id, "cancelled").then(() => {});
    } else {
      setShowConfirmModel(true);
    }
  }

  return order ? (
    <ScrollView>
      <Text style={{ textAlign: "center", fontSize: 28 }}>
        Order #{order.id}
      </Text>

      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            Linking.openURL(`tel:${order.phone}`);
          }}
        >
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="file-account" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>NAME</Text>
              <Text style={{ textTransform: "uppercase" }}>{order.name}</Text>
            </View>
          </Surface>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            Linking.openURL(`tel:${order.phone}`);
          }}
        >
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="file-account" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>PHONE</Text>
              <Text style={{ textTransform: "uppercase" }}>{order.phone}</Text>
            </View>
          </Surface>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.box}>
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="home-floor-a" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>START LOCATION</Text>
              <Text style={{ textTransform: "uppercase" }}>
                {order.start_location}
              </Text>
            </View>
          </Surface>
        </View>
        <View style={styles.box}>
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="map-marker" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>END{"\n"}LOCATION</Text>
              <Text style={{ textTransform: "uppercase" }}>
                {order.end_location}
              </Text>
            </View>
          </Surface>
        </View>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.box}>
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="clock-time-eight" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>CREATED AT</Text>
              <Text style={{ textTransform: "uppercase" }}>
                {moment(order.created_at).fromNow()}
              </Text>
            </View>
          </Surface>
        </View>
        <View style={styles.box}>
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="file-account" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>START AT</Text>
              <Text style={{ textTransform: "uppercase" }}>
                {moment(order.start_at).fromNow()}
              </Text>
            </View>
          </Surface>
        </View>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.box}>
          <Surface style={styles.surface} elevation={2}>
            <View style={{ flex: 1 }}>
              <Icon source="credit-card-outline" color={Black} size={26} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontWeight: "bold" }}>PAYMENT TYPE</Text>
              <Text style={{ textTransform: "uppercase" }}>
                {order.payment_type}
              </Text>
            </View>
          </Surface>
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <View style={{ width: "90%" }}>
          {order.status == "accepted" ? (
            <Button
              onPress={startOrder}
              mode="elevated"
              buttonColor={Primary}
              textColor={White}
              style={{
                width: "100%",
              }}
            >
              <Text>START ORDER</Text>
            </Button>
          ) : (
            <View>
              <Button
                onPress={openOrderLocation}
                mode="elevated"
                buttonColor={Primary}
                textColor={White}
                style={{
                  width: "100%",
                }}
              >
                <Text>OPEN LOCATION</Text>
              </Button>
              <Button
                onPress={deliveredOrder}
                mode="elevated"
                buttonColor={Primary}
                textColor={White}
                style={{
                  width: "100%",
                  marginTop: 12,
                }}
              >
                <Text>DELIVERED ORDER</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <View style={{ width: "90%" }}>
          <Button
            onPress={() => cancelOrder()}
            mode="text"
            textColor={Danger}
            style={{
              width: "100%",
            }}
          >
            <Text>CANCEL ORDER</Text>
          </Button>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ReactNativeModal
          testID={"modal"}
          isVisible={showConfirmModel}
          swipeDirection={["up", "left", "right", "down"]}
          style={styles.view}
        >
          <View style={styles.content}>
            <Text style={styles.contentTitle}>
              Are you Sure you want to Cancel Order?
            </Text>
            <View style={styles.buttonWrapper}>
              <Button
                style={styles.button}
                buttonColor={Danger}
                textColor={PureWhite}
                onPress={() => cancelOrder(true)}
              >
                <Text>Yes</Text>
              </Button>
              <Button
                style={styles.button}
                buttonColor={Primary}
                textColor={PureWhite}
                onPress={() => setShowConfirmModel(false)}
              >
                <Text>No</Text>
              </Button>
            </View>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  ) : (
    <View style={{ alignItems: "center" }}>
      <Image
        source={require("../../assets/empty.webp")}
        style={{ width: 300, height: 300 }}
      />
      <Text style={{ fontSize: 24 }}>No Order Details</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    flexDirection: "row",
  },
  box: {
    maxWidth: "50%",
    minWidth: "50%",
    alignItems: "center",
    height: 90,
  },
  surface: {
    flexDirection: "row",
    maxWidth: "90%",
    borderRadius: 12,
    flex: 1,
    backgroundColor: PureWhite,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  buttonWrapper: {
    flexDirection: "row",
  },
  button: {
    width: "40%",
    margin: 12,
  },
});
