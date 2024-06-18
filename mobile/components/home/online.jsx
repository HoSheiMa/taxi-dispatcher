import { View, Text, ActivityIndicator } from "react-native";
import Auth from "../../class/api/auth";
import { useEffect, useRef, useState } from "react";
import { Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Danger, Primary } from "../../class/helper/Theme";
import * as Location from "expo-location";
import { Card, Button } from "react-native-paper";

export default function () {
  let [available, setAvailable] = useState("false"); // loading / online / offline / error
  let [loading, setLoading] = useState(true); // loading / online / offline / error
  let [error, setError] = useState(false); // loading / online / offline / error
  const latitude = useRef(null);
  const longitude = useRef(null);
  async function updateLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError(true);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    latitude.current = location.coords.latitude;
    longitude.current = location.coords.longitude;
  }
  useEffect(() => {
    var t = setInterval(async () => {
      await updateLocation();

      setAvailable((available) => {
        new Auth()
          .toggleAvailable(available, {
            lat: latitude.current,
            long: longitude.current,
          })
          .then(async (user) => {
            if (user) {
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                setError(true);
                setAvailable(false);
                setLoading(false);
                return;
              }
              setAvailable(user.is_available == "true");
              setError(false);
              setLoading(false);
            }
          });
        return available;
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  function toggleAvailable() {
    setLoading(true);

    new Auth().toggleAvailable(!available).then((user) => {
      if (user) {
        setAvailable(user.is_available == "true");
      }
    });
  }
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 12,
        marginBottom: 12,
      }}
    >
      {error ? (
        <Card
          style={{
            marginBottom: 12,
          }}
        >
          <Card.Content>
            <Text variant="titleLarge">Fix Location Permission</Text>
            <Text variant="bodyMedium">
              To help you find your next Order, you should allow location
              permission, if button not working please, do permission manaully
              from app settings
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => Location.requestForegroundPermissionsAsync()}
            >
              Fix
            </Button>
          </Card.Actions>
        </Card>
      ) : null}
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Chip
            style={{
              height: 50,
              width: 100,
              justifyContent: "center",
            }}
            textStyle={{
              fontSize: 18,
            }}
            mode="outlined"
            icon={() => (
              <Icon
                name="circle"
                size={16}
                color={available ? Primary : Danger}
              />
            )}
            onPress={toggleAvailable}
          >
            {available ? "Online" : "Offline"}
          </Chip>
        )}
      </View>
    </View>
  );
}
