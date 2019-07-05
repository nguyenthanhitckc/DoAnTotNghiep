// Import thư viện
import React, { Component } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text } from "react-native";
import {
  Body,
  Button,
  Container,
  Header,
  CardItem,
  Card,
  Right,
  Left
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
            navigation.navigate("ThemTaiKhoan");
            Alert.alert(
              "Thông báo",
              "Bạn chưa có tài khoản hoạt động nào, hãy tạo tài khoản đầu tiên của bạn nào!",
              [
                {
                  text: "Đồng ý"
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
            <Button transparent onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={styles.iconHeader} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>THÊM</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Body style={styles.content}>
          <Button
            onPress={() => navigation.navigate("ChiTieu")}
            full
            light
            style={styles.buttonCardItem}
          >
            <Left style={{ flex: 2 }}>
              <Image
                source={{
                  uri: "https://nguyenthanhitckc.github.io/images/cho_vay.png"
                }}
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  backgroundColor: "white"
                }}
              />
            </Left>
            <Body
              style={{
                flex: 7,
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.textButton}>Chi tiêu</Text>
            </Body>
            <Right style={{ flex: 1 }} />
          </Button>

          <Button
            onPress={() => navigation.navigate("ThuNhap")}
            full
            light
            style={styles.buttonCardItem}
          >
            <Left style={{ flex: 2 }}>
              <Image
                source={{
                  uri: "https://nguyenthanhitckc.github.io/images/thu_no.png"
                }}
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  backgroundColor: "white"
                }}
              />
            </Left>
            <Body
              style={{
                flex: 7,
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.textButton}>Thu nhập</Text>
            </Body>
            <Right style={{ flex: 1 }} />
          </Button>

          <Button
            onPress={() => navigation.navigate("ChuyenKhoan")}
            full
            light
            style={styles.buttonCardItem}
          >
            <Left style={{ flex: 2 }}>
              <Image
                source={{
                  uri: "https://nguyenthanhitckc.github.io/images/khac.png"
                }}
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  backgroundColor: "white"
                }}
              />
            </Left>
            <Body
              style={{
                flex: 7,
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.textButton}>Chuyển Khoản</Text>
            </Body>
            <Right style={{ flex: 1 }} />
          </Button>

          <Button
            onPress={() => navigation.navigate("DieuChinhSoDu")}
            full
            light
            style={styles.buttonCardItem}
          >
            <Left style={{ flex: 2 }}>
              <Image
                source={{
                  uri: "https://nguyenthanhitckc.github.io/images/tien_lai.png"
                }}
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  backgroundColor: "white"
                }}
              />
            </Left>
            <Body
              style={{
                flex: 7,
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.textButton}>Điều chỉnh số dư</Text>
            </Body>
            <Right style={{ flex: 1 }} />
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
    backgroundColor: "#009933",
    height: 40,
    borderBottomColor: "black",
    marginBottom: 2
  },
  content: {
    width: "100%",
    left: 0,
    right: 0,
    height: height - 104,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonCardItem: {
    height: 80,
    borderRadius: 5,
    margin: 10
  },
  textButton: {
    color: "black",
    fontSize: 20
  }
});
