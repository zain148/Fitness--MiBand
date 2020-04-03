import React from "react";
import {
  Button,
  Text,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Chevron } from "react-native-shapes";
//import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
// import RNPickerSelect, { defaultStyles } from './debug';

const alimentos = [
  {
    label: "Huevo",
    value: 74,
  },
  {
    label: "Pollo 100 g",
    value: 195,
  },
  {
    label: "Tortilla de maíz",
    value: 52,
  },
  {
    label: "Pizza una rebanada",
    value: 298,
  },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.inputRefs = {
      firstTextInput: null,
      favSport0: null,
      favSport1: null,
      lastTextInput: null,
      favSport5: null,
    };

    this.state = {
      numbers: [
        {
          label: "1",
          value: 1,
          color: "orange",
        },
        {
          label: "2",
          value: 2,
          color: "green",
        },
      ],
      favSport0: undefined,
      favSport1: undefined,
      favSport2: undefined,
      favSport3: undefined,
      favSport4: "baseball",
      previousFavSport5: undefined,
      favSport5: null,
      favNumber: undefined,
      calRestantes: 2000,
      conCalorias: 0,
    };

    this.InputAccessoryView = this.InputAccessoryView.bind(this);
  }
  getCalorias = () => {
    this.state.conCalorias = this.state.conCalorias + this.state.favSport0;
    this.state.calRestantes -= this.state.conCalorias;
  };
  InputAccessoryView() {
    return (
      <View style={defaultStyles.modalViewMiddle}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState(
              {
                favSport5: this.state.previousFavSport5,
              },
              () => {
                this.inputRefs.favSport5.togglePicker(true);
              }
            );
          }}
          hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <View testID="needed_for_touchable">
            <Text
              style={[
                defaultStyles.done,
                { fontWeight: "normal", color: "red" },
              ]}
            >
              Cancel
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text>Name | Prefer</Text>
        <TouchableWithoutFeedback
          onPress={() => {
            this.inputRefs.favSport5.togglePicker(true);
          }}
          hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <View testID="needed_for_touchable">
            <Text style={defaultStyles.done}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const placeholder = {
      label: "Tipo de alimentos...",
      value: null,
      color: "#9EA0A4",
    };
    //this.state.conCalorias = this.state.conCalorias + this.state.favSport0;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Text>Peso</Text>
          <TextInput
            ref={(el) => {
              this.inputRefs.firstTextInput = el;
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => {
              this.inputRefs.favSport0.togglePicker();
            }}
            style={
              Platform.OS === "ios"
                ? pickerSelectStyles.inputIOS
                : pickerSelectStyles.inputAndroid
            }
            blurOnSubmit={false}
          />
          <Text>Edad</Text>
          <TextInput
            ref={(el) => {
              this.inputRefs.firstTextInput = el;
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => {
              this.inputRefs.favSport0.togglePicker();
            }}
            style={
              Platform.OS === "ios"
                ? pickerSelectStyles.inputIOS
                : pickerSelectStyles.inputAndroid
            }
            blurOnSubmit={false}
          />
          <Text>IMC</Text>
          <TextInput
            ref={(el) => {
              this.inputRefs.firstTextInput = el;
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => {
              this.inputRefs.favSport0.togglePicker();
            }}
            style={
              Platform.OS === "ios"
                ? pickerSelectStyles.inputIOS
                : pickerSelectStyles.inputAndroid
            }
            blurOnSubmit={false}
          />

          <View style={styles.package}>
            <Text style={styles.sensorField}>Calorias Restantes:</Text>
            <Text style={styles.sensorField}>{this.state.calRestantes}</Text>
          </View>
          <View paddingVertical={5} />
          <View style={styles.package}>
            <Text style={styles.sensorField}>Calorias Consumidas:</Text>
            <Text style={styles.sensorField}>{this.state.conCalorias}</Text>
          </View>
          <View style={styles.spacing} />
          <Button
            title="Agregar Alimentos"
            color="#33AFFF"
            onPress={this.getCalorias}
            disabled={false}
          />
          <View style={styles.spacing} />
          <Text>Selecionar alimentos</Text>
          {/* and iOS onUpArrow/onDownArrow toggle example */}
          <RNPickerSelect
            placeholder={placeholder}
            items={alimentos}
            onValueChange={(value) => {
              this.setState({
                favSport0: value,
              });
            }}
            onUpArrow={() => {
              this.inputRefs.firstTextInput.focus();
            }}
            onDownArrow={() => {
              this.inputRefs.favSport1.togglePicker();
            }}
            style={pickerSelectStyles}
            value={this.state.favSport0}
            ref={(el) => {
              this.inputRefs.favSport0 = el;
            }}
          />
          <View>
            <Text>{this.state.favSport0} Kcal</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
