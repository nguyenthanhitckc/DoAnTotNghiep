-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 21, 2019 lúc 02:18 PM
-- Phiên bản máy phục vụ: 10.1.39-MariaDB
-- Phiên bản PHP: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qltc`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitieu`
--

CREATE TABLE `chitieu` (
  `ma_chi_tieu` varchar(10) NOT NULL,
  `ma_tai_khoan` varchar(10) NOT NULL,
  `so_tien` int(11) NOT NULL,
  `ma_hang_muc_chi` varchar(10) NOT NULL,
  `ngay` date NOT NULL,
  `ma_nguoi_chi` varchar(10) NOT NULL,
  `mo_ta` varchar(200) NOT NULL,
  `ma_chuyen_khoan` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyenkhoan`
--

CREATE TABLE `chuyenkhoan` (
  `ma_chuyen_khoan` varchar(10) NOT NULL,
  `ma_tai_khoan_nguon` varchar(10) NOT NULL,
  `ma_tai_khoan_dich` varchar(10) NOT NULL,
  `so_tien` int(11) NOT NULL,
  `ngay` date NOT NULL,
  `mo_ta` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhsachchi`
--

CREATE TABLE `danhsachchi` (
  `ma_nguoi_chi` varchar(10) NOT NULL,
  `ten` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhsachthu`
--

CREATE TABLE `danhsachthu` (
  `ma_nguoi_thu` varchar(10) NOT NULL,
  `ten` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hangmucchi`
--

CREATE TABLE `hangmucchi` (
  `ma_chi` varchar(10) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hangmucthu`
--

CREATE TABLE `hangmucthu` (
  `ma_thu` varchar(10) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `ma_tai_khoan` varchar(10) NOT NULL,
  `ten_tai_khoan` varchar(50) NOT NULL,
  `so_tien` int(11) NOT NULL,
  `loai_tai_khoan` varchar(10) NOT NULL,
  `mo_ta` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thunhap`
--

CREATE TABLE `thunhap` (
  `ma_thu_nhap` varchar(10) NOT NULL,
  `ma_tai_khoan` varchar(10) NOT NULL,
  `so_tien` int(11) NOT NULL,
  `ma_hang_muc_thu` varchar(10) NOT NULL,
  `ngay` date NOT NULL,
  `ma_nguoi_thu` varchar(10) NOT NULL,
  `mo_ta` varchar(200) NOT NULL,
  `ma_chuyen_khoan` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chitieu`
--
ALTER TABLE `chitieu`
  ADD PRIMARY KEY (`ma_chi_tieu`);

--
-- Chỉ mục cho bảng `chuyenkhoan`
--
ALTER TABLE `chuyenkhoan`
  ADD PRIMARY KEY (`ma_chuyen_khoan`);

--
-- Chỉ mục cho bảng `danhsachchi`
--
ALTER TABLE `danhsachchi`
  ADD PRIMARY KEY (`ma_nguoi_chi`);

--
-- Chỉ mục cho bảng `danhsachthu`
--
ALTER TABLE `danhsachthu`
  ADD PRIMARY KEY (`ma_nguoi_thu`);

--
-- Chỉ mục cho bảng `hangmucchi`
--
ALTER TABLE `hangmucchi`
  ADD PRIMARY KEY (`ma_chi`);

--
-- Chỉ mục cho bảng `hangmucthu`
--
ALTER TABLE `hangmucthu`
  ADD PRIMARY KEY (`ma_thu`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`ma_tai_khoan`);

--
-- Chỉ mục cho bảng `thunhap`
--
ALTER TABLE `thunhap`
  ADD PRIMARY KEY (`ma_thu_nhap`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
