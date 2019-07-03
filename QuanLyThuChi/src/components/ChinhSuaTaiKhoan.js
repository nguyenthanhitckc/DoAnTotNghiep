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
import IconMater from "react-native-vector-icons/MaterialCommunityIcons";
import db from "../../connectionDB";
import MyFooter from "./../MyFooter";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChinhSuaTaiKhoan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soTien: "0",
      moTa: "",
      taiKhoan: "",
      tenTaiKhoan: "",
      loaiTaiKhoan: "",
      dangSuDung: ""
    };
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.chonLoaiTaiKhoan = this.chonLoaiTaiKhoan.bind(this);
    this.XoaTaiKhoan = this.XoaTaiKhoan.bind(this);
    this.NgungSuDung = this.NgungSuDung.bind(this);
    this.SuDungLai = this.SuDungLai.bind(this);
  }

  // Function
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      soTien: this.formatMoney(params.so_tien + ""),
      moTa: params.mo_ta,
      taiKhoan: params.ma_tai_khoan,
      tenTaiKhoan: params.ten_tai_khoan,
      loaiTaiKhoan: params.loai_tai_khoan,
      dangSuDung: params.dang_su_dung
    });
  }

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTien: y });
    return y;
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
      let mataikhoan = this.state.taiKhoan;
      let tentaikhoan = this.state.tenTaiKhoan;
      let moneyTmp = this.state.soTien.replace(/,/g, "");
      let sotien = Number(moneyTmp);
      let loaitaikhoan = this.state.loaiTaiKhoan;
      let mota = this.state.moTa;
      db.transaction(function(tx) {
        tx.executeSql(
          "UPDATE taikhoan SET ten_tai_khoan = ?, so_tien = ?, loai_tai_khoan = ?, mo_ta = ? WHERE ma_tai_khoan like ?",
          [tentaikhoan, sotien, loaitaikhoan, mota, mataikhoan],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Thành công",
                "Bạn đã cập nhật thành công",
                [
                  {
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
              goBack();
            } else {
              alert("Bạn đã cập nhật không thành công");
            }
          }
        );
      });
    }
  }

  XoaTaiKhoan() {
    const { goBack } = this.props.navigation;
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa tài khoản",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                "UPDATE taikhoan SET xoa='y' WHERE ma_tai_khoan like ?",
                [this.state.taiKhoan],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      "Thành công",
                      "Bạn đã xóa tài khoản",
                      [
                        {
                          text: "Ok"
                        }
                      ],
                      { cancelable: false }
                    );
                    goBack();
                  } else {
                    alert("Bạn chưa thể xóa tài khoản này hiện tại");
                  }
                }
              );
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  NgungSuDung() {
    const { goBack } = this.props.navigation;
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn ngưng sử dụng tài khoản",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                "UPDATE taikhoan SET dang_su_dung='n' WHERE ma_tai_khoan like ?",
                [this.state.taiKhoan],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      "Thành công",
                      "Bạn đã ngưng sử dụng tài khoản",
                      [
                        {
                          text: "Ok"
                        }
                      ],
                      { cancelable: false }
                    );
                    goBack();
                  } else {
                    alert("Bạn chưa thể ngưng sử dụng tài khoản này hiện tại");
                  }
                }
              );
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  SuDungLai() {
    const { goBack } = this.props.navigation;
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn sử dụng lại tài khoản",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                "UPDATE taikhoan SET dang_su_dung='y' WHERE ma_tai_khoan like ?",
                [this.state.taiKhoan],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      "Thành công",
                      "Bạn đã sử dụng lại tài khoản",
                      [
                        {
                          text: "Ok"
                        }
                      ],
                      { cancelable: false }
                    );
                    goBack();
                  } else {
                    alert("Bạn chưa thể sử dụng lại tài khoản này hiện tại");
                  }
                }
              );
            });
          }
        }
      ],
      { cancelable: false }
    );
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
            <Text style={styles.textHeader}>SỬA TÀI KHOẢN</Text>
          </Body>
          <Right style={{ flex: 2 }} />
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
                  value={this.state.tenTaiKhoan}
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
          </Card>

          <Card>
            <CardItem
              style={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
            >
              <Button
                block
                info
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "#4cabf2",
                  margin: 4
                }}
                onPress={this.buttonOnClick}
              >
                <Icon name="save" style={styles.iconHeader} />
                <Text
                  style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
                >
                  Ghi
                </Text>
              </Button>
            </CardItem>
            <CardItem
              style={{
                flexDirection: "row",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0
              }}
            >
              <Button
                block
                info
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "#3a455c",
                  margin: 4
                }}
                onPress={
                  this.state.dangSuDung == "y"
                    ? this.NgungSuDung
                    : this.SuDungLai
                }
              >
                <IconMater name="cancel" style={styles.iconHeader} />
                <Text
                  style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
                >
                  {this.state.dangSuDung == "y"
                    ? "Ngưng Sử Dụng"
                    : "Sử Dụng Lại"}
                </Text>
              </Button>

              <Button
                block
                info
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: "#dc3545",
                  margin: 4
                }}
                onPress={this.XoaTaiKhoan}
              >
                <IconMater name="delete" style={styles.iconHeader} />
                <Text
                  style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
                >
                  Xóa
                </Text>
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
