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
import DateTimePicker from "react-native-modal-datetime-picker";
// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class CachXemLichSuGhiChep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canh_xem: "",
      ngay: new Date(),
      quy: "",
      tu_ngay: "",
      den_ngay: "",
      isDateTimePickerVisible: false
    };
  }

  confirmDateTimePicker = datetime => {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    this.setState({ isDateTimePickerVisible: false });
    this.setState({ ngay: datetime });
    params.returnDataCachXem(
      "Ngày",
      moment(new Date(this.state.ngay).format("YYYY/MM/DD")),
      this.state.quy,
      this.state.tu_ngay,
      this.state.den_ngay
    );
    goBack();
  };

  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
  };

  render() {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Header style={styles.header}>
          <Text style={styles.textHeader}>CÁCH XEM GHI CHÉP</Text>
        </Header>

        <Content>
          <Card>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.confirmDateTimePicker}
              onCancel={this.hideDateTimePicker}
              mode={"datetime"}
              is24Hour={true}
              titleIOS={"Chọn ngày"}
              titleStyle={{ color: "#3a455c", fontSize: 20 }}
              locale={"vie"}
              customConfirmButtonIOS={
                <Text style={{ ...styles.textContent, textAlign: "center" }}>
                  Xác nhận
                </Text>
              }
              cancelTextIOS={"Hủy"}
            />
            <CardItem style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#3a455c"
                }}
              >
                NGÀY
              </Text>
              <Button
                full
                transparent
                onPress={() => {
                  this.setState({
                    ngay: moment(new Date()).format("YYYY/MM/DD")
                  });
                  params.returnDataCachXem(
                    "Ngày",
                    this.state.ngay,
                    this.state.quy,
                    this.state.tu_ngay,
                    this.state.den_ngay
                  );
                  goBack();
                }}
              >
                <Text>Ngày này</Text>
              </Button>
              <Button
                full
                transparent
                onPress={() => {
                  this.setState({
                    ngay: moment(new Date())
                      .subtract(1, "days")
                      .format("YYYY/MM/DD")
                  });
                  params.returnDataCachXem(
                    "Ngày",
                    this.state.ngay,
                    this.state.quy,
                    this.state.tu_ngay,
                    this.state.den_ngay
                  );
                  goBack();
                }}
              >
                <Text>Ngày trước</Text>
              </Button>
              <Button
                full
                transparent
                onPress={() => {
                  this.setState({ isDateTimePickerVisible: true });
                }}
              >
                <Text>Ngày khác</Text>
              </Button>
            </CardItem>
            <CardItem style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#3a455c"
                }}
              >
                THÁNG
              </Text>
              <Button full transparent>
                <Text>Tháng này</Text>
              </Button>
              <Button full transparent>
                <Text>Tháng trước</Text>
              </Button>
              <Button full transparent>
                <Text>Tháng khác</Text>
              </Button>
            </CardItem>
            <CardItem style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#3a455c"
                }}
              >
                QUÝ
              </Text>
              <Button full transparent>
                <Text>Quý I</Text>
              </Button>
              <Button full transparent>
                <Text>Quý II</Text>
              </Button>
              <Button full transparent>
                <Text>Quý III</Text>
              </Button>
              <Button full transparent>
                <Text>Quý IV</Text>
              </Button>
            </CardItem>
          </Card>
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
