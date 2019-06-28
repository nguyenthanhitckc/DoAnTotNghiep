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
import MateIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChinhSuaChiTieu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maChiTieu: "",
      soTien: "0",
      soTienSuaDoi: "0",
      iconHangMuc: "comment-question",
      hangMuc: "",
      tenHangMuc: "Chọn hạng mục",
      moTa: "",
      ngayChi: new Date(),
      taiKhoan: "",
      tenTaiKhoan: "Chọn tài khoản",
      taiKhoanMoi: "",
      nguoiChi: "",
      tenNguoiChi: "Chi cho ai",
      soTienTrongVi: 0,
      soTienTrongViMoi: 0,
      isDateTimePickerVisible: false
    };
    this.buttonOnClick = this.buttonOnClick.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.resetNguoiChi = this.resetNguoiChi.bind(this);
    this.XoaChiTieu = this.XoaChiTieu.bind(this);
  }

  // Function
  componentDidMount() {
    const { params } = this.props.navigation.state;
    // console.log(params);
    let ten_tai_khoan = "";
    let ten_nguoi_chi = "Chi cho ai";
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
        [params.tai_khoan],
        (tx, results) => {
          ten_tai_khoan = results.rows.item(0).ten_tai_khoan;
          if (params.nguoi_chi != "") {
            tx.executeSql(
              "SELECT * FROM danhsachchi WHERE ma_nguoi_chi like ?",
              [params.nguoi_chi],
              (tx, results) => {
                ten_nguoi_chi = results.rows.item(0).ten;
                this.setState({
                  tenTaiKhoan: ten_tai_khoan,
                  tenNguoiChi: ten_nguoi_chi
                });
              }
            );
          } else {
            this.setState({
              tenTaiKhoan: ten_tai_khoan,
              tenNguoiChi: ten_nguoi_chi
            });
          }
        }
      );
    });
    this.setState({
      maChiTieu: params.ma_chi_tieu,
      soTien: this.formatMoney2(params.so_tien + ""),
      soTienSuaDoi: this.formatMoney2(params.so_tien + ""),
      iconHangMuc: params.icon_hang_muc,
      hangMuc: params.hang_muc,
      tenHangMuc: params.ten_hang_muc,
      moTa: params.mo_ta,
      ngayChi: params.ngay_chi,
      taiKhoan: params.tai_khoan,
      taiKhoanMoi: params.tai_khoan,
      nguoiChi: params.nguoi_chi
    });
  }

  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
    this.setState({ ngayChi: datetime });
    moment(this.state.ngayChi).format("YYYY/MM/DD HH:mm:ss");
  };

  formatMoney(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    this.setState({ soTienSuaDoi: y });
    return y;
  }

  formatMoney2(money) {
    var x = money.replace(/,/g, "");
    var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return y;
  }

  resetNguoiChi() {
    this.setState({
      nguoiChi: "",
      tenNguoiChi: "Chi cho ai"
    });
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
      const { goBack } = this.props.navigation;
      let machitieu = this.state.maChiTieu;
      let mataikhoan = this.state.taiKhoanMoi;
      let moneycu = this.state.soTien.replace(/,/g, "");
      let sotiencu = Number(moneycu);
      let moneyTmp = this.state.soTienSuaDoi.replace(/,/g, "");
      let sotiensuadoi = Number(moneyTmp);
      let mahangmucchi = this.state.hangMuc;
      let tenhangmuc = this.state.tenHangMuc;
      let iconhangmuc = this.state.iconHangMuc;
      let ngay = moment(this.state.ngayChi).format("YYYY/MM/DD HH:mm:ss");
      let manguoichi = this.state.nguoiChi;
      let mota = this.state.moTa;
      // Thêm chi tiêu vào bảng chitieu
      db.transaction(function(tx) {
        tx.executeSql(
          "UPDATE chitieu SET ma_tai_khoan = ?, so_tien = ?, ma_hang_muc_chi = ?, ten_hang_muc = ?, icon_hang_muc = ?, ngay = ?, ma_nguoi_chi = ?, mo_ta = ? WHERE ma_chi_tieu = ?",
          [
            mataikhoan,
            sotiensuadoi,
            mahangmucchi,
            tenhangmuc,
            iconhangmuc,
            ngay,
            manguoichi,
            mota,
            machitieu
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Thành công",
                "Bạn đã chỉnh sửa thành công",
                [
                  {
                    text: "Ok"
                  }
                ],
                { cancelable: false }
              );
            } else {
              alert("Bạn đã chỉnh sửa không thành công");
            }
          }
        );
      });

      // Trừ tiền trong ví.
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
          [this.state.taiKhoan],
          (tx, results) => {
            this.setState({
              soTienTrongVi: results.rows.item(0).so_tien
            });
            tx.executeSql(
              "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
              [this.state.soTienTrongVi + sotiencu, this.state.taiKhoan],
              (tx, results) => {
                tx.executeSql(
                  "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
                  [this.state.taiKhoanMoi],
                  (tx, results) => {
                    this.setState({
                      soTienTrongViMoi: results.rows.item(0).so_tien
                    });
                    tx.executeSql(
                      "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                      [
                        this.state.soTienTrongViMoi - sotiensuadoi,
                        this.state.taiKhoanMoi
                      ]
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
  }

  XoaChiTieu() {
    const { goBack } = this.props.navigation;
    let moneycu = this.state.soTien.replace(/,/g, "");
    let sotiencu = Number(moneycu);
    console.log(sotiencu);
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
                "DELETE FROM chitieu WHERE ma_chi_tieu like ?",
                [this.state.maChiTieu],
                (tx, results) => {
                  tx.executeSql(
                    "SELECT * FROM taikhoan WHERE ma_tai_khoan like ?",
                    [this.state.taiKhoan],
                    (tx, results) => {
                      let duLieu = results.rows.item(0).so_tien;
                      duLieu = duLieu + sotiencu;
                      tx.executeSql(
                        "UPDATE taikhoan set so_tien=? where ma_tai_khoan like ?",
                        [duLieu, this.state.taiKhoan]
                      );
                    }
                  );
                  Alert.alert(
                    "Thành công",
                    "Bạn đã xóa chi tiêu thành công",
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

  returnDataHangMuc(iconHangMuc, hangMuc, tenHangMuc) {
    this.setState({
      iconHangMuc: iconHangMuc,
      hangMuc: hangMuc,
      tenHangMuc: tenHangMuc
    });
  }

  returnDataTaiKhoan(taiKhoan, tenTaiKhoan) {
    this.setState({ taiKhoanMoi: taiKhoan, tenTaiKhoan: tenTaiKhoan });
  }

  returnDataNguoiChi(nguoiChi, tenNguoiChi) {
    this.setState({ nguoiChi: nguoiChi, tenNguoiChi: tenNguoiChi });
  }

  render() {
    const { navigation } = this.props;
    const { params } = this.props.navigation.state;
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flex: 2 }}>
            <Button
              transparent
              onPress={() => navigation.navigate("LichSuGhiChep")}
            >
              <Icon name="bars" style={styles.iconHeader} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>CHỈNH SỬA CHI TIÊU</Text>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button transparent onPress={this.buttonOnClick}>
              <Icon name="check" style={styles.iconHeader} />
            </Button>
          </Right>
        </Header>

        <Content style={styles.content}>
          <Card>
            <CardItem header>
              <Text style={styles.titleContent}>Số tiền</Text>
            </CardItem>
            <CardItem>
              <InputGroup borderType="underline">
                <Icon name="money" style={styles.icon} />
                <Input
                  placeholder="0"
                  style={{ ...styles.input, color: "red", fontWeight: "bold" }}
                  placeholderTextColor="red"
                  keyboardType="numeric"
                  selectTextOnFocus
                  onChangeText={this.formatMoney}
                  value={this.state.soTienSuaDoi}
                />
                <Text style={styles.textContent}>đ</Text>
              </InputGroup>
            </CardItem>
          </Card>

          <Card>
            <CardItem
              button
              onPress={() =>
                navigation.navigate("ChonHangMucChi", {
                  returnDataHangMuc: this.returnDataHangMuc.bind(this)
                })
              }
              style={styles.cardItem}
            >
              <Left style={{ flex: 1 }}>
                <MateIcon name={this.state.iconHangMuc} style={styles.icon} />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={styles.textContent}>{this.state.tenHangMuc}</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon name="chevron-circle-right" style={styles.icon} />
              </Right>
            </CardItem>

            <CardItem style={styles.cardItem}>
              <Item>
                <Icon active name="comments" style={styles.icon} />
                <Input
                  placeholder="Mô tả"
                  placeholderTextColor="#3a455c"
                  selectTextOnFocus
                  style={{ ...styles.textContent, paddingLeft: 22 }}
                  value={this.state.moTa}
                  onChangeText={moTa => this.setState({ moTa })}
                />
              </Item>
            </CardItem>

            <CardItem
              button
              onPress={() => this.setState({ isDateTimePickerVisible: true })}
              style={styles.cardItem}
            >
              <Left style={{ flex: 1 }}>
                <Icon active name="calendar" style={styles.icon} />
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
                  {moment(this.state.ngayChi).format("DD/MM/YYYY HH:mm:ss")}
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
              style={styles.cardItem}
            >
              <Left style={{ flex: 1 }}>
                <Icon name="credit-card" style={styles.icon} />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={styles.textContent}>{this.state.tenTaiKhoan}</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon name="chevron-circle-right" style={styles.icon} />
              </Right>
            </CardItem>

            <CardItem
              button
              onPress={() =>
                navigation.navigate("ChiChoAi", {
                  returnDataNguoiChi: this.returnDataNguoiChi.bind(this)
                })
              }
              style={{ ...styles.cardItem, marginRight: 0 }}
            >
              <Left style={{ flex: 1 }}>
                <Icon name="user" style={styles.icon} />
              </Left>
              <Body style={{ flex: 8 }}>
                <Text style={styles.textContent}>{this.state.tenNguoiChi}</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Button
                  style={{
                    ...styles.buttonCardItem,
                    backgroundColor: "white",
                    marginTop: 0,
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={this.resetNguoiChi}
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
          </Card>
          <Card style={{ flexDirection: "row" }}>
            <Button
              block
              info
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#4cabf2",
                margin: 5
              }}
              onPress={this.buttonOnClick}
            >
              <Icon name="save" style={styles.iconHeader} />
              <Text
                style={{ color: "white", marginLeft: 10, fontWeight: "bold" }}
              >
                Lưu
              </Text>
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
              onPress={this.XoaChiTieu}
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
            <Button
              vertical
              onPress={() => navigation.navigate("LichSuGhiChep")}
            >
              <Icon name="filter" style={stylesFooter.iconFooter} />
              <Text style={stylesFooter.textFooter}>Ghi chép</Text>
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
