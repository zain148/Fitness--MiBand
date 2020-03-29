import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    //backgroundColor: "#FFCCBC",
    //backgroundColor: "#2F4F4F",
    backgroundColor: "#FFFFFF",
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    padding: 15
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F4F4F",
    borderWidth: 1,
    borderColor: "#000"
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: "stretch"
  },
  package: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5
  },
  packageActivity: {
    color: "#33AFFF",
    flexDirection: "row",
    justifyContent: "center",
    margin: 5
  },
  sensorField: {
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around"
  },
  spacing: {
    padding: 5
  },
  spacingExercices: {
    padding: 50
  },
  buttonEnabled: {
    height: 35,
    borderRadius: 2,
    backgroundColor: "#33AFFF",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 5 }
  },
  buttonDisabled: {
    height: 35,
    borderRadius: 2,
    backgroundColor: "grey",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 5 }
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 25,
    marginTop: 16
  },
  textAverage: {
    textAlign: "center",
    fontSize: 25,
    marginTop: 16
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    paddingTop: 7
  }
});
