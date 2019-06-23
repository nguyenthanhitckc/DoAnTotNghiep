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
          <Left style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="bars" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>THÊM</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Content style={styles.content}>
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
        </Content>
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
    // position: 'absolute',
    left: 0,
    right: 0,
    height: height - 104,
    backgroundColor: "#ffffff"
  },
  buttonCardItem: {
    height: 40,
    backgroundColor: "rgb(76,171,242)",
    marginBottom: 2,
    borderBottomEndRadius: 20
  },
  textButton: {
    color: "white",
    marginLeft: 5
  }
});
