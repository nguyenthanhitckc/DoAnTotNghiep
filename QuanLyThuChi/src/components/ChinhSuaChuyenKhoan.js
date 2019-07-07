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
import MateIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChinhSuaChuyenKhoan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maChuyenKhoan: "",
      maTaiKhoanNguon: "",
      maTaiKhoanDich: "",
      tenTaiKhoanNguon: "Từ tài khoản",
      tenTaiKhoanDich: "Tới tài khoản",
      maTaiKhoanNguonMoi: "",
      maTaiKhoanDichMoi: "",
      tenTaiKhoanNguonMoi: "Từ tài khoản",
      tenTaiKhoanDichMoi: "Tới tài khoản",
      soTien: "0",
      soTienSuaDoi: "0",
      soTienTrongViNguon: 0,
      soTienTrongViDich: 0,
      soTienTrongViNguonMoi: 0,
      soTienTrongViDichMoi: 0,
      phiChuyenKhoan: "",
      phiChuyenKhoanSuaDoi: "",
      ngayChuyenKhoan: new Date(),
      moTa: "",
      isDateTimePickerVisible: false
    };
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.XoaChuyenKhoan = this.XoaChuyenKhoan.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.formatMoney2 = this.formatMoney2.bind(this);
    this.formatPhiChuyenKhoan = this.formatPhiChuyenKhoan.bind(this);
    this.phatSinhMaChiTieu = this.phatSinhMaChiTieu.bind(this);
    this.phatSinhMaThuNhap = this.phatSinhMaThuNhap.bind(this);
    this.KiemTra = this.KiemTra.bind(this);
  }

  // Function
  componentDidMount() {
    const { params } = this.props.navigation.state;
    let ten_tai_khoan_nguon = "";
    let ten_tai_khoan_dich = "";
    let so_tien_tai_khoan_nguon = 0;
    let so_tien_tai_khoan_dich = 0;
    let phi_chuyen_khoan = 0;

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM chuyenkhoan WHERE ma_chuyen_khoan like ?",
        [params.ma_chuyen_khoan],
        (tx, results) => {
          let row = results.rows.item(0);
          this.setState({
            maChuyenKhoan: row.ma_chuyen_khoan,
            maTaiKhoanNguon: row.ma_tai_khoan_nguon,
            maTaiKhoanDich: row.ma_tai_khoan_dich,
            maTaiKhoanNguonMoi: row.ma_tai_khoan_nguon,
            maTaiKhoanDichMoi: row.ma_tai_khoan_dich,
            soTien: this.formatMoney2(row.so_tien),
            soTienSuaDoi: this.formatMoney2(row.so_tien),
            ngay: row.ngay,
            moTa: row.mo_ta
          });
          tx.executeSql(
            "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
            [this.state.maTaiKhoanNguon],
            (tx, results) => {
              ten_tai_khoan_nguon = results.rows.item(0).ten_tai_khoan;
              so_tien_tai_khoan_nguon = results.rows.item(0).so_tien;
              tx.executeSql(
                "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
                [this.state.maTaiKhoanDich],
                (tx, results) => {
                  ten_tai_khoan_dich = results.rows.item(0).ten_tai_khoan;
                  so_tien_tai_khoan_dich = results.rows.item(0).so_tien;
                  tx.executeSql(
                    "SELECT * FROM chitieu WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'phi'",
                    [params.ma_chuyen_khoan],
                    (tx, results) => {
                      if (results.rows.length > 0) {
                        phi_chuyen_khoan = results.rows.item(0).so_tien;
                      }
                      this.setState({
                        phiChuyenKhoan: this.formatMoney2(phi_chuyen_khoan),
                        phiChuyenKhoanSuaDoi: this.formatMoney2(
                          phi_chuyen_khoan
                        ),
                        tenTaiKhoanNguon: ten_tai_khoan_nguon,
                        tenTaiKhoanNguonMoi: ten_tai_khoan_nguon,
                        tenTaiKhoanDich: ten_tai_khoan_dich,
                        tenTaiKhoanDichMoi: ten_tai_khoan_dich,
                        soTienTrongViNguon: so_tien_tai_khoan_nguon,
                        soTienTrongViDich: so_tien_tai_khoan_dich,
                        soTienTrongViNguonMoi: so_tien_tai_khoan_nguon,
                        soTienTrongViDichMoi: so_tien_tai_khoan_dich
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var length = x.length;
    if (length > 9) x = x.substring(0, 9);
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTienSuaDoi: y });
    return y;
  }

  formatMoney2(money) {
    money += "";
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return y;
  }

  formatPhiChuyenKhoan(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ phiChuyenKhoanSuaDoi: y });
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
          function(tx, error) {
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
          function(tx, error) {
            reject(error);
          }
        );
      })
    );
  }

  XoaChuyenKhoan() {
    const { goBack } = this.props.navigation;
    const { navigation } = this.props;
    let moneycuTmp = this.state.soTien.replace(/,/g, "");
    let sotiencu = Number(moneycuTmp);
    let phickTmp = this.state.phiChuyenKhoan.replace(/,/g, "");
    let phickcu = Number(phickTmp);
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa chi tiêu này",
      [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Đồng ý",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                "DELETE FROM chitieu WHERE ma_chuyen_khoan like ?",
                [this.state.maChuyenKhoan],
                (tx, results) => {
                  tx.executeSql(
                    "DELETE FROM thunhap WHERE ma_chuyen_khoan like ?",
                    [this.state.maChuyenKhoan],
                    (tx, results) => {
                      tx.executeSql(
                        "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                        [
                          this.state.soTienTrongViDich - sotiencu,
                          this.state.maTaiKhoanDich
                        ],
                        (tx, results) => {
                          tx.executeSql(
                            "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                            [
                              this.state.soTienTrongViNguon +
                                sotiencu +
                                phickcu,
                              this.state.maTaiKhoanNguon
                            ]
                          );
                        }
                      );
                    }
                  );
                  Alert.alert(
                    "Thành công",
                    "Bạn đã xóa chuyển khoản thành công",
                    [
                      {
                        text: "Đồng ý"
                      }
                    ],
                    { cancelable: false }
                  );
                  navigation.navigate("TaiKhoan");
                }
              );
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  async buttonOnClick() {
    let machitieu = "";
    machitieu = await this.phatSinhMaChiTieu();
    let mathunhap = "";
    mathunhap = await this.phatSinhMaThuNhap();
    let maphick = "";
    let soHienTai = parseInt(machitieu.slice(2, 6), 10) + 1;
    let str = "" + soHienTai;
    let pad = "0000";
    maphick = maphick + pad.substring(0, pad.length - str.length) + str;
    // Kiểm tra đầy đủ:
    if (this.state.soTienSuaDoi == "" || this.state.soTienSuaDoi == "0") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa nhập số tiền!",
        [
          {
            text: "Đồng ý"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.maTaiKhoanNguonMoi == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn tài khoản nguồn!",
        [
          {
            text: "Đồng ý"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.maTaiKhoanDichMoi == "") {
      Alert.alert(
        "Thông báo",
        "Bạn chưa chọn tài khoản đích!",
        [
          {
            text: "Đồng ý"
          }
        ],
        { cancelable: false }
      );
    } else if (this.state.maTaiKhoanDichMoi == this.state.maTaiKhoanNguonMoi) {
      Alert.alert(
        "Thông báo",
        "Bạn không thể chuyển khoản trong cùng 1 tài khoản",
        [
          {
            text: "Đồng ý"
          }
        ],
        { cancelable: false }
      );
    } else {
      const { navigation } = this.props;
      let machuyenkhoan = this.state.maChuyenKhoan;
      let mataikhoannguoncu = this.state.maTaiKhoanNguon;
      let mataikhoandichcu = this.state.maTaiKhoanDich;
      let mataikhoannguonmoi = this.state.maTaiKhoanNguonMoi;
      let mataikhoandichmoi = this.state.maTaiKhoanDichMoi;
      let tentaikhoannguonmoi = this.state.tenTaiKhoanNguonMoi;
      let tentaikhoandichmoi = this.state.tenTaiKhoanDichMoi;
      let moneyTmp = this.state.soTienSuaDoi.replace(/,/g, "");
      let sotiencuTmp = this.state.soTien.replace(/,/g, "");
      let phickTmp = this.state.phiChuyenKhoan;
      if (phickTmp == "") phickTmp = "0";
      phickTmp = phickTmp.replace(/,/g, "");
      let phiCKMoiTmp = this.state.phiChuyenKhoanSuaDoi.replace(/,/g, "");
      if (phiCKMoiTmp == "") phiCKMoiTmp = "0";
      phiCKMoiTmp = phiCKMoiTmp.replace(/,/g, "");
      let sotienmoi = Number(moneyTmp);
      let sotiencu = Number(sotiencuTmp);
      let phickcu = Number(phickTmp);
      let phickmoi = Number(phiCKMoiTmp);
      let sotientrongvinguoncu = this.state.soTienTrongViNguon;
      let sotientrongvidichcu = this.state.soTienTrongViDich;
      let sotientrongvinguonmoi = this.state.soTienTrongViNguonMoi;
      let sotientrongvidichmoi = this.state.soTienTrongViDichMoi;
      let ngay = moment(this.state.ngayChuyenKhoan).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      let mota = this.state.moTa;
      // Update chuyển khoản
      db.transaction(function(tx) {
        tx.executeSql(
          "UPDATE chuyenkhoan SET ma_tai_khoan_nguon = ?, ma_tai_khoan_dich = ?, so_tien = ? , ngay = ?,  mo_ta = ? WHERE ma_chuyen_khoan like ?",
          [
            mataikhoannguonmoi,
            mataikhoandichmoi,
            sotienmoi,
            ngay,
            mota,
            machuyenkhoan
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Thành công",
                "Bạn đã chỉnh sửa thành công!",
                [
                  {
                    text: "Đồng ý"
                  }
                ],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Thất bại",
                "Bạn đã chỉnh sửa không thành công!",
                [
                  {
                    text: "Đồng ý"
                  }
                ],
                { cancelable: false }
              );
            }
          }
        );
      });
      if (mataikhoannguoncu == mataikhoannguonmoi) {
        sotientrongvinguonmoi = sotientrongvinguoncu + sotiencu + phickcu;
      }
      if (mataikhoandichcu == mataikhoandichmoi) {
        sotientrongvidichmoi = sotientrongvidichcu - sotiencu;
      }
      if (
        mataikhoannguoncu == mataikhoandichmoi &&
        mataikhoandichcu == mataikhoannguonmoi
      ) {
        sotientrongvinguonmoi = sotientrongvinguonmoi - sotiencu;
        sotientrongvidichmoi = sotientrongvidichmoi + sotiencu + phickcu;
      }
      // Trả về giá trị ban đầu
      db.transaction(function(tx) {
        tx.executeSql(
          "DELETE FROM chitieu WHERE ma_chuyen_khoan like ?",
          [machuyenkhoan],
          (tx, reults) => {
            tx.executeSql(
              "DELETE FROM thunhap WHERE ma_chuyen_khoan like ?",
              [machuyenkhoan],
              (tx, reults) => {
                tx.executeSql(
                  "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                  [
                    sotientrongvinguoncu + sotiencu + phickcu,
                    mataikhoannguoncu
                  ],
                  (tx, reults) => {
                    tx.executeSql(
                      "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                      [sotientrongvidichcu - sotiencu, mataikhoandichcu],
                      (tx, reults) => {
                        tx.executeSql(
                          "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                          [
                            machitieu,
                            mataikhoannguonmoi,
                            sotienmoi,
                            "hmc0014",
                            "Chuyển đến tài khoản " + tentaikhoandichmoi,
                            "https://nguyenthanhitckc.github.io/images/tien_lai.png",
                            ngay,
                            mota,
                            machuyenkhoan,
                            "chuyenkhoan",
                            "chitieu"
                          ],
                          (tx, reults) => {
                            tx.executeSql(
                              "INSERT INTO thunhap(ma_thu_nhap, ma_tai_khoan, so_tien, ma_hang_muc_thu, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                              [
                                mathunhap,
                                mataikhoandichmoi,
                                sotienmoi,
                                "hmt0007",
                                "Nhận từ tài khoản " + tentaikhoannguonmoi,
                                "https://nguyenthanhitckc.github.io/images/tien_lai.png",
                                ngay,
                                mota,
                                machuyenkhoan,
                                "chuyenkhoan",
                                "thunhap"
                              ],
                              (tx, reults) => {
                                if (phickmoi != 0) {
                                  tx.executeSql(
                                    "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                                    [
                                      maphick,
                                      mataikhoannguonmoi,
                                      phickmoi,
                                      "hmc0014",
                                      "Phí chuyển khoản từ " +
                                        tentaikhoannguonmoi +
                                        " đến " +
                                        tentaikhoandichmoi,
                                      "https://nguyenthanhitckc.github.io/images/tien_lai.png",
                                      ngay,
                                      mota,
                                      machuyenkhoan,
                                      "chuyenkhoan",
                                      "phi"
                                    ]
                                  );
                                }
                                tx.executeSql(
                                  "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                                  [
                                    sotientrongvinguonmoi -
                                      sotienmoi -
                                      phickmoi,
                                    mataikhoannguonmoi
                                  ],
                                  (tx, reults) => {
                                    tx.executeSql(
                                      "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                                      [
                                        sotientrongvidichmoi + sotienmoi,
                                        mataikhoandichmoi
                                      ]
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
    navigation.navigate("TaiKhoan");
  }

  async KiemTra() {
    let moneyTmp = this.state.soTien.replace(/,/g, "");
    let sotien = Number(moneyTmp);
    let soTienViNguon = this.state.soTienTrongViNguonMoi;

    if (soTienViNguon < sotien) {
      Alert.alert(
        "Thông báo",
        "Số tiền bạn chuyển đang nhiều hơn số dư trong tài khoản!",
        [
          {
            text: "Hủy",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "Đồng ý",
            onPress: this.buttonOnClick
          }
        ],
        { cancelable: false }
      );
    } else {
      this.buttonOnClick();
    }
  }

  returnDataTaiKhoanNguon(taiKhoanNguon, tenTaiKhoanNguon, soTien) {
    this.setState({
      maTaiKhoanNguonMoi: taiKhoanNguon,
      tenTaiKhoanNguonMoi: tenTaiKhoanNguon,
      soTienTrongViNguonMoi: soTien
    });
  }

  returnDataTaiKhoanDich(taiKhoanDich, tenTaiKhoanDich, soTien) {
    this.setState({
      maTaiKhoanDichMoi: taiKhoanDich,
      tenTaiKhoanDichMoi: tenTaiKhoanDich,
      soTienTrongViDichMoi: soTien
    });
  }

  render() {
    const { navigation } = this.props;
    console.log("state", this.state);
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flex: 2 }}>
            <Button transparent onPress={() => navigation.navigate("TaiKhoan")}>
              <Icon name="credit-card" style={styles.iconHeader} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>CHỈNH SỬA CHUYỂN KHOẢN</Text>
          </Body>
          <Right style={{ flex: 2 }} />
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
                  style={{ color: "black", fontSize: 18, fontWeight: "bold" }}
                />
                <Input
                  placeholder="0"
                  style={{
                    fontSize: 20,
                    color: "black",
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                  selectTextOnFocus
                  placeholderTextColor="black"
                  keyboardType="numeric"
                  onChangeText={this.formatMoney}
                  value={this.state.soTienSuaDoi}
                />
                <Text
                  style={{ fontSize: 18, color: "black", fontWeight: "bold" }}
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
                  style={{ fontSize: 18, color: "black" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 15, color: "black" }}>
                  {this.state.tenTaiKhoanNguonMoi}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  name="chevron-circle-right"
                  style={{ fontSize: 18, color: "black" }}
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
                  style={{ fontSize: 18, color: "black" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={{ fontSize: 15, color: "black" }}>
                  {this.state.tenTaiKhoanDichMoi}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon
                  name="chevron-circle-right"
                  style={{ fontSize: 18, color: "black" }}
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
                  style={{ fontSize: 18, color: "black", flex: 1 }}
                />
                <Input
                  placeholder="Mô tả"
                  placeholderTextColor="grey"
                  selectTextOnFocus
                  style={{ flex: 9, borderBottomWidth: 0.1 }}
                  value={this.state.moTa}
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
                  style={{ fontSize: 18, color: "black" }}
                />
              </Left>
              <Body style={{ flex: 8 }}>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.hideDateTimePicker}
                  onCancel={this.hideDateTimePicker}
                  mode={"datetime"}
                  is24Hour={true}
                  titleIOS={"Chọn ngày chuyển khoản"}
                  titleStyle={{ color: "black", fontSize: 20 }}
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
                  style={{ color: "black", fontSize: 18, fontWeight: "bold" }}
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
                  value={this.state.phiChuyenKhoanSuaDoi}
                />
                <Text
                  style={{ fontSize: 18, color: "black", fontWeight: "bold" }}
                >
                  đ
                </Text>
              </InputGroup>
            </CardItem>
          </Card>
          <Card style={{ flexDirection: "row" }}>
            <Button
              block
              info
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#009933",
                margin: 5
              }}
              onPress={this.KiemTra}
            >
              <Icon name="save" style={{ fontSize: 18, color: "white" }} />
              <Text style={{ color: "white", marginLeft: 5 }}>Lưu</Text>
            </Button>
            <Button
              block
              info
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#dc3545",
                margin: 5
              }}
              onPress={this.XoaChuyenKhoan}
            >
              <MateIcon name="delete" style={styles.iconHeader} />
              <Text
                style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
              >
                Xóa
              </Text>
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
    marginTop: 5
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
    color: "black",
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
    color: "black",
    fontSize: 20,
    textAlign: "right"
  },
  textContent: {
    color: "black",
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
