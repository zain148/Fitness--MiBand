import React, { Component } from "react";
import MedicionesScreen from "./components/dashboard/index";
import ActividadesScreen from "./components/dashboard/actividades";
import CaloriasScreen from "./components/dashboard/calorias";

import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from "react-navigation";

/*const App = () => {
  return <Dashboardx />;
};

export default App;*/

export default createMaterialTopTabNavigator(
  {
    Mediciones: { screen: MedicionesScreen },
    Actividades: { screen: ActividadesScreen },
    Calorias: { screen: CaloriasScreen }
  },
  {
    intialRouteName: "Mediciones",
    //order: ["Mediciones", "Actividades", "Calorias"],
    activeTintColor: "#33AFFF"
    //shifting: true
  }
);
