// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Alert } from "react-native";
import {
  Button,
  Body,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Input,
  InputGroup,
  Item,
  Left,
  Picker,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ThemTaiKhoan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soTien: "",
      moTa: "",
      tenTaiKhoan: "",
      loaiTaiKhoan: ""
    };
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.phatSinhMaTaiKhoan = this.phatSinhMaTaiKhoan.bind(this);
    this.chonLoaiTaiKhoan = this.chonLoaiTaiKhoan.bind(this);
  }

  // Function
  componentDidMount() { }

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTien: y });
    return y;
  }

  phatSinhMaTaiKhoan() {
    let query = "SELECT * FROM taikhoan;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("tk0001");
            } else {
              let soHienTai;
              let data;
              let maCT = "tk";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_tai_khoan FROM taikhoan WHERE ma_tai_khoan like (SELECT MAX(ma_tai_khoan) FROM taikhoan)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_tai_khoan;
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
          function (tx, error) {
            reject(error);
          }
        );
      })
    );
  }

  async buttonOnClick() {
    // Kiểm tra đầy đủ:
    if (this.state.soTien == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa nhập số dư tài khoản!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.tenTaiKhoan == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa nhập tên tài khoản!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.loaiTaiKhoan == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn loại tài khoản!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else {
      const { goBack } = this.props.navigation;
      let mataikhoan = "";
      mataikhoan = await this.phatSinhMaTaiKhoan();
      let tentaikhoan = this.state.tenTaiKhoan;
      let moneyTmp = this.state.soTien.replace(/,/g, "");
      let sotien = Number(moneyTmp);
      let loaitaikhoan = this.state.loaiTaiKhoan;
      let mota = this.state.moTa;
      // Thêm chi tiêu vào bảng chitieu
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO taikhoan(ma_tai_khoan, ten_tai_khoan, so_tien, so_du_ban_dau, loai_tai_khoan, mo_ta, dang_su_dung, xoa) VALUES (?,?,?,?,?,?,?,?)",
          [mataikhoan, tentaikhoan, sotien, sotien, loaitaikhoan, mota, "y", "n"],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Thành công",
                "Bạn đã thêm thành công",
                [
                  {
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
            } else {
              alert("Bạn đã thêm không thành công");
            }
          }
        );
      });
      goBack();
    }
  }

  chonLoaiTaiKhoan(value) {
    this.setState({ loaiTaiKhoan: value });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="bars" style={styles.iconHeader} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>THÊM TÀI KHOẢN</Text>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="check" style={styles.iconHeader} />
            </Button>
          </Right>
        </Header>

        <Content style={styles.content}>
          <Card>
            <CardItem header>
              <Text style={styles.titleContent}>Số dư</Text>
            </CardItem>
            <CardItem>
              <InputGroup borderType="underline">
                <Icon name="money" style={styles.icon} />
                <Input
                  placeholder="0"
                  style={{
                    ...styles.input,
                    color: "#3a455c",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="#3a455c"
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={this.formatMoney}
                  value={this.state.soTien}
                />
                <Text style={styles.textContent}>đ</Text>
              </InputGroup>
            </CardItem>
          </Card>

          <Card>
            <CardItem style={styles.cardItem}>
              <Item>
                <Icon active name="credit-card" style={styles.icon} />
                <Input
                  placeholder="Tên tài khoản"
                  placeholderTextColor="#3a455c"
                  style={{ ...styles.textContent, paddingLeft: 28 }}
                  onChangeText={tenTaiKhoan => this.setState({ tenTaiKhoan })}
                />
              </Item>
            </CardItem>

            <CardItem style={styles.cardItem}>
              <Icon
                active
                name="credit-card"
                style={{ ...styles.icon, marginLeft: 4 }}
              />
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ paddingLeft: 12 }}
                  placeholder="Chọn loại tài khoản"
                  placeholderStyle={{ color: "#3a455c" }}
                  placeholderIconColor="#3a455c"
                  selectedValue={this.state.loaiTaiKhoan}
                  onValueChange={this.chonLoaiTaiKhoan}
                  valueStyle={{
                    color: "#3a455c",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  <Picker.Item label="Tiền mặt" value="tien_mat" />
                  <Picker.Item label="Thẻ ngân hàng" value="the_ngan_hang" />
                  <Picker.Item label="Đầu tư" value="dau_tu" />
                  <Picker.Item label="Khác" value="khac" />
                </Picker>
              </Item>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <Item>
                <Icon active name="comments" style={styles.icon} />
                <Input
                  placeholder="Mô tả"
                  placeholderTextColor="#3a455c"
                  style={{ ...styles.textContent, paddingLeft: 34 }}
                  onChangeText={moTa => this.setState({ moTa })}
                />
              </Item>
            </CardItem>
            <Button
              block
              info
              style={{ height: 40, backgroundColor: "#3a455c" }}
              onPress={this.buttonOnClick}
            >
              <Icon name="save" style={styles.iconHeader} />
              <Text
                style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
              >
                Ghi
              </Text>
            </Button>
          </Card>
        </Content>

        <Footer style={styles.footer}>
          <FooterTab style={styles.footer}>
            <Button vertical onPress={() => navigation.navigate("TongQuan")}>
              <Icon name="home" style={styles.iconHeader} />
              <Text style={styles.textFooter}>Tổng quan</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={styles.iconHeader} />
              <Text style={styles.textFooter}>Tài khoản</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("ThemMoi")}>
              <Icon name="plus-circle" style={styles.iconPlusCircle} />
            </Button>
            <Button vertical onPress={() => navigation.navigate("HanMucChi")}>
              <Icon name="filter" style={styles.iconHeader} />
              <Text style={styles.textFooter}>Hạn mức chi</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("Khac")}>
              <Icon name="ellipsis-h" style={styles.iconHeader} />
              <Text style={styles.textFooter}>Khác</Text>
            </Button>
          </FooterTab>
        </Footer>
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
    backgroundColor: "#3a445c",
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
    color: "black",
    fontSize: 15,
    paddingLeft: 10
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
  },
  titleContent: { fontWeight: "bold", color: "black" }
});
