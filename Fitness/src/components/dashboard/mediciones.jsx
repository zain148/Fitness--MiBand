import React, { Component } from "react";
import {
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { ScrollView, Dimensions } from "react-native";
import styles from "./styles.jsx";
import PDF from "./pdf.js";

export default class Mediciones extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      deviceBondLevel: 0,
      heartBeatRate: 0,
      steps: 0,
      battery: 0,
      hearBeatList: [],
      contador: 0,
      average: 0,
      isConnectedWithMiBand: false,
      isHeartRateCalculating: false,
      bluetoothSearchInterval: null,
      hrRateInterval: null,
    };
  }

  searchBluetoothDevices = () => {
    this.setState({ isConnectedWithMiBand: true });
    NativeModules.DeviceConnector.enableBTAndDiscover(
      (error, deviceBondLevel) => {
        this.setState({ deviceBondLevel: deviceBondLevel });
      }
    );
    this.setState({
      bluetoothSearchInterval: setInterval(this.getDeviceInfo, 5000),
    });
  };

  unlinkBluetoothDevice = () => {
    this.deactivateHeartRateCalculation();
    NativeModules.DeviceConnector.disconnectDevice((error, deviceBondLevel) => {
      this.setState({ deviceBondLevel: deviceBondLevel });
    });
    clearInterval(this.state.bluetoothSearchInterval);
    this.setState({ bluetoothSearchInterval: null });
    this.setState({ deviceBondLevel: 0 });
    this.setState({ steps: 0 });
    this.setState({ battery: 0 });
    this.setState({ isConnectedWithMiBand: false });
  };

  getDeviceInfo = () => {
    NativeModules.DeviceConnector.getDeviceBondLevel(
      (error, deviceBondLevel) => {
        this.setState({ deviceBondLevel: deviceBondLevel }, () => {
          this.getDeviceBondLevel;
        });
      }
    );
    NativeModules.InfoReceiver.getInfo((error, steps, battery) => {
      this.setState({ steps: steps });
      this.setState({ battery: battery });
    });
  };

  activateHeartRateCalculation = () => {
    NativeModules.HeartBeatMeasurer.startHrCalculation(
      (error, heartBeatRate) => {
        this.setState({ isHeartRateCalculating: true });
        this.setState({ heartBeatRate: heartBeatRate });
      }
    );
    this.setState({ hrRateInterval: setInterval(this.getHeartRate, 15000) });
  };

  deactivateHeartRateCalculation = () => {
    NativeModules.HeartBeatMeasurer.stopHrCalculation();
    this.setState({ isHeartRateCalculating: false });
    this.setState({ hrRateInterval: null });
    //this.setState({ hearBeatList: heartBeatRate });
    this.setState({ heartBeatRate: 0 });
    clearInterval(this.state.hrRateInterval);
    this.state.clearAverage = true;
  };

  getHeartRate = () => {
    NativeModules.HeartBeatMeasurer.getHeartRate(
      this.state.heartBeatRate,
      (error, heartBeatRate) => {
        this.setState({ heartBeatRate: heartBeatRate });
        this.state.hearBeatList.push(heartBeatRate);
        this.state.contador += 1;
      }
    );
  };

  getAverage = () => {
    var values = this.state.hearBeatList;
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
      sum += parseInt(values[i], 10); //don't forget to add the base
    }
    this.state.average = sum / values.length;
  };

  render() {
    ///////////////////////////////////
    var dataGraphics = this.state.hearBeatList;

    var sum = Array.apply(null, new Array(10)).map(Number.prototype.valueOf, 0);
    var sum1 = 0;
    var promedio = 0;
    for (var i = 0; i < dataGraphics.length; i++) {
      sum[i] = parseInt(dataGraphics, 10); //don't forget to add the base
      sum1 += parseInt(dataGraphics[i], 10);
      promedio = parseFloat(sum1 / dataGraphics.length, 10);
    }

    if (this.state.clearAverage) {
      promedio = 0;
    }

    return (
      <View style={styles.container}>
        <Image source={require("./assets/react.png")} />
        <ScrollView>
          {/*Latidos de corazón */}
          <View style={styles.package}>
            <Text style={styles.sensorField}>Latidos de corazón:</Text>
            <Text style={styles.sensorField}>
              {this.state.heartBeatRate + " Lpm"}
            </Text>
          </View>
          {/*<View style={styles.package}>
          <Text style={styles.sensorField}>i:</Text>
          <Text style={styles.sensorField}>{i + " %"}</Text>
        </View>*/}
          <View style={styles.package}>
            <Text style={styles.sensorField}>Batería:</Text>
            <Text style={styles.sensorField}>{this.state.battery + " %"}</Text>
          </View>
          <View style={styles.package}>
            <Text style={styles.sensorField}>Pasos:</Text>
            <Text style={styles.sensorField}>{this.state.steps}</Text>
          </View>
          {/*<View style={styles.package}>
                  <Text style={styles.sensorField}>Calorias:</Text>
                  <Text style={styles.sensorField}>{promedio}</Text>
                </View>*/}

          <View />

          {/*------------------Gráfica-------------------------*/}
          <View>
            <Text>Promedio</Text>
          </View>

          <ProgressChart
            data={[promedio / 100]}
            width={Dimensions.get("window").width - 25}
            height={100}
            chartConfig={{
              barPercentage: 0.5,
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(51, 175, 255, ${opacity})`,
              style: {
                marginVertical: 8,
                borderRadius: 16,
              },
            }}
          />

          <View style={styles.buttonContainer}>
            {this.state.isConnectedWithMiBand ? (
              <TouchableOpacity
                style={styles.buttonEnabled}
                onPress={this.unlinkBluetoothDevice}
              >
                <Text style={styles.buttonText}>Desvincularse con MiBand</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonEnabled}
                onPress={this.searchBluetoothDevices}
              >
                <Text style={styles.buttonText}>Vincularse con MiBand</Text>
              </TouchableOpacity>
            )}
            <View style={styles.spacing} />
            {/*Button Average*/}
            {/*{this.state.isConnectedWithMiBand ? (
                    <TouchableOpacity
                      style={styles.buttonEnabled}
                      onPress={(this.unlinkBluetoothDevice, this.getAverage)}
                      //onPress={this.getAverage}
                    >
                      <Text style={styles.buttonText}>
                        Promedio: {this.state.average}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonDisabled}
                      disabled={true}
                    >
                      <Text style={styles.buttonText}>Promedio</Text>
                    </TouchableOpacity>
                  )}*/}

            <View style={styles.spacing} />

            {this.state.isConnectedWithMiBand ? (
              this.state.isHeartRateCalculating ? (
                <TouchableOpacity
                  style={styles.buttonEnabled}
                  onPress={this.deactivateHeartRateCalculation}
                  disabled={false}
                >
                  <Text style={styles.buttonText}>Parar medida de RC</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonEnabled}
                  onPress={this.activateHeartRateCalculation}
                  disabled={false}
                >
                  <Text style={styles.buttonText}>Empezar medida de RC</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
                <Text style={styles.buttonText}>Empezar medida de RC</Text>
              </TouchableOpacity>
            )}
            {/*PDF */}

            <View style={styles.spacing} />
            <View>
              <PDF />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
