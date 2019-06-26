// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import {
  Button,
  Body,
  Container,
  Content,
  Header,
  Left,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import MyFooter from "./../MyFooter";
// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ThemMoiCopy extends Component {
  render() {
    const { navigation } = this.props;
    const { params } = this.props.navigation.state;
    return (
      <Container>
        <Header style={styles.header}>
          <Body>
            <Text style={{ color: "white", fontWeight: "bold" }}>THÊM</Text>
          </Body>
        </Header>

        <Body style={styles.content}>
          <Button
            onPress={() => {
              navigation.navigate("ChiTieuCopy", {
                so_tien: params.so_tien,
                mo_ta: params.mo_ta,
                ma_tai_khoan: params.ma_tai_khoan,
                ten_tai_khoan: params.ten_tai_khoan
              });
            }}
            block
            info
            style={styles.buttonCardItem}
          >
            <Text style={styles.textButton}>Chi tiêu</Text>
          </Button>

          <Button
            onPress={() =>
              navigation.navigate("ThuNhapCopy", {
                so_tien: params.so_tien,
                mo_ta: params.mo_ta,
                ma_tai_khoan: params.ma_tai_khoan,
                ten_tai_khoan: params.ten_tai_khoan
              })
            }
            block
            info
            style={styles.buttonCardItem}
          >
            <Text style={styles.textButton}>Thu nhập</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate("ChuyenKhoan")}
            block
            info
            style={styles.buttonCardItem}
          >
            <Text style={styles.textButton}>Chuyển khoản</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate("DieuChinhSoDu")}
            block
            info
            style={styles.buttonCardItem}
          >
            <Text style={styles.textButton}>Điều chỉnh số dư</Text>
          </Button>
        </Body>
        <MyFooter navigation={this.props.navigation} />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  iconHeader: {
    color: "white",
    fontSize: 18
  },
  header: {
    backgroundColor: "rgb(76,171,242)",
    height: 40,
    borderBottomColor: "#757575",
    marginBottom: 2
  },
  content: {
    width:"100%",
    left: 0,
    right: 0,
    height: height - 104,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonCardItem: {
    height: 80,
    backgroundColor: "rgb(228,242,253)",
    borderRadius: 5,
    margin: 10,
  },
  textButton: {
  color:"rgb(76,171,242)",
  fontSize:15
  }
});
