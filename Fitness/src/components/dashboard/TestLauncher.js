import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  Platform
} from "react-native";

import test1 from "./tests1";

const red = "#FF0000";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: -50,
    marginBottom: 50
  },
  button: {
    marginVertical: Platform.OS === "android" ? 5 : 0
  }
});

export default class TestLauncher extends Component {
  render() {
    const { onLaunchTest } = this.props;

    const TestButton = ({ test, longRunning = false }) => (
      <View style={styles.button}>
        <Button
          title={`Test ${test[0]}`}
          color={longRunning ? red : undefined}
          onPress={() => onLaunchTest(test[0], test[1])}
        />
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Tap a button to launch a test</Text>
        <TestButton test={[1, test1]} longRunning />
      </SafeAreaView>
    );
  }
}
