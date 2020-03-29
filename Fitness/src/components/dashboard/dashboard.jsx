import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  NativeModules,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Button,
  WebView,
  Animated,
  TouchableHighlight
} from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import { ScrollView, Dimensions } from "react-native";
import styles from "./styles.jsx";
import Dashboards from "./dashboard.js";
import { Table, Row, Rows } from "react-native-table-component";
import { createBottomTanNavigator } from "react-navigation";
import HTML from "react-native-render-html";
import { RNHTMLtoPDF } from "react-native-html-to-pdf";
import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";

import { Mediciones } from "./mediciones";

/*var dataGraphics = Array.apply(null, new Array(10)).map(
  Number.prototype.valueOf,
  0
);*/
//var values1=[]

const { width } = Dimensions.get("window");

export default class Dashboard extends React.Component {
  state = {
    filePath: ""
  };

  constructor(props) {
    super(props);

    this.state = {
      text: "",
      deviceBondLevel: 0,
      heartBeatRate: 0,
      steps: 0,
      battery: 0,
      //data: [],
      hearBeatList: [],
      contador: 0,
      average: 0,
      isConnectedWithMiBand: false,
      isHeartRateCalculating: false,
      bluetoothSearchInterval: null,
      hrRateInterval: null,
      tableHead: ["Columna", "Columna", "Columna", "Columna"],
      tableData: [
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"]
      ],
      active: 0,
      tabMediciones: 0,
      tabActividad: 0,
      translateX: new Animated.Value(0),
      translateXMediciones: new Animated.Value(0),
      translateXActividades: new Animated.Value(width),
      translateY: -1000,
      clearAverage: false,
      FcK1: 0,
      FcK2: 0,
      FcK3: 0
    };
  }

  handleSlide = type => {
    let {
      active,
      tabMediciones,
      tabActividad,
      translateX,
      translateXMediciones,
      translateXActividades
    } = this.state;
    Animated.spring(translateX, {
      toValue: type,
      duration: 100
    }).start();

    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXMediciones, {
          toValue: 0,
          duration: 100
        }).start(),
        Animated.spring(translateXActividades, {
          toValue: width,
          duration: 100
        }).start()
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXMediciones, {
          toValue: -width,
          duration: 100
        }).start(),
        Animated.spring(translateXActividades, {
          toValue: 0,
          duration: 100
        }).start()
      ]);
    }
  };

  askPermission() {
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "CameraExample App External Storage Write Permission",
            message:
              "CameraExample App needs access to Storage data in your SD Card "
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          //changing the state to show Create PDF option
          that.createPDF();
        } else {
          alert("WRITE_EXTERNAL_STORAGE permission denied");
        }
      } catch (err) {
        alert("Write permission err", err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    if (Platform.OS === "android") {
      requestExternalWritePermission();
    } else {
      this.createPDF();
    }
  }

  async createPDF() {
    let options = {
      //Content to print
      html:
        '<h1 style="text-align: center;"><strong>Hola</strong></h1><p style="text-align: center;">Here is an example of pdf Print in React Native</p><p style="text-align: center;"><strong>Team About React</strong></p>',
      //File Name
      fileName: "test1",
      //File directory
      directory: "docs"
    };
    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    this.setState({ filePath: file.filePath });
  }

  searchBluetoothDevices = () => {
    this.setState({ isConnectedWithMiBand: true });
    NativeModules.DeviceConnector.enableBTAndDiscover(
      (error, deviceBondLevel) => {
        this.setState({ deviceBondLevel: deviceBondLevel });
      }
    );
    this.setState({
      bluetoothSearchInterval: setInterval(this.getDeviceInfo, 5000)
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

  /*getGraphic = () => {
    var dataGraphics = Array.apply(null, new Array(10)).map(
      Number.prototype.valueOf,
      0
    );
    var values1 = this.state.hearBeatList;

    for (var i = 0; i < values1.length; i++) {
      dataGraphics[i] = parseInt(values1[i], 10); //don't forget to add the base
    }
  };*/

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
    //console.log(list);

    /*if (this.state.heartBeatRate) {
      lista[this.state.contador] = this.state.heartBeatRate;
      //lista.push(this.state.heartBeatRate);
    }*/

    //Tabs Views

    let {
      tabMediciones,
      tabActividad,
      translateX,
      active,
      translateXMediciones,
      translateXActividades,
      translateY
    } = this.state;

    return (
      <View style={styles.container}>
        <View>
          {/*TabView Top */}
          <View
            style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 40,
                marginBottom: 20,
                height: 36,
                position: "relative"
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  backgroundColor: "#33AFFF",
                  borderRadius: 4,
                  transform: [
                    {
                      translateX
                    }
                  ]
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#33AFFF",
                  borderRadius: 4,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                }}
                onLayout={event =>
                  this.setState({ tabMediciones: event.nativeEvent.layout.x })
                }
                onPress={() =>
                  this.setState({ active: 0 }, () =>
                    this.handleSlide(tabMediciones)
                  )
                }
              >
                <Text style={{ color: active === 0 ? "#fff" : "#33AFFF" }}>
                  Mediciones
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#33AFFF",
                  borderRadius: 4,
                  borderLeftWidth: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
                onLayout={event =>
                  this.setState({ tabActividad: event.nativeEvent.layout.x })
                }
                onPress={() =>
                  this.setState({ active: 1 }, () =>
                    this.handleSlide(tabActividad)
                  )
                }
              >
                <Text style={{ color: active === 1 ? "#fff" : "#33AFFF" }}>
                  Actividad Física
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Animated.View
                style={{
                  transform: [{ translateX: translateXMediciones }]
                }}
                onLayout={event =>
                  this.setState({
                    translateY: event.nativeEvent.layout.height
                  })
                }
              >
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
                  <Text style={styles.sensorField}>
                    {this.state.battery + " %"}
                  </Text>
                </View>
                <View style={styles.package}>
                  <Text style={styles.sensorField}>Pasos:</Text>
                  <Text style={styles.sensorField}>{this.state.steps}</Text>
                </View>
                <View style={styles.package}>
                  <Text style={styles.sensorField}>Calorias:</Text>
                  <Text style={styles.sensorField}>{promedio}</Text>
                </View>

                <View></View>

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
                      borderRadius: 16
                    }
                  }}
                />

                <View style={styles.buttonContainer}>
                  {this.state.isConnectedWithMiBand ? (
                    <TouchableOpacity
                      style={styles.buttonEnabled}
                      onPress={this.unlinkBluetoothDevice}
                    >
                      <Text style={styles.buttonText}>
                        Desvincularse con MiBand
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonEnabled}
                      onPress={this.searchBluetoothDevices}
                    >
                      <Text style={styles.buttonText}>
                        Vincularse con MiBand
                      </Text>
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
                        <Text style={styles.buttonText}>
                          Parar medida de RC
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.buttonEnabled}
                        onPress={this.activateHeartRateCalculation}
                        disabled={false}
                      >
                        <Text style={styles.buttonText}>
                          Empezar medida de RC
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonDisabled}
                      disabled={true}
                    >
                      <Text style={styles.buttonText}>
                        Empezar medida de RC
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.spacing} />
                  <View>
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: "gray",
                        borderWidth: 1
                      }}
                      onChangeText={text => this.setState({ input: text })}
                    />
                    <Text>{"Alimentos: " + this.state.input}</Text>
                  </View>
                  {/*PDF */}

                  {/*<View style={styles.spacing} />
                  <View>
                    <Dashboards />
                  </View>*/}
                </View>
              </Animated.View>

              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: translateXActividades
                    },
                    {
                      translateY: -translateY
                    }
                  ]
                }}
              >
                {/*Latidos de corazón */}
                <View style={styles.package}>
                  <Text style={styles.sensorField}>F.C. Actual:</Text>
                  <Text style={styles.sensorField}>
                    {this.state.heartBeatRate + " Lpm"}
                  </Text>
                </View>
                <Text>
                  El siguiente entrenamiento es basado en su frecuencia cardiaca
                  para que sea apto a su nivel de resistencia, para evitar
                  fatigas y lesiones.
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
                          · Realizar calentamiento y estiramientos · Caminar a
                          paso moderado De 20 a 40 minutos
                        </Text>
                      )}
                    </View>
                    <View style={styles.package}>
                      {this.state.FcK2 > 115 && (
                        <Text style={styles.sensorField}>
                          · Realizar calentamiento y estiramientos · Caminar a
                          paso rápido De 40 a 80 minutos
                        </Text>
                      )}
                    </View>
                    <View style={styles.package}>
                      {this.state.FcK3 > 133 && (
                        <Text style={styles.sensorField}>
                          · Realizar calentamiento y estiramiento · Trotar a
                          ritmo constante Durante 20 minutos
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
              </Animated.View>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: translateXActividades
                    },
                    {
                      translateY: -translateY
                    }
                  ]
                }}
              ></Animated.View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
