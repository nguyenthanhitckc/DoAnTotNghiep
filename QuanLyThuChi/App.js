// Import
import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import AppNavigator from "./AppNavigator";
console.disableYellowBox = true; //disableYellowBox
// Const
const AppContainer = createAppContainer(AppNavigator);

export default class DATN extends Component {
  render() {
    return <AppContainer />;
  }
}
