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
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import db from "../../connectionDB";
// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ThuNhapCopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soTien: "",
      iconHangMuc: "question-circle",
      hangMuc: "",
      tenHangMuc: "Chọn hạng mục",
      moTa: "",
      ngayThu: new Date(),
      taiKhoan: "",
      tenTaiKhoan: "Chọn tài khoản",
      nguoiThu: "",
      tenNguoiThu: "Thu từ ai",
      soTienTrongVi: 0,
      isDateTimePickerVisible: false
    };
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.phatSinhMaThuNhap = this.phatSinhMaThuNhap.bind(this);
    this.resetNguoiThu = this.resetNguoiThu.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      soTien: params.so_tien,
      moTa: params.mo_ta,
      taiKhoan: params.ma_tai_khoan,
      tenTaiKhoan: params.ten_tai_khoan
    });
  }

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTien: y });
    return y;
  }
  resetNguoiThu() {
    this.setState({
      nguoiThu: "",
      tenNguoiThu: "Thu từ ai"
    });
  }
  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
    this.setState({ ngayThu: datetime });
    moment(this.state.ngayChi).format("YYYY/MM/DD HH:mm:ss");
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  phatSinhMaThuNhap() {
    let query = "SELECT * FROM thunhap;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("tn0001");
            } else {
              let soHienTai;
              let data;
              let maTN = "tn";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_thu_nhap FROM thunhap WHERE ma_thu_nhap like (SELECT MAX(ma_thu_nhap) FROM thunhap)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_thu_nhap;
                    soHienTai = parseInt(data.slice(2, 6), 10) + 1;
                    let str = "" + soHienTai;
                    let pad = "0000";
                    maTN =
                      maTN + pad.substring(0, pad.length - str.length) + str;
                    resolve(maTN);
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
        "Bạn chưa nhập số tiền!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.hangMuc == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn hạng mục chi!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.taiKhoan == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn tài khoản!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else {
      let mathunhap = "";
      mathunhap = await this.phatSinhMaThuNhap();
      let mataikhoan = this.state.taiKhoan;
      let moneyTmp = this.state.soTien.replace(/,/g, "");
      let sotien = Number(moneyTmp);
      let mahangmucthu = this.state.hangMuc;
      let ngay = moment(this.state.ngayThu).format("YYYY/MM/DD HH:mm:ss");
      let manguoithu = this.state.nguoiThu;
      let mota = this.state.moTa;
      // Thêm chi tiêu vào bảng chitieu
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO thunhap(ma_thu_nhap, ma_tai_khoan, so_tien, ma_hang_muc_thu,ngay,ma_nguoi_thu,mo_ta) VALUES (?,?,?,?,?,?,?)",
          [mathunhap, mataikhoan, sotien, mahangmucthu, ngay, manguoithu, mota],
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

      // Thêm tiền vào ví.
      let duLieu = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
            [this.state.taiKhoan],
            (tx, results) => {
              let soTienTrongVi = results.rows.item(0).so_tien;
              resolve(soTienTrongVi);
            }
          );
        });
      });
      duLieu += sotien;
      this.setState({ soTienTrongVi: duLieu });
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
          [duLieu, this.state.taiKhoan]
        );
      });
    }
    this.forceUpdate();
  }

  returnDataHangMuc(iconHangMuc, hangMuc, tenHangMuc) {
    this.setState({
      iconHangMuc: iconHangMuc,
      hangMuc: hangMuc,
      tenHangMuc: tenHangMuc
    });
  }

  returnDataTaiKhoan(taiKhoan, tenTaiKhoan) {
    this.setState({ taiKhoan: taiKhoan, tenTaiKhoan: tenTaiKhoan });
  }

  returnDataNguoiThu(nguoiThu, tenNguoiThu) {
    this.setState({ nguoiThu: nguoiThu, tenNguoiThu: tenNguoiThu });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flexDirection: "row" }}>
            <Button transparent>
              <Icon name="bars" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Left>
          <Right>
            <Button transparent>
              <Icon name="check" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Right>
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
          <Card>
            <CardItem header>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Số tiền
              </Text>
            </CardItem>
            <CardItem>
              <InputGroup borderType="underline">
                <Icon
                  name="money"
                  style={{ color: "#3a455c", fontSize: 18, fontWeight: "bold" }}
                />
                <Input
                  placeholder="0"
                  style={{
                    fontSize: 20,
                    color: "green",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="green"
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={this.formatMoney}
                  value={this.state.soTien}
                />
                <Text
                  style={{ fontSize: 18, color: "#3a455c", fontWeight: "bold" }}
                >
                  đ
                </Text>
              </InputGroup>
            </CardItem>
          </Card>

          <Card>
            <CardItem
              button
              onPress={() =>
                navigation.navigate("ChonHangMucThu", {
                  returnDataHangMuc: this.returnDataHangMuc.bind(this)
                })
              }
              style={{
                borderColor: "grey",
                borderBottomWidth: 0.7,
                height: 50
              }}
            >
              <Left style={{ flex: 1 }}>
                <Icon
                  name="question-circle"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 20, color: "black", paddingLeft: 10 }}>
                  {this.state.tenHangMuc}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  name="chevron-circle-right"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Right>
            </CardItem>

            <CardItem
              style={{
                borderColor: "grey",
                borderBottomWidth: 0.7,
                height: 50
              }}
            >
              <Item>
                <Icon
                  active
                  name="comments"
                  style={{ fontSize: 18, color: "#3a455c", flex: 1 }}
                />
                <Input
                  placeholder="Mô tả"
                  placeholderTextColor="#3a445c"
                  style={{
                    flex: 9,
                    borderBottomWidth: 0.1,
                    fontSize: 18,
                    color: "black",
                    paddingLeft: 12
                  }}
                  value={this.state.moTa}
                  selectTextOnFocus
                  onChangeText={moTa => this.setState({ moTa })}
                />
              </Item>
            </CardItem>

            <CardItem
              button
              onPress={() => this.setState({ isDateTimePickerVisible: true })}
              style={{ borderColor: "grey", borderBottomWidth: 0.7 }}
            >
              <Left style={{ flex: 1 }}>
                <Icon
                  active
                  name="calendar"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.hideDateTimePicker}
                  onCancel={this.hideDateTimePicker}
                  mode={"datetime"}
                  is24Hour={true}
                  titleIOS={"Chọn ngày chi"}
                  titleStyle={{ color: "#3a455c", fontSize: 20 }}
                  locale={"vie"}
                  customConfirmButtonIOS={
                    <Text
                      style={{ ...styles.textContent, textAlign: "center" }}
                    >
                      Xác nhận
                    </Text>
                  }
                  cancelTextIOS={"Hủy"}
                />
                <Text style={styles.textContent}>
                  {moment(this.state.ngayThu).format("DD/MM/YYYY HH:mm:ss")}
                </Text>
              </Body>
              <Right style={{ flex: 1 }} />
            </CardItem>

            <CardItem
              button
              onPress={() =>
                navigation.navigate("ChonTaiKhoan", {
                  returnDataTaiKhoan: this.returnDataTaiKhoan.bind(this)
                })
              }
              style={{
                borderColor: "grey",
                borderBottomWidth: 0.7,
                height: 50
              }}
            >
              <Left style={{ flex: 1 }}>
                <Icon
                  name="credit-card"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 15, color: "black", paddingLeft: 10 }}>
                  {this.state.tenTaiKhoan}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  name="chevron-circle-right"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Right>
            </CardItem>

            <CardItem
              button
              onPress={() =>
                navigation.navigate("ThuTuAi", {
                  returnDataNguoiThu: this.returnDataNguoiThu.bind(this)
                })
              }
            >
              <Left style={{ flex: 1 }}>
                <Icon name="user" style={{ fontSize: 18, color: "#3a455c" }} />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 18, color: "black", paddingLeft: 10 }}>
                  {this.state.tenNguoiThu}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Button
                  style={{
                    ...styles.buttonCardItem,
                    backgroundColor: "white",
                    marginTop: 0
                  }}
                  onPress={this.resetNguoiThu}
                >
                  <Icon
                    name="times"
                    style={{
                      ...styles.icon,
                      color: "red"
                    }}
                  />
                </Button>
              </Right>
            </CardItem>

            <Button
              block
              info
              style={{ height: 40, backgroundColor: "rgb(76,171,242)" }}
              onPress={this.buttonOnClick}
            >
              <Icon name="save" style={{ fontSize: 18, color: "white" }} />
              <Text style={{ color: "white", marginLeft: 5 }}>Ghi</Text>
            </Button>
          </Card>
        </Content>

        <Footer style={stylesFooter.footer}>
          <FooterTab style={stylesFooter.footer}>
            <Button vertical onPress={() => navigation.navigate("TongQuan")}>
              <Icon name="home" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Tổng quan</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Tài khoản</Text>
            </Button>
            <Button
              vertical
              onPress={() =>
                navigation.navigate("ThemMoiCopy", {
                  so_tien: this.state.soTien,
                  mo_ta: this.state.moTa,
                  ma_tai_khoan: this.state.taiKhoan,
                  ten_tai_khoan: this.state.tenTaiKhoan
                })
              }
            >
              <Icon name="plus-circle" style={stylesFooter.iconPlusCircle} />
            </Button>
            <Button vertical onPress={() => navigation.navigate("HanMucChi")}>
              <Icon name="filter" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Hạn mức chi</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("Khac")}>
              <Icon name="ellipsis-h" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Khác</Text>
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
const stylesFooter = StyleSheet.create({
  iconHeader: {
    color: "white",
    fontSize: 18
  },
  iconFooter: {
    color: "rgb(76,171,242)",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "rgb(76,171,242)",
    fontSize: 30
  },
  footer: {
    backgroundColor: "rgb(235,239,242)",
    color: "rgb(235,239,242)",
    height: 40
  },
  textFooter: {
    color: "rgb(76,171,242)",
    fontSize: 10,
    fontFamily: "Times New Roman"
  }
});
