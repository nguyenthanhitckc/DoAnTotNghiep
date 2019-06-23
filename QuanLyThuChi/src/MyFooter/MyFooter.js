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
            <Button vertical onPress={() => navigation.navigate("TongQuan")}>
              <Icon name="home" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Tổng quan</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Tài khoản</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("ThemMoi")}>
              <Icon name="plus-circle" style={stylesFooter.iconPlusCircle} />
            </Button>
            <Button vertical onPress={() => navigation.navigate("HanMucChi")}>
              <Icon name="filter" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Hạn mức chi</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("Khac")}>
              <Icon name="ellipsis-h" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Khác</Text>
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
    color: "rgb(76,171,242)",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "rgb(76,171,242)",
    fontSize: 30
  },
  footer: {
    backgroundColor: "rgb(235,239,242)",
    color: "rgb(235,239,242)",
    height: 40
  },
  textFooter: {
    color: "rgb(76,171,242)",
    fontSize: 10,
    fontFamily: "Times New Roman"
  }
});
