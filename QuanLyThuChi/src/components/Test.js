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
  let ngay = moment(this.state.ngayChuyenKhoan).format("YYYY/MM/DD HH:mm:ss");
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

  // Trả về giá trị ban đầu
  db.transaction(function(tx) {
    tx.executeSql(
      "DELETE FROM chitieu WHERE ma_chuyen_khoan like ?",
      [machuyenkhoan],
      tx => {
        tx.executeSql(
          "DELETE FROM thunhap WHERE ma_thu_nhap like ?",
          [machuyenkhoan],
          tx => {
            tx.executeSql(
              "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
              [sotientrongvinguoncu + sotiencu + phickcu, mataikhoannguoncu],
              tx => {
                tx.executeSql(
                  "UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?",
                  [sotientrongvidichcu - sotiencu, mataikhoandichcu],
                  tx => {
                    let machitieu = "";
                    machitieu = await this.phatSinhMaChiTieu();
                    tx.executeSql(
                      "INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                      [
                        machitieu, 
                        mataikhoannguonmoi,
                        sotienmoi,
                        "hcm0004",
                        "Chuyển đến tài khoản " + tentaikhoandichmoi,
                        "credit-card",
                        ngay,
                        mota,
                        machuyenkhoan,
                        "chuyenkhoan",
                        "chitieu"
                      ],
                      tx => {
                        let mathunhap = "";
                        mathunhap = await this.phatSinhMaThuNhap();
                        tx.executeSql("INSERT INTO thunhap(ma_thu_nhap, ma_tai_khoan, so_tien, ma_hang_muc_thu, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
                        [
                            mathunhap,
                            mataikhoandichmoi,
                            sotienmoi,
                            "hcm0003",
                            "Nhận từ tài khoản " + tentaikhoannguonmoi,
                            "credit-card",
                            ngay,
                            mota,
                            machuyenkhoan,
                            "chuyenkhoan",
                            "thunhap"
                        ], tx => {
                          if (phickmoi != 0) {
                            let maphick = "";
                            maphick = await this.phatSinhMaChiTieu();
                            tx.executeSql("INSERT INTO chitieu(ma_chi_tieu, ma_tai_khoan, so_tien, ma_hang_muc_chi, ten_hang_muc, icon_hang_muc, ngay, mo_ta, ma_chuyen_khoan, loai, loai_chuyen_khoan) VALUES (?,?,?,?,?,?,?,?,?,?,?)", 
                            [
                                maphick,
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
                            ]);
                          }
                          tx.executeSql("UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?", 
                          [
                              sotientrongvinguonmoi - sotienmoi - phickmoi, mataikhoannguonmoi
                          ], tx => {
                            tx.executeSql("UPDATE taikhoan SET so_tien = ? WHERE ma_tai_khoan like ?", 
                            [
                                sotientaikhoandichmoi + sotienmoi
                            ]);
                          });
                        });
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
