// Import thư viện
import React, { Component } from "react";
import { Text, Dimensions, StyleSheet } from "react-native";
import {
  Button,
  Body,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Input,
  InputGroup,
  Left,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ThuTuAi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danhSachThu: [],
      nguoiThuMoi: ""
    };
    this.ThemNguoiThuMoi = this.ThemNguoiThuMoi.bind(this);
    this.TaoMaNguoiThu = this.TaoMaNguoiThu.bind(this);
  }

  // Function
  componentDidMount() {
    let array = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM danhsachthu", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          array.push(row);
        }
        this.setState({ danhSachThu: array });
      });
    });
  }

  TaoMaNguoiThu() {
    let query = "SELECT * FROM danhsachthu;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("nt0001");
            } else {
              let soHienTai;
              let data;
              let maCT = "nt";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_nguoi_thu FROM danhsachthu WHERE ma_nguoi_thu like (SELECT MAX(ma_nguoi_thu) FROM danhsachthu)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_nguoi_thu;
                    soHienTai = parseInt(data.slice(2, 6), 10) + 1;
                    let str = "" + soHienTai;
                    let pad = "0000";
                    maCT =
                      maCT + pad.substring(0, pad.length - str.length) + str;
                    resolve(maCT);
                  }
                );
              });
            }
          },
          function(tx, error) {
            reject(error);
          }
        );
      })
    );
  }

  async ThemNguoiThuMoi() {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    let ma_nguoi_thu = "";
    ma_nguoi_thu = await this.TaoMaNguoiThu();
    let ten_nguoi_thu = this.state.nguoiThuMoi;
    db.transaction(function(tx) {
      tx.executeSql("INSERT INTO danhsachthu(ma_nguoi_thu, ten) VALUES(?, ?)", [
        ma_nguoi_thu,
        ten_nguoi_thu
      ]);
      params.returnDataNguoiThu(ma_nguoi_thu, ten_nguoi_thu);
      goBack();
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Header
          style={{
            backgroundColor: "#3a455c",
            height: 40,
            borderBottomColor: "#757575"
          }}
        >
          <Left style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="bars" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>VỚI AI</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Content
          style={{
            // position: 'absolute',
            left: 0,
            right: 0,
            height: height - 104,
            backgroundColor: "#F1F1F1"
          }}
        >
          <Card style={{ marginLeft: 5, marginRight: 5 }}>
            <CardItem>
              <InputGroup borderType="underline">
                <Icon name="user" style={styles.icon} />
                <Input
                  placeholder="Nhập người thu mới"
                  style={{
                    ...styles.input,
                    color: "#3a455c",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="red"
                  keyboardType="default"
                  onChangeText={nguoiThuMoi =>
                    this.setState({ nguoiThuMoi: nguoiThuMoi })
                  }
                  value={this.state.nguoiThuMoi}
                />
                <Text style={styles.textContent}>đ</Text>
              </InputGroup>
              <Button transparent onPress={this.ThemNguoiThuMoi}>
                <Icon name="check" style={styles.iconHeader} />
              </Button>
            </CardItem>
            {this.state.danhSachThu.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataNguoiThu(item.ma_nguoi_thu, item.ten);
                  goBack();
                }}
                style={{
                  borderColor: "grey",
                  borderBottomWidth: 0.7,
                  height: 50,
                  marginTop: 5,
                  backgroundColor: "rgb(76,171,242)"
                }}
              >
                <Left style={{ flex: 1 }}>
                  <Icon name="user" style={{ fontSize: 18, color: "white" }} />
                </Left>
                <Body style={{ flex: 8 }}>
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    {item.ten}
                  </Text>
                </Body>
                <Right style={{ flex: 1 }} />
              </CardItem>
            ))}
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
    height: 50,
    marginTop: 5,
    backgroundColor: "#3a455c"
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
    backgroundColor: "#3a445c",
    borderBottomColor: "#757575",
    height: 40
  },
  icon: {
    color: "white",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "white",
    fontSize: 30
  },
  textContent: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  textContentMoney: {
    color: "white",
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
  }
});
