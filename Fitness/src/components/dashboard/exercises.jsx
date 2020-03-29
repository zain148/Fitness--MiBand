import React from "react";
import { Text, View, NativeModules, TouchableOpacity } from "react-native";
import styles from "./styles.jsx";
import { Table, Row, Rows } from "react-native-table-component";
import { createStackNavigatior } from "react-navigation";
import Dashboard from "./dashboard.jsx";

export default class Exercises extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHead: ["Columna", "Columna", "Columna", "Columna"],
      tableData: [
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"],
        ["renglon", "1", "2", "3"]
      ]
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={this.state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={this.state.tableData} textStyle={styles.text} />
        </Table>

        <TouchableOpacity
          style={styles.buttonEnabled}
          onPress={() => this.props.navigation.navigate("Dashboard")}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
