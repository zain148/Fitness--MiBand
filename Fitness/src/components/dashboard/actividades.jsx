import React, { Component } from "react";
import {
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  Button,
} from "react-native";
import { ScrollView, Dimensions } from "react-native";
import styles from "./styles.jsx";
import Mediciones from "./mediciones";

const { width } = Dimensions.get("window");

export default class Actividades extends React.Component {
  state = {
    filePath: "",
  };

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
      clearAverage: false,
      FcK1: 0,
      FcK2: 0,
      FcK3: 0,
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

  getExercise = () => {
    //Frecuencia cardiaca Karvonen formula
    var heartBeat = this.state.heartBeatRate;
    var FCM = this.state.heartBeatRate - 34;
    var FCR = (this.state.heartBeatRate / 15) * 4;
    var value = (220 - 34 - FCR) * 0.7 + FCR;
    //var value = 135;
    var FcK = 135;
    if (value < 110 || 115 > value) {
      this.state.FcK1 = value;
    }
    if (value < 115 || 133 > value) {
      this.state.FcK2 = value;
    }
    if (value > 134) {
      this.state.FcK3 = value;
    }
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

    return (
      <View style={styles.container}>
        <ScrollView>
          {/*Latidos de corazón */}
          <View style={styles.package}>
            <Text style={styles.sensorField}>F.C. Actual:</Text>
            <Text style={styles.sensorField}>
              {this.state.heartBeatRate + " Lpm"}
            </Text>
          </View>
          <Text>
            El siguiente entrenamiento es basado en su frecuencia cardiaca para
            que sea apto a su nivel de resistencia, para evitar fatigas y
            lesiones.
          </Text>
          <View style={styles.spacing} />
          {this.state.isHeartRateCalculating ? (
            <View style={styles.packageActivity}>
              <Text style={styles.sensorField}>
                Actividad física 3 opciones:
              </Text>
            </View>
          ) : null}

          {this.state.isHeartRateCalculating ? (
            <TouchableOpacity>
              <View style={styles.package}>
                {this.state.FcK1 > 110 && (
                  <Text style={styles.sensorField}>
                    · Realizar calentamiento y estiramientos · Caminar a paso
                    moderado De 20 a 40 minutos
                  </Text>
                )}
              </View>
              <View style={styles.package}>
                {this.state.FcK2 > 115 && (
                  <Text style={styles.sensorField}>
                    · Realizar calentamiento y estiramientos · Caminar a paso
                    rápido De 40 a 80 minutos
                  </Text>
                )}
              </View>
              <View style={styles.package}>
                {this.state.FcK3 > 133 && (
                  <Text style={styles.sensorField}>
                    · Realizar calentamiento y estiramiento · Trotar a ritmo
                    constante Durante 20 minutos
                  </Text>
                )}
              </View>
              <View style={styles.spacingExercices} />
              <Button
                title="Generar Actividad Física"
                onPress={this.getExercise}
                disabled={false}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <View style={styles.spacingExercices} />
              <Button
                title="Generar Actividad Física"
                style={styles.buttonDisabled}
                disabled={true}
              />
            </TouchableOpacity>
          )}
          <View style={styles.spacing} />
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
          </View>
        </ScrollView>
      </View>
    );
  }
}
