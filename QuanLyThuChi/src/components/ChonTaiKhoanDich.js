// Import thư viện
import React, { Component } from "react";
import { Text, Dimensions } from "react-native";
import {
  Button,
  Body,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Left,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChonTaiKhoanDich extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taiKhoan: [],
      soTaiKhoan: 0
    };
    this.formatMoney = this.formatMoney.bind(this);
  }

  componentDidMount() {
    let array = [];
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM taikhoan WHERE dang_su_dung like 'y' and xoa like 'n'",
        [],
        (tx, results) => {
          var len = results.rows.length;
          this.setState({ soTaiKhoan: len });
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            array.push(row);
          }
          this.setState({ taiKhoan: array });
        }
      );
    });
  }
  // Function
  formatMoney(money) {
    money = money + "";
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return y;
  }
  render() {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Header
          style={{
            backgroundColor: "rgb(76,171,242)",
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
            <Text style={{ color: "white", fontWeight: "bold" }}>
              CHỌN TÀI KHOẢN
            </Text>
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
            {this.state.taiKhoan.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataTaiKhoanDich(
                    item.ma_tai_khoan,
                    item.ten_tai_khoan
                  );
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
                  <Icon
                    name="credit-card"
                    style={{ fontSize: 18, color: "white" }}
                  />
                </Left>
                <Body style={{ flex: 5 }}>
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    {item.ten_tai_khoan}
                  </Text>
                </Body>
                <Right style={{ flex: 4 }}>
                  <Text style={{ fontSize: 20, color: "white" }}>
                    {this.formatMoney(item.so_tien)} đ
                  </Text>
                </Right>
              </CardItem>
            ))}
          </Card>
        </Content>
        <MyFooter navigation={this.props.navigation} />
      </Container>
    );
  }
}
