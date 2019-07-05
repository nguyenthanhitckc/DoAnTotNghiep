// import thư viện
import { Button, Footer, FooterTab } from "native-base";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default class MyFooter extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Footer style={stylesFooter.footer}>
          <FooterTab style={stylesFooter.footer}>
            <Button vertical onPress={() => navigation.navigate("ThemMoi")}>
              <Icon name="plus-circle" style={stylesFooter.iconPlusCircle} />
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}
const stylesFooter = StyleSheet.create({
  iconHeader: {
    color: "white",
    fontSize: 18
  },
  iconFooter: {
    color: "grey",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "#009933",
    fontSize: 30
  },
  footer: {
    backgroundColor: "white",
    color: "black",
    height: 40
  },
  textFooter: {
    color: "black",
    fontSize: 12,
    fontFamily: "Times New Roman"
  }
});
