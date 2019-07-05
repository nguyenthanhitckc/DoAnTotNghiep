// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Image } from "react-native";
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
            <Button transparent onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={styles.iconHeader} />
            </Button>
          </Left>
          <Body>
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
    left: 10,
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
    margin: 10
  },
  textButton: {
    color: "rgb(76,171,242)",
    fontSize: 15
  }
});
