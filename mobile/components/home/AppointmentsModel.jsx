import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import Auth from "../../class/api/auth";
import { useEffect, useState } from "react";
import { Button, Chip } from "react-native-paper";
import { Black, Danger, Primary, White } from "../../class/helper/Theme";
import Modal from "react-native-modal";
const Pulse = require("react-native-pulse").default;
import Timeline from "react-native-timeline-flatlist";
import { Audio } from "expo-av";
import moment from "moment";
import { maxAwaitTimeInSeconds } from "../../class/helper/constants";
import { Snackbar } from "react-native-paper";

export default function (props) {
  let [data, setData] = useState([
    { title: "Start Point", description: "" },
    { title: "End Point", description: "" },
  ]);
  let [modelVisible, setModelVisible] = useState(false);
  let [appointment, setAppointment] = useState(null);
  let [order, setOrder] = useState(null);
  let [accepted, setAccepted] = useState(false);
  // sounds
  let [soundPlayer, setSoundPlayer] = useState();
  let [soundPlayerStatus, setSoundPlayerStatus] = useState(false);

  async function stopSound() {
    setSoundPlayer((oldSoundPlayer) => {
      if (oldSoundPlayer) {
        oldSoundPlayer.stopAsync();
        setSoundPlayerStatus(false);
        return null;
      }
    });
  }
  async function playSound() {
    setSoundPlayerStatus((oldSoundPlayerStatus) => {
      if (oldSoundPlayerStatus == true) return;
      Audio.Sound.createAsync(
        require("../../assets/sounds/uber_tune.mp3")
      ).then(async ({ sound }) => {
        if (soundPlayer) {
          soundPlayer.stopAsync();
          soundPlayer.unloadAsync();
        }
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
        setSoundPlayer(sound);
      });
      return true;
    });
  }
  useEffect(() => {
    return soundPlayer
      ? () => {
          soundPlayer.stopAsync();
          soundPlayer.unloadAsync();
        }
      : undefined;
  }, [soundPlayer]);

  useEffect(() => {
    var timer = () => {
      new Auth().getAppointments().then(async (__appointment) => {
        // console.log(__appointment);
        if (__appointment && __appointment.appoint) {
          if (__appointment.appoint.status == "await") {
            setAppointment(__appointment.appoint);
            setOrder(__appointment.order);
            setData([
              {
                title: "Start Point",
                description: __appointment.order.start_location,
              },
              {
                title: "End Point",
                description: __appointment.order.end_location,
              },
            ]);

            setModelVisible(true);
            playSound();
          }
        } else {
          setModelVisible(false);
          setAppointment(null);
          setOrder(null);
          stopSound();
        }
      });
    };
    var t = setInterval(timer, 1000);
    return () => {
      if (soundPlayer) {
        soundPlayer.stopAsync();
        soundPlayer.unloadAsync();
      }
      window.clearInterval(t);
    };
  }, []);

  function accept(appoint_id) {
    new Auth().appoint(appoint_id).then((response) => {
      if (response) {
        setAccepted(true);
        stopSound();
        setTimeout(() => {
          setAccepted(false);
        }, 500);
      }
    });
  }

  return (
    <View>
      <Modal
        testID={"modal"}
        animationOutTiming={600}
        animationInTiming={600}
        isVisible={modelVisible}
        onSwipeComplete={this.close}
        swipeDirection={["left", "right", "down"]}
        style={styles.view}
      >
        {accepted ? (
          <View style={styles.content}>
            <Image
              style={{
                width: 200,
                height: 200,
              }}
              source={require("../../assets/accepted.gif")}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Pulse
              color={Black + "30"}
              numPulses={3}
              diameter={300}
              speed={5}
              duration={600}
            />
            <Text style={styles.contentTitle}>Hi 👋!</Text>
            <Timeline
              style={{
                width: "100%",
              }}
              titleStyle={{
                marginTop: -12,
              }}
              circleColor="rgb(0,0,0)"
              lineColor="rgb(0,0,0)"
              showTime={false}
              data={data}
            />
            <Button
              mode="elevated"
              buttonColor={Primary}
              textColor={White}
              style={{
                width: "100%",
              }}
              onPress={() => accept(appointment.id)}
            >
              <Text>
                ACCEPT {"  "}({" "}
                {appointment
                  ? maxAwaitTimeInSeconds +
                    moment(appointment.created_at).diff(
                      moment.MomentInput,
                      "second"
                    )
                  : ""}{" "}
                seconds )
              </Text>
            </Button>
          </View>
        )}
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
  content: {
    height: 300,
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
});
