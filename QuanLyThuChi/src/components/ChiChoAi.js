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
// var db;

export default class ChiChoAi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danhSachChi: [],
      nguoiChiMoi: ""
    };
    this.ThemNguoiChiMoi = this.ThemNguoiChiMoi.bind(this);
    this.TaoMaNguoiChi = this.TaoMaNguoiChi.bind(this);
  }

  componentDidMount() {
    let array = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM danhsachchi", [], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          array.push(row);
        }
        this.setState({ danhSachChi: array });
      });
    });
  }

  TaoMaNguoiChi() {
    let query = "SELECT * FROM danhsachchi;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("nc0001");
            } else {
              let soHienTai;
              let data;
              let maCT = "nc";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_nguoi_chi FROM danhsachchi WHERE ma_nguoi_chi like (SELECT MAX(ma_nguoi_chi) FROM danhsachchi)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_nguoi_chi;
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

  async ThemNguoiChiMoi() {
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    let ma_nguoi_chi = "";
    ma_nguoi_chi = await this.TaoMaNguoiChi();
    let ten_nguoi_chi = this.state.nguoiChiMoi;
    db.transaction(function(tx) {
      tx.executeSql("INSERT INTO danhsachchi(ma_nguoi_chi, ten) VALUES(?, ?)", [
        ma_nguoi_chi,
        ten_nguoi_chi
      ]);
      params.returnDataNguoiChi(ma_nguoi_chi, ten_nguoi_chi);
      goBack();
    });
  }

  render() {
    const { navigation } = this.props;
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flex: 2 }} />
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>VỚI AI</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Content style={styles.content}>
          <Card style={styles.card}>
            <CardItem>
              <InputGroup borderType="underline">
                <Icon name="user" style={styles.icon} />
                <Input
                  placeholder="Nhập người chi mới"
                  style={{
                    ...styles.input,
                    color: "black",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="red"
                  keyboardType="default"
                  onChangeText={nguoiChiMoi =>
                    this.setState({ nguoiChiMoi: nguoiChiMoi })
                  }
                  value={this.state.nguoiChiMoi}
                />
                <Text style={styles.textContent}>đ</Text>
              </InputGroup>
              <Button transparent onPress={this.ThemNguoiChiMoi}>
                <Icon name="check" style={styles.iconHeader} />
              </Button>
            </CardItem>
            {this.state.danhSachChi.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataNguoiChi(item.ma_nguoi_chi, item.ten);
                  goBack();
                }}
                style={styles.buttonCardItem}
              >
                <Left style={{ flex: 1 }}>
                  <Icon name="user" style={styles.icon} />
                </Left>
                <Body style={{ flex: 8 }}>
                  <Text style={styles.textContent}>{item.ten}</Text>
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
    backgroundColor: "black",
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
    backgroundColor: "black"
  },
  content: {
    backgroundColor: "#F1F1F1",
    height: height - 104,
    left: 0,

    right: 0
  },
  footer: {
    backgroundColor: "black",
    color: "white",
    height: 40
  },
  header: {
    backgroundColor: "#009933",
    borderBottomColor: "black",
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
