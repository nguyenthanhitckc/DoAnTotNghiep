// Import thư viện
import React, { Component } from "react";
import { Text, Dimensions, Platform, StyleSheet } from "react-native";
import db from "../../connectionDB";
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
import MyFooter from "../MyFooter";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChonTaiKhoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taiKhoan: [],
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
        <Header style={styles.header}>
          <Left style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="bars" style={styles.icon} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>CHỌN TÀI KHOẢN</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Content style={styles.content}>
          <Card style={styles.card}>
            {this.state.taiKhoan.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataTaiKhoan(
                    item.ma_tai_khoan,
                    item.ten_tai_khoan
                  );
                  goBack();
                }}
                style={styles.cardItem}
              >
                <Left style={{ flex: 1 }}>
                  <Icon name="credit-card" style={styles.icon} />
                </Left>
                <Body style={{ flex: 6 }}>
                  <Text style={styles.textContent}>{item.ten_tai_khoan}</Text>
                </Body>
                <Right style={{ flex: 6 }}>
                  <Text style={styles.textContentMoney}>
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
