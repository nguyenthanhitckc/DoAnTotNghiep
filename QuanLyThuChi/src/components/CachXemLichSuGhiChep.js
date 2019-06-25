// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Alert } from "react-native";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Left,
  Right
} from "native-base";
import { TabView, SceneMap } from "react-native-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import MyFooter from "./../MyFooter";

// Const & Variable:
const { height, width } = Dimensions.get("window");
const Ngay = () => (
  <Content>
    <Button light full>
      <Text light>Ngày này</Text>
    </Button>

    <Button light full>
      <Text light>Ngày trước</Text>
    </Button>

    <Button light full>
      <Text light>Tự chọn</Text>
    </Button>
  </Content>
);

const Thang = () => (
  <Content>
    <Button light full>
      <Text light>Tháng này</Text>
    </Button>

    <Button light full>
      <Text light>Tháng trước</Text>
    </Button>

    <Button light full>
      <Text light>Tự chọn</Text>
    </Button>
  </Content>
);
const Quy = () => (
  <Content>
    <Content>
      <Button light full>
        <Text light>Quý 1</Text>
      </Button>

      <Button light full>
        <Text light>Quý 2</Text>
      </Button>

      <Button light full>
        <Text light>Quý 3</Text>
      </Button>

      <Button light full>
        <Text light>Quý 4</Text>
      </Button>
    </Content>
  </Content>
);
const TuyChon = () => (
  <Content>
    <Content>
      <Button light full>
        <Text light>Từ ngày</Text>
      </Button>

      <Button light full>
        <Text light>Đến ngày</Text>
      </Button>
    </Content>
  </Content>
);
export default class GhiChepCuaTaiKhoan extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "ngay", title: "Ngày" },
      { key: "thang", title: "Tháng" },
      { key: "quy", title: "Quý" },
      { key: "tuychon", title: "Tùy chọn" }
    ]
  };
  render() {
    const { navigation } = this.props;
    console.log(this.state.ghi_chep);
    return (
      <Container>
        <Header style={styles.header}>
          <Text style={styles.textHeader}>CÁCH XEM GHI CHÉP</Text>
        </Header>

        <Content>
          <TabView
            navigationState={this.state}
            renderScene={SceneMap({
              ngay: Ngay,
              thang: Thang,
              quy: Quy,
              tuychon: TuyChon
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get("window").width }}
          />
        </Content>

        <MyFooter navigation={this.props.navigation} />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  buttonCardItem: {
    backgroundColor: "#3a455c",
    borderBottomWidth: 0.7,
    borderColor: "grey",
    height: 50,
    marginTop: 5
  },
  card: {
    marginLeft: 5,
    marginRight: 5
  },
  cardItem: {
    borderColor: "grey",
    borderBottomWidth: 1,
    marginTop: 5
  },
  content: {
    backgroundColor: "#F1F1F1",
    height: height - 104,
    left: 0,
    // position: "absolute",
    right: 0
  },
  footer: {
    backgroundColor: "#3a455c",
    color: "white",
    height: 40
  },
  header: {
    backgroundColor: "rgb(76,171,242)",
    borderBottomColor: "#757575",
    height: 40
  },
  icon: {
    color: "#3a455c",
    fontSize: 18
  },
  iconHeader: {
    color: "white",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "white",
    fontSize: 30
  },
  input: {
    color: "#3a455c",
    fontSize: 20,
    textAlign: "right"
  },
  textContent: {
    color: "#3a455c",
    fontSize: 20,
    paddingLeft: 10
  },
  textContentMoney: {
    color: "#3a455c",
    fontSize: 20
  },
  textHeader: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  },
  textFooter: {
    color: "white",
    fontSize: 10,
    fontFamily: "Times New Roman"
  },
  titleContent: { fontWeight: "bold", color: "black" },
  scene: {
    flex: 1
  }
});
