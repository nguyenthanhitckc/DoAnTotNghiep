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

export default class ChuyenKhoan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soTien: "",
      phiChuyenKhoan: "",
      moTa: "",
      ngayChuyenKhoan: new Date(),
      taiKhoanNguon: "",
      tenTaiKhoanNguon: "Từ tài khoản",
      taiKhoanDich: "",
      tenTaiKhoanDich: "Tới tài khoản",
      soTienTrongVi: 0,
      soTienTrongViNguon: 0,
      soTienTrongViDich: 0,
      isDateTimePickerVisible: false
    };
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.phatSinhMaChiTieu = this.phatSinhMaChiTieu.bind(this);
    this.phatSinhMaThuNhap = this.phatSinhMaThuNhap.bind(this);
    this.phatSinhMaChuyenKhoan = this.phatSinhMaChuyenKhoan.bind(this);
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.formatPhiChuyenKhoan = this.formatPhiChuyenKhoan.bind(this);
  }

  // Function
  componentDidMount() { }

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTien: y });
    return y;
  }

  formatPhiChuyenKhoan(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ phiChuyenKhoan: y });
    return y;
  }

  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
    this.setState({ ngayChuyenKhoan: datetime });
    moment(this.state.ngayChi).format("YYYY/MM/DD HH:mm:ss");
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  phatSinhMaChuyenKhoan() {
    let query = "SELECT * FROM chuyenkhoan;";
    return new Promise((resolve, reject) =>
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (tx, results) => {
            var soDong = results.rows.length;
            if (soDong == 0) {
              resolve("ck0001");
            } else {
              let soHienTai;
              let data;
              let maCK = "ck";
              db.transaction(tx => {
                tx.executeSql(
                  "SELECT ma_chuyen_khoan FROM chuyenkhoan WHERE ma_chuyen_khoan like (SELECT MAX(ma_chuyen_khoan) FROM chuyenkhoan)",
                  [],
                  (tx, results) => {
                    data = results.rows.item(0).ma_chuyen_khoan;
                    soHienTai = parseInt(data.slice(2, 6), 10) + 1;
                    let str = "" + soHienTai;
                    let pad = "0000";
                    maCK =
                      maCK + pad.substring(0, pad.length - str.length) + str;
                    resolve(maCK);
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
    } else if (this.state.taiKhoanNguon == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn tài khoản nguồn!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.taiKhoanDich == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn tài khoản đích!",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.taiKhoanDich == this.state.taiKhoanNguon) {
      Alert.alert(
        "Thông báo",
        "Bạn không thể chuyển khoản trong cùng 1 tài khoản",
        [
          {
            text: "Ok"
          }
        ],
        { cancelable: false }
      );
    } else {
      let machuyenkhoan = "";
      machuyenkhoan = await this.phatSinhMaChuyenKhoan();
      let mataikhoannguon = this.state.taiKhoanNguon;
      let mataikhoandich = this.state.taiKhoanDich;
      let moneyTmp = this.state.soTien.replace(/,/g, "");
      let sotien = Number(moneyTmp);
      let ngay = moment(this.state.ngayChuyenKhoan).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      let mota = this.state.moTa;
      // Thêm chuyển khoản vào bảng chuyển khoản
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO chuyenkhoan(ma_chuyen_khoan, ma_tai_khoan_nguon, ma_tai_khoan_dich, so_tien, ngay, mo_ta) VALUES (?,?,?,?,?,?)",
          [machuyenkhoan, mataikhoannguon, mataikhoandich, sotien, ngay, mota],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Thành công",
                "Bạn đã chuyển khoản thành công!",
                [
                  {
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Thất bại",
                "Bạn đã chuyển khoản không thành công!",
                [
                  {
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
            }
          }
        );
      });

      // Thêm vào bảng chi tiêu
      let machitieu = "";
      machitieu = await this.phatSinhMaChiTieu();
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi,ngay,mo_ta) VALUES (?,?,?,?,?,?)",
          [
            machitieu,
            mataikhoannguon,
            sotien,
            "hmc0004",
            ngay,
            "Chuyển cho ví " + this.state.tenTaiKhoanDich
          ]
        );
      });

      // Trừ tiền trong ví nguồn
      let soTienViNguon = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
            [this.state.taiKhoanNguon],
            (tx, results) => {
              let soTienTrongViNguon = results.rows.item(0).so_tien;
              resolve(soTienTrongViNguon);
            }
          );
        });
      });
      soTienViNguon -= sotien;
      this.setState({ soTienTrongViNguon: soTienViNguon });
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
          [soTienViNguon, this.state.taiKhoanNguon]
        );
      });

      // Thêm vào bảng thu nhập
      let mathunhap = "";
      mathunhap = await this.phatSinhMaThuNhap();
      db.transaction(function (tx) {
        tx.executeSql(
          "INSERT INTO thunhap(ma_thu_nhap, ma_tai_khoan, so_tien, ma_hang_muc_thu,ngay,mo_ta) VALUES (?,?,?,?,?,?)",
          [
            mathunhap,
            mataikhoandich,
            sotien,
            "hmt0003",
            ngay,
            "Nhận từ ví " + this.state.tenTaiKhoanNguon
          ]
        );
      });

      // Thêm tiền trong ví đích
      let soTienViDich = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
            [this.state.taiKhoanDich],
            (tx, results) => {
              let soTienTrongViDich = results.rows.item(0).so_tien;
              resolve(soTienTrongViDich);
            }
          );
        });
      });
      soTienViDich += sotien;
      this.setState({ soTienTrongViDich: soTienViDich });
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
          [soTienViDich, this.state.taiKhoanDich]
        );
      });

      // Phí chuyển khoản
      if (this.state.soTien != "") {
        let machitieu = "";
        machitieu = await this.phatSinhMaChiTieu();
        let mataikhoan = this.state.taiKhoanNguon;
        let phiCKTmp = this.state.phiChuyenKhoan.replace(/,/g, "");
        let phiCK = Number(phiCKTmp);
        let sotien = phiCK;
        let mahangmucchi = "hmc0004";
        let ngay = moment(this.state.ngayChuyenKhoan).format(
          "YYYY/MM/DD HH:mm:ss"
        );
        let mota =
          "Phí chuyển khoản từ tài khoản " +
          this.state.tenTaiKhoanNguon +
          " đến tài khoản " +
          this.state.tenTaiKhoanDich;

        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ngay, mo_ta, ma_chuyen_khoan) VALUES (?,?,?,?,?,?,?)",
            [
              machitieu,
              mataikhoan,
              sotien,
              mahangmucchi,
              ngay,
              mota,
              machuyenkhoan
            ]
          );
        });

        let duLieu = await new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
              [this.state.taiKhoanNguon],
              (tx, results) => {
                let soTienTrongVi = results.rows.item(0).so_tien;
                resolve(soTienTrongVi);
              }
            );
          });
        });
        duLieu -= sotien;
        this.setState({ soTienTrongVi: duLieu });
        db.transaction(tx => {
          tx.executeSql(
            "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
            [duLieu, this.state.taiKhoanNguon]
          );
        });
      }
    }
  }

  returnDataTaiKhoanNguon(taiKhoanNguon, tenTaiKhoanNguon) {
    this.setState({
      taiKhoanNguon: taiKhoanNguon,
      tenTaiKhoanNguon: tenTaiKhoanNguon
    });
  }

  returnDataTaiKhoanDich(taiKhoanDich, tenTaiKhoanDich) {
    this.setState({
      taiKhoanDich: taiKhoanDich,
      tenTaiKhoanDich: tenTaiKhoanDich
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
                    color: "#3a455c",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                  selectTextOnFocus
                  placeholderTextColor="#3a455c"
                  keyboardType="numeric"
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
                navigation.navigate("ChonTaiKhoanNguon", {
                  returnDataTaiKhoanNguon: this.returnDataTaiKhoanNguon.bind(
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
                <Text style={{ fontSize: 15, color: "black" }}>
                  {this.state.tenTaiKhoanNguon}
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
                navigation.navigate("ChonTaiKhoanDich", {
                  returnDataTaiKhoanDich: this.returnDataTaiKhoanDich.bind(this)
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
                <Text style={{ fontSize: 15, color: "black" }}>
                  {this.state.tenTaiKhoanDich}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  name="chevron-circle-right"
                  style={{ fontSize: 18, color: "#3a455c" }}
                />
              </Right>
            </CardItem>
          </Card>

          <Card>
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
                  placeholderTextColor="grey"
                  selectTextOnFocus
                  style={{ flex: 9, borderBottomWidth: 0.1 }}
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
                  {moment(this.state.ngayChuyenKhoan).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </Text>
              </Body>
              <Right style={{ flex: 1 }} />
            </CardItem>
            <CardItem header>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Phí chuyển khoản
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
                    color: "red",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                  placeholderTextColor="red"
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={this.formatPhiChuyenKhoan}
                  value={this.state.phiChuyenKhoan}
                />
                <Text
                  style={{ fontSize: 18, color: "#3a455c", fontWeight: "bold" }}
                >
                  đ
                </Text>
              </InputGroup>
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
