/*Example of Making PDF from HTML in React Native*/
import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
export default class Example extends Component {
  /* state = {
    filePath: ""
  };*/
  constructor(props) {
    super(props);
    this.state = {
      filePath: ""
    };
  }

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
      html: `<div style="text-align:center;">
            <h1>Reporte de Paciente</h1>

            <div align="left">
                <P >Nombre de Paciente: Noe
                <P>Edad: 31 Años
                <P>Peso: 100 Kg
                <P> Estatura: 193 Cm
                <P> IMC: 26
                
            </div>

            

            <table class="egt">

            <tr>
          
              <th scope="row"></th>
          
              <th>Semana 1</th>
          
              <th>Semana 2</th>
          
              <th>Semana 3</th>

              <th>Semana 4</th>
          
            </tr>
          
            <tr>
          
              <th>Promedio de frecuencia <br>
              cardiaca en reposo</th>
          
              <td>85 LPM</td>
          
              <td>83 LPM</td>
          
              <td>98 LPM</td>

              <td>99 LPM</td>
          
            </tr>
          
            <tr>
          
              <th>Promedio de frecuencia <br>
              cardiaca en diaria</th>
          
              <td>85 LPM</td>
          
              <td>83 LPM</td>
          
              <td>98 LPM</td>

              <td>99 LPM</td>
          
            </tr>
          
            <tr>
          
              <th>Rango más alto de<br>
              frecuencia cardiaca</th>
          
              <td>85 LPM</td>
          
              <td>83 LPM</td>
          
              <td>98 LPM</td>

              <td>99 LPM</td>
            </tr>

            <th>Rango más bajo de<br>
            frecuencia cardiaca</th>
          
            <td>85 LPM</td>
          
            <td>83 LPM</td>
        
            <td>98 LPM</td>

            <td>99 LPM</td>
            </tr>
          
          </table>
          <script type="text/javascript" src="dashboard/graphics.js"></script>
          </div>`,
      //File Name
      fileName: "test",
      //File directory
      directory: "docs"
    };
    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    this.setState({ filePath: file.filePath });
  }
  render() {
    return (
      <View style={styles.MainContainer}>
        <TouchableOpacity onPress={this.askPermission.bind(this)}>
          <View>
            <Image
              //We are showing the Image from online
              source={{
                uri:
                  "https://raw.githubusercontent.com/AboutReact/sampleresource/master/pdf.png"
              }}
              //You can also show the image from you project directory like below
              //source={require('./Images/facebook.png')}
              style={styles.ImageStyle}
            />
            <Text style={styles.text}>Crear reporte</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.filePath}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F4F4F",
    borderWidth: 1,
    borderColor: "#000"
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 25,
    marginTop: 16
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: "stretch"
  }
});
const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;
