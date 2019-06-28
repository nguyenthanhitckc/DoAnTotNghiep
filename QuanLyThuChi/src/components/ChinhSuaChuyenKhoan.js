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
import { getConsoleOutput } from "@jest/console";

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
      tenTaiKhoanNguonMoi: "",
      tenTaiKhoanDichMoi: "",
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

  XoaChuyenKhoan() {
    const { goBack } = this.props.navigation;
    let moneycuTmp = this.state.soTien.replace(/,/g, "");
    let sotiencu = Number(moneycuTmp);
    let phickTmp = this.state.phiChuyenKhoan.replace(/,/g, "");
    let phickcu = Number(phickTmp);
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa chi tiêu này",
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
                        text: "Ok"
                      }
                    ],
                    { cancelable: false }
                  );
                  goBack();
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
    // Kiểm tra đầy đủ:
    if (this.state.soTienSuaDoi == "" || this.state.soTienSuaDoi == "0") {
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
    } else if (this.state.maTaiKhoanNguonMoi == "") {
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
    } else if (this.state.maTaiKhoanDichMoi == "") {
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
    } else if (this.state.maTaiKhoanDichMoi == this.state.maTaiKhoanNguonMoi) {
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
      let machuyenkhoan = this.state.maChuyenKhoan;
      let mataikhoannguon = this.state.maTaiKhoanNguon;
      let mataikhoandich = this.state.maTaiKhoanDich;
      let mataikhoannguonmoi = this.state.maTaiKhoanNguonMoi;
      let mataikhoandichmoi = this.state.maTaiKhoanDichMoi;
      let tentaikhoannguonmoi = this.state.tenTaiKhoanNguonMoi;
      let tentaikhoandichmoi = this.state.tenTaiKhoanDichMoi;
      let moneyTmp = this.state.soTienSuaDoi.replace(/,/g, "");
      let sotiencuTmp = this.state.soTien.replace(/,/g, "");
      let phickTmp = this.state.phiChuyenKhoan.replace(/,/g, "");
      let phiCKMoiTmp = this.state.phiChuyenKhoanSuaDoi.replace(/,/g, "");
      let sotien = Number(moneyTmp);
      let sotiencu = Number(sotiencuTmp);
      let phickcu = Number(phickTmp);
      let phickmoi = Number(phiCKMoiTmp);
      let sotientrongvinguon = this.state.soTienTrongViNguon;
      let sotientrongvidich = this.state.soTienTrongViDich;
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
            sotien,
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
                    text: "Ok"
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
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
            }
          }
        );
      });

      // Update Chi tiêu
      if (mataikhoannguon != mataikhoannguonmoi) {
        sotientrongvinguon = sotientrongvinguon + sotiencu;
        sotientrongvinguonmoi = sotientrongvinguonmoi - sotien;
        db.transaction(function(tx) {
          tx.executeSql(
            "UPDATE chitieu SET ma_tai_khoan = ?, so_tien = ?, ten_hang_muc = ?, ngay = ?, mo_ta = ? WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'chitieu'",
            [
              mataikhoannguonmoi,
              sotien,
              "Chuyển đến tài khoản " + tentaikhoandichmoi,
              ngay,
              mota,
              machuyenkhoan
            ],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien = ? where ma_tai_khoan like ?",
                [sotientrongvinguon, mataikhoannguon],
                (tx, results) => {
                  tx.executeSql(
                    "UPDATE taikhoan set so_tien = ? where ma_tai_khoan like ?",
                    [sotientrongvinguonmoi, mataikhoannguonmoi]
                  );
                }
              );
            }
          );
        });
      } else {
        sotientrongvinguon = sotientrongvinguon + sotiencu - sotien;
        sotientrongvinguonmoi = sotientrongvinguon;
        db.transaction(function(tx) {
          tx.executeSql(
            "UPDATE chitieu SET so_tien = ?, ten_hang_muc = ?, ngay = ?, mo_ta = ? WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'chitieu'",
            [
              sotien,
              "Chuyển đến tài khoản " + tentaikhoandichmoi,
              ngay,
              mota,
              machuyenkhoan
            ],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien = ? where ma_tai_khoan like ?",
                [sotientrongvinguonmoi, mataikhoannguonmoi]
              );
            }
          );
        });
      }

      // Update thu nhập
      if (mataikhoandich != mataikhoandichmoi) {
        sotientrongvidich = sotientrongvidich - sotiencu;
        sotientrongvidichmoi = sotientrongvidichmoi + sotien;
        db.transaction(function(tx) {
          tx.executeSql(
            "UPDATE thunhap SET ma_tai_khoan = ?, so_tien = ?, ten_hang_muc = ?, ngay = ?, mo_ta = ? WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'thunhap'",
            [
              mataikhoandichmoi,
              sotien,
              "Nhận từ tài khoản " + tentaikhoannguonmoi,
              ngay,
              mota,
              machuyenkhoan
            ],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                [sotientrongvidich, mataikhoandich],
                (tx, results) => {
                  tx.executeSql(
                    "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                    [sotientrongvidichmoi, mataikhoandichmoi]
                  );
                }
              );
            }
          );
        });
      } else {
        sotientrongvidich = sotientrongvidich - sotiencu + sotien;
        sotientrongvidichmoi = sotientrongvidich;
        db.transaction(function(tx) {
          tx.executeSql(
            "UPDATE thunhap SET so_tien = ?, ten_hang_muc = ?, ngay = ?, mo_ta = ? WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'thunhap'",
            [
              sotien,
              "Nhận từ tài khoản " + tentaikhoannguonmoi,
              ngay,
              mota,
              machuyenkhoan
            ],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien = ? where ma_tai_khoan like ?",
                [sotientrongvidichmoi, mataikhoandichmoi]
              );
            }
          );
        });
      }

      // Phí chuyển khoản
      if (phickmoi == "") {
        phickmoi = 0;
      }
      console.log(
        "aaaaa",
        sotientrongvinguon,
        sotientrongvinguonmoi,
        sotientrongvidich,
        sotientrongvidichmoi,
        phickcu,
        phickmoi
      );
      if (phickcu == 0 && phickmoi != 0) {
        // Lúc trước không có phí chuyển khoản => Giờ có phí chuyển khoản
        // => INSETRT chitieu
        console.log("phickcu == 0 && phickmoi != 0");
        let machitieuck = "";
        machitieuck = await this.phatSinhMaChiTieu();
        db.transaction(function(tx) {
          tx.executeSql(
            "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
              machitieuck,
              mataikhoannguonmoi,
              phickmoi,
              "hmc0004",
              "Phí chuyển khoản từ " +
                tentaikhoannguonmoi +
                " đến " +
                tentaikhoandichmoi,
              "credit-card",
              ngay,
              mota,
              machuyenkhoan,
              "chuyenkhoan",
              "phi"
            ],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                [sotientrongvinguonmoi - phickmoi, mataikhoannguonmoi]
              );
            }
          );
        });
      } else if (phickcu != 0 && phickmoi == 0) {
        console.log("phickcu != 0 && phickmoi == 0");
        // Lúc trước có phí chuyển khoản => Giờ không có phí chuyển khoản
        // => DELETE chitieu
        db.transaction(function(tx) {
          tx.executeSql(
            "DELETE FROM chitieu WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'phi'",
            [machuyenkhoan],
            (tx, results) => {
              tx.executeSql(
                "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                [sotientrongvinguon + phickcu, mataikhoannguon]
              );
            }
          );
        });
      } else if (phickcu == phickmoi) {
        if (mataikhoannguon == mataikhoannguonmoi) {
          console.log(
            "phickcu == phickmoi && mataikhoannguon == mataikhoannguonmoi"
          );
          // Không cần làm gì
        } else {
          // DELETE phí ck bên tài khoản nguồn cũ, INSERT phí ck mới bên tài khoản mới
          console.log(
            "phickcu == phickmoi && mataikhoannguon != mataikhoannguonmoi"
          );
          let machitieuck = "";
          machitieuck = await this.phatSinhMaChiTieu();
          db.transaction(function(tx) {
            tx.executeSql(
              "DELETE FROM chitieu WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'phi'",
              [machuyenkhoan],
              (tx, results) => {
                console.log("test", sotientrongvinguon + phickcu);
                tx.executeSql(
                  "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                  [sotientrongvinguon + phickcu, mataikhoannguon],
                  (tx, results) => {
                    if (phickmoi != 0) {
                      tx.executeSql(
                        "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          machitieuck,
                          mataikhoannguonmoi,
                          phickmoi,
                          "hmc0004",
                          "Phí chuyển khoản từ " +
                            tentaikhoannguonmoi +
                            " đến " +
                            tentaikhoandichmoi,
                          "credit-card",
                          ngay,
                          mota,
                          machuyenkhoan,
                          "chuyenkhoan",
                          "phi"
                        ],
                        (tx, results) => {
                          tx.executeSql(
                            "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                            [
                              sotientrongvinguonmoi - phickmoi,
                              mataikhoannguonmoi
                            ]
                          );
                        }
                      );
                    }
                  }
                );
              }
            );
          });
        }
      } else {
        // Thay đổi phí chuyển khoản
        if (mataikhoannguon == mataikhoannguonmoi) {
          console.log("thay doi && mataikhoannguon == mataikhoannguonmoi");
          db.transaction(function(tx) {
            tx.executeSql(
              "UPDATE chitieu SET so_tien = ?, ten_hang_muc = ?, ngay = ?, mo_ta = ? WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'phi'",
              [
                phickmoi,
                "Phí chuyển khoản từ " +
                  tentaikhoannguon +
                  " đến " +
                  tentaikhoandichmoi,
                ngay,
                mota,
                machuyenkhoan
              ],
              (tx, results) => {
                tx.executeSql(
                  "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                  [sotientrongvinguon + phickcu - phickmoi, mataikhoannguon]
                );
              }
            );
          });
        } else {
          console.log("thay doi && mataikhoannguon != mataikhoannguonmoi");
          let machitieuck = "";
          machitieuck = await this.phatSinhMaChiTieu();
          db.transaction(function(tx) {
            tx.executeSql(
              "DELETE FROM chitieu WHERE ma_chuyen_khoan like ? AND loai_chuyen_khoan like 'phi'",
              [machuyenkhoan],
              (tx, results) => {
                tx.executeSql(
                  "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                  [sotientrongvinguon + phickcu, mataikhoannguon],
                  (tx, results) => {
                    if (phickmoi != 0) {
                      tx.executeSql(
                        "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          machitieuck,
                          mataikhoannguonmoi,
                          phickmoi,
                          "hmc0004",
                          "Phí chuyển khoản từ " +
                            tentaikhoannguonmoi +
                            " đến " +
                            tentaikhoandichmoi,
                          "credit-card",
                          ngay,
                          mota,
                          machuyenkhoan,
                          "chuyenkhoan",
                          "phi"
                        ],
                        (tx, results) => {
                          tx.executeSql(
                            "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                            [
                              sotientrongvinguonmoi - phickmoi,
                              mataikhoannguonmoi
                            ]
                          );
                        }
                      );
                    }
                  }
                );
              }
            );
          });
        }
      }
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
            <Button
              transparent
              onPress={() => navigation.navigate("LichSuGhiChep")}
            >
              <Icon name="bars" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>CHỈNH SỬA CHUYỂN KHOẢN</Text>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button transparent onPress={this.buttonOnClick}>
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
                  value={this.state.soTienSuaDoi}
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
                  {this.state.tenTaiKhoanNguonMoi}
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
                  {this.state.tenTaiKhoanDichMoi}
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
                  titleIOS={"Chọn ngày chuyển khoản"}
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
                  value={this.state.phiChuyenKhoanSuaDoi}
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
              style={{ height: 40, backgroundColor: "#4cabf2", margin: 5 }}
              onPress={this.buttonOnClick}
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
              <Icon name="delete" style={styles.iconHeader} />
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
