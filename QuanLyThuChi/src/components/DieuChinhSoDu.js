// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Alert, Platform } from "react-native";
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
  Item,
  Left,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class DieuChinhSoDu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soTienThucTe: "",
      soTienTaiKhoan: "0",
      soTienTrongVi: 0,
      soDu: "0",
      loaiDieuChinh: "",
      iconHangMuc: "question-circle",
      hangMuc: "",
      tenHangMuc: "Chọn hạng mục",
      moTa: "Điều chỉnh số dư tài khoản",
      ngayDieuChinh: new Date(),
      taiKhoan: "",
      tenTaiKhoan: "Chọn tài khoản",
      chenhLech: "Chênh lệch",
      isDateTimePickerVisible: false
    };
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.formatMoneySoTienTaiKhoan = this.formatMoneySoTienTaiKhoan.bind(this);
    this.formatMoneySoDu = this.formatMoneySoDu.bind(this);
    this.phatSinhMaDieuChinh = this.phatSinhMaDieuChinh.bind(this);
    this.phatSinhMaChiTieu = this.phatSinhMaChiTieu.bind(this);
    this.phatSinhMaThuNhap = this.phatSinhMaThuNhap.bind(this);
  }

  // Function
  componentDidMount() { }

  async formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    await this.setState({ soTienThucTe: y });
    let soTienTaiKhoanTmp = this.state.soTienTaiKhoan.replace(/,/g, "");
    let soTienThucTeTmp = this.state.soTienThucTe.replace(/,/g, "");

    let soTienTaiKhoan = Number(soTienTaiKhoanTmp);
    let soTienThucTe = Number(soTienThucTeTmp);
    let soDu = soTienThucTe - soTienTaiKhoan;
    if (soDu > 0) {
      soDu += "";
      await this.setState({
        soDu: this.formatMoneySoDu(soDu),
        chenhLech: "Đã thu",
        loaiDieuChinh: "thunhap"
      });
    } else if (soDu < 0) {
      soDu = -soDu;
      soDu += "";
      await this.setState({
        soDu: this.formatMoneySoDu(soDu),
        chenhLech: "Đã chi",
        loaiDieuChinh: "chitieu"
      });
    } else {
      await this.setState({
        soDu: "0",
        chenhLech: "Chênh lệch",
        loaiDieuChinh: ""
      });
    }
    return y;
  }

  formatMoneySoDu(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soDu: y });
    return y;
  }

  formatMoneySoTienTaiKhoan(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTienTaiKhoan: y });
    this.setState({ soTienThucTe: y });
    return y;
  }

  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
    this.setState({ ngayDieuChinh: datetime });
    moment(this.state.ngayDieuChinh).format("YYYY/MM/DD HH:mm:ss");
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  phatSinhMaDieuChinh() {
    let query = "SELECT * FROM dieuchinhsodu;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("dc0001");
            } else {
              let soHienTai;
              let data;
              let maDC = "dc";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_dieu_chinh FROM dieuchinhsodu WHERE ma_dieu_chinh like (SELECT MAX(ma_dieu_chinh) FROM dieuchinhsodu)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_dieu_chinh;
                    soHienTai = parseInt(data.slice(2, 6), 10) + 1;
                    let str = "" + soHienTai;
                    let pad = "0000";
                    maDC =
                      maDC + pad.substring(0, pad.length - str.length) + str;
                    resolve(maDC);
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

  phatSinhMaChiTieu() {
    let query = "SELECT * FROM chitieu;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("ct0001");
            } else {
              let soHienTai;
              let data;
              let maCT = "ct";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_chi_tieu FROM chitieu WHERE ma_chi_tieu like (SELECT MAX(ma_chi_tieu) FROM chitieu)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_chi_tieu;
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
    if (this.state.soTienThucTe == "") {
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
    } else if (this.state.soTienThucTe == this.state.soTienTaiKhoan) {
      Alert.alert(
        "Thông báo",
        "Số tiền hiện tại bằng số tiền thực tế!",
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
        "Bạn chưa chọn hạng mục!",
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
      let madieuchinh = "";
      madieuchinh = await this.phatSinhMaDieuChinh();
      let mataikhoan = this.state.taiKhoan;
      let loaidieuchinh = this.state.loaiDieuChinh;
      let moneyTmp = this.state.soDu.replace(/,/g, "");
      let chenhlech = Number(moneyTmp);
      let sotienthucteTmp = this.state.soTienThucTe.replace(/,/g, "");
      let sotienthucte = Number(sotienthucteTmp);
      let mahangmuc = this.state.hangMuc;
      let ngay = moment(this.state.ngayDieuChinh).format("YYYY/MM/DD HH:mm:ss");
      let mota = this.state.moTa;
      // Thêm điều chỉnh vào bảng dieuchinh
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO dieuchinhsodu(ma_dieu_chinh, ma_tai_khoan, loai_dieu_chinh, so_tien, ma_hang_muc, ngay, mo_ta) VALUES (?,?,?,?,?,?,?)",
          [
            madieuchinh,
            mataikhoan,
            loaidieuchinh,
            chenhlech,
            mahangmuc,
            ngay,
            mota
          ],
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

      // Thay đổi
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
          [sotienthucte, this.state.taiKhoan]
        );
      });

      if (this.state.loaiDieuChinh == "chitieu") {
        // Thêm vào bảng chi tiêu
        let machitieu = "";
        machitieu = await this.phatSinhMaChiTieu();
        let mataikhoan = this.state.taiKhoan;
        let moneyTmp = this.state.soDu.replace(/,/g, "");
        let sotien = Number(moneyTmp);
        let mahangmuc = this.state.hangMuc;
        let ngay = moment(this.state.ngayDieuChinh).format(
          "YYYY/MM/DD HH:mm:ss"
        );
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi,ngay,mo_ta) VALUES (?,?,?,?,?,?)",
            [machitieu, mataikhoan, sotien, mahangmuc, ngay, "Điều chỉnh số dư"]
          );
        });
      } else {
        let mathunhap = "";
        mathunhap = await this.phatSinhMaThuNhap();
        let mataikhoan = this.state.taiKhoan;
        let moneyTmp = this.state.soDu.replace(/,/g, "");
        let sotien = Number(moneyTmp);
        let mahangmuc = this.state.hangMuc;
        let ngay = moment(this.state.ngayDieuChinh).format(
          "YYYY/MM/DD HH:mm:ss"
        );
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO thunhap(ma_thu_nhap, ma_tai_khoan, so_tien, ma_hang_muc_thu,ngay,mo_ta) VALUES (?,?,?,?,?,?)",
            [mathunhap, mataikhoan, sotien, mahangmuc, ngay, "Điều chỉnh số dư"]
          );
        });
      }
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

  returnDataTaiKhoanDieuChinh(taiKhoan, tenTaiKhoan, soTienTaiKhoan) {
    soTienTaiKhoan += "";
    tmp = this.formatMoneySoTienTaiKhoan(soTienTaiKhoan);
    this.setState({
      taiKhoan: taiKhoan,
      tenTaiKhoan: tenTaiKhoan,
      soTienTaiKhoan: tmp
    });
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

        <Content style={styles.content}>
          <Card>
            <CardItem
              button
              onPress={() =>
                navigation.navigate("ChonTaiKhoanDCSD", {
                  returnDataTaiKhoanDieuChinh: this.returnDataTaiKhoanDieuChinh.bind(
                    this
                  )
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
                <Text style={{ fontSize: 20, color: "black" }}>
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
                  {moment(this.state.ngayDieuChinh).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </Text>
              </Body>
              <Right style={{ flex: 1 }} />
            </CardItem>
          </Card>

          <Card>
            <CardItem>
              <Item>
                <Left style={{ flex: 4 }}>
                  <Text style={{ fontWeight: "bold", color: "black" }}>
                    Số dư trên tài khoản
                  </Text>
                </Left>
                <Body style={{ flex: 0 }} />
                <Right style={{ flex: 6 }}>
                  <Text style={{ fontWeight: "bold", color: "black" }}>
                    {this.state.soTienTaiKhoan} đ
                  </Text>
                </Right>
              </Item>
            </CardItem>

            <CardItem header>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Số dư thực tế
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
                    color: "#3a455c",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="#3a455c"
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={text => this.formatMoney(text)}
                  value={this.state.soTienThucTe}
                />
                <Text
                  style={{ fontSize: 18, color: "#3a455c", fontWeight: "bold" }}
                >
                  đ
                </Text>
              </InputGroup>
            </CardItem>

            <CardItem>
              <Item>
                <Left>
                  <Text style={{ fontWeight: "bold", color: "black" }}>
                    {this.state.chenhLech}
                  </Text>
                </Left>
                <Body />
                <Right>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        this.state.loaiDieuChinh == "chitieu" ? "red" : "green"
                    }}
                  >
                    {" "}
                    {this.state.soDu} đ
                  </Text>
                </Right>
              </Item>
            </CardItem>
          </Card>

          <Card>
            <CardItem
              button
              onPress={() =>
                navigation.navigate(
                  this.state.loaiDieuChinh == "chitieu"
                    ? "ChonHangMucChi"
                    : "ChonHangMucThu",
                  { returnDataHangMuc: this.returnDataHangMuc.bind(this) }
                )
              }
              style={{
                borderColor: "grey",
                borderBottomWidth: 0.7,
                height: 50
              }}
            >
              <Left style={{ flex: 1 }}>
                <Icon
                  name={this.state.iconHangMuc}
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 20, color: "black" }}>
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
                  value={this.state.moTa}
                  selectTextOnFocus
                  style={{ flex: 9, borderBottomWidth: 0.1 }}
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
              <Icon name="save" style={{ fontSize: 18, color: "white" }} />
              <Text style={{ color: "white", marginLeft: 5 }}>Ghi</Text>
            </Button>
          </Card>
        </Content>
        <MyFooter navigation={this.props.navigation} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
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
