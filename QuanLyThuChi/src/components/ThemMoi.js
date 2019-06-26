// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Alert } from "react-native";
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
import db from "../../connectionDB";
import MyFooter from "./../MyFooter";
// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ThemMoi extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM taikhoan WHERE dang_su_dung like 'y' and xoa like 'n'",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len == 0) {
            navigation.navigate('ThemTaiKhoan');
            Alert.alert(
              "Thông báo",
              "Bạn chưa có tài khoản hoạt động nào, hãy tạo tài khoản đầu tiên của bạn nào!",
              [
                {
                  text: "Ok"
                }
              ],
              { cancelable: false }
            );
          }
        }
      );
    });
  }
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
            onPress={() => navigation.navigate("ChiTieu")}
            block
            info
            style={styles.buttonCardItem}
          >
            <Text style={styles.textButton}>Chi tiêu</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate("ThuNhap")}
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
