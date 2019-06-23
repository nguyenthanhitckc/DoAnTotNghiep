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
