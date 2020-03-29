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

/*var dataGraphics = Array.apply(null, new Array(10)).map(
  Number.prototype.valueOf,
  0
);*/
//var values1=[]

const { width } = Dimensions.get("window");

export default class Mediciones extends React.Component {
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
      translateXActividades: new Animated.Value(width)
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
    //Frecuencia cardiaca Karvonen formula
    var heartBeat = this.state.heartBeatRate;
    var FCM = this.state.heartBeatRate - 34;
    var FCR = (this.state.heartBeatRate / 15) * 4;
    var i = (191 - 34 - FCR) * 0.7 + FCR;
    var FcK = 135;

    ///////////////////////////////////
    var dataGraphics = this.state.hearBeatList;

    var sum = Array.apply(null, new Array(10)).map(Number.prototype.valueOf, 0);
    for (var i = 0; i < dataGraphics.length; i++) {
      sum[i] = parseInt(dataGraphics, 10); //don't forget to add the base
    }

    //console.log(list);
    if (i > 100 || 115 < i) {
      var FcK1 = i;
    } else if (i > 115 || 133 < i) {
      var FcK2 = i;
    } else if (i > 134) {
      var FcK3 = i;
    }
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
      translateXActividades
    } = this.state;

    return (
      <Animated.View style={styles.container}>
        {/*TabView Top */}
        <View style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}>
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
                justifyContent: "center",
                alignItems: "center",
                transform: [{ translateX: translateXMediciones }]
              }}
            >
              <View>
                <Text>Hola</Text>
              </View>
            </Animated.View>

            <Animated.View
              style={{
                justifyContent: "center",
                alignItems: "center",
                transform: [{ translateX: translateXActividades }]
              }}
            >
              <View>
                <Text>Hila</Text>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
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
        {/*<View style={styles.package}>
          {FcK1 > 110 && (
            <Text style={styles.sensorField}>
              · Realizar calentamiento y estiramientos · Caminar a paso moderado
              De 20 a 40 minutos
            </Text>
          )}
        </View>
        <View style={styles.package}>
          {FcK2 > 115 && (
            <Text style={styles.sensorField}>
              · Realizar calentamiento y estiramientos · Caminar a paso rápido
              De 40 a 80 minutos
            </Text>
          )}
        </View>
        <View style={styles.package}>
          {FcK3 > 133 && (
            <Text style={styles.sensorField}>
              · Realizar calentamiento y estiramiento · Trotar a ritmo constante
              Durante 20 minutos
            </Text>
          )}
        </View>
        <View style={styles.package}>
          {FcK > 135 && (
            <Text style={styles.sensorField}>
              Realizar calentamiento y estiramientos
            </Text>
          )}
        </View>*/}
        <View style={styles.package}>
          <Text style={styles.sensorField}>Batería:</Text>
          <Text style={styles.sensorField}>{this.state.battery + " %"}</Text>
        </View>
        <View style={styles.package}>
          <Text style={styles.sensorField}>Pasos:</Text>
          <Text style={styles.sensorField}>{this.state.steps}</Text>
        </View>
        <View style={styles.package}>
          <Text style={styles.sensorField}>Calorias:</Text>
          <Text style={styles.sensorField}>{this.state.steps}</Text>
        </View>
        {/*}
        </View>
        <View style={styles.package}>
          <Text style={styles.sensorField}>Contador</Text>
          <Text style={styles.sensorField}>{this.state.contador + " %"}</Text>
        </View>*/}

        {/*Lista de todos las frecuencias cardiacas */}
        {/*<View style={styles.package}>
          <Text style={styles.sensorField}>List Heart:</Text>
          <Text style={styles.sensorField}>
            {this.state.hearBeatList + " %"}
          </Text>
      </View>*/}

        {/*<View style={styles.package}>
          <Text style={styles.sensorField}>Device Bond Level:</Text>
          <Text style={styles.sensorField}>{this.state.deviceBondLevel}</Text>
        </View>*/}
        {/*<ScrollView style={{ flex: 1 }}>
          <HTML
            html={
              <div class="person">
                <h2>${person.name}</h2>
                <p class="location">${person.location}</p>
                <p class="bio">${person.bio}</p>
              </div>
            }
          />
        </ScrollView>

        <WebView
          originWhitelist={["*"]}
          source={{ html: "<h1>Hello world</h1>" }}
        />*/}

        {/* <View style={styles.buttonContainer}>
          {this.state.isConnectedWithMiBand ? (
            <TouchableOpacity
              style={styles.buttonEnabled}
              onPress={this.unlinkBluetoothDevice}
            >
              <Text style={styles.buttonText}>Desvincularse con MiBand</Text>
            </>
          ) : (
            <TouchableOpacity
              style={styles.buttonEnabled}
              onPress={this.searchBluetoothDevices}
            >
              <Text style={styles.buttonText}>Vincularse con MiBand</Text>
            </TouchableOpacity>
          )}
          <View style={styles.spacing} />
          {this.state.isConnectedWithMiBand ? (
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
            <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
              <Text style={styles.buttonText}>Promedio</Text>
            </TouchableOpacity>
          )}

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
          </View>*/}
        <View></View>

        {/*------PDF-------------------------*/}
        <View style={styles.spacing} />
        {/*<View>
          <TouchableOpacity
            style={styles.buttonEnabled}
            onPress={this.createPDF1}
          >
            <Text style={styles.buttonText}>Crar PDF</Text>
          </TouchableOpacity>
        </View>*/}

        {/* El verdadero PDF
        <View style={styles.MainContainer}>
          <Dashboards />
        </View>
        <View style={styles.spacing} />*/}
        {/* 

        <TouchableOpacity
          style={styles.buttonEnabled}
          onPress={this.searchBluetoothDevices}
        >
          <Text style={styles.buttonText}>Crear Reporte</Text>
        </TouchableOpacity>
        */}
        {/*<View style={styles.Container}>
          <TouchableOpacity onPress={this.askPermission.bind(this)}>
            <View>
              <Text style={styles.buttonText}>Crear reporte</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonText}>{this.state.filePath}</Text>
        </View>*/}

        {/*------Table-------------------------*/}
        {/*<View style={styles.container}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={this.state.tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={this.state.tableData} textStyle={styles.text} />
          </Table>
          </View>*/}
        {/*------------------Gráfica-------------------------*/}
        <Text>Gráfica</Text>
        {/*<LineChart
          data={{
            labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
            datasets: [
              {
                data: [sum[0], sum[1], sum[2], sum[3], sum[4]]
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          //yAxisLabel={"$"}
          yAxisSuffix={"RC"}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            ///No sé que hace el barRadius
            barRadius: 16,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />*/}

        <ProgressChart
          data={[0.8]}
          width={Dimensions.get("window").width - 16}
          height={220}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(51, 175, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
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
          {/*Button */}
          {/* {this.state.isConnectedWithMiBand ? (
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
            <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
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
      </Animated.View>
    );
  }
}
const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;
const person = {
  name: "Wes",
  job: "Web Developer",
  city: "Hamilton",
  bio: "Wes is a really cool guy that loves to teach web development!"
};

/*const data = {
  labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
  datasets: [
    {
      data: [0, 1]
    }
  ]
};*/
