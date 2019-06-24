// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Alert } from "react-native";
import {
    Body,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Left,
    Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");
export default class GhiChepCuaTaiKhoan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canh_xem: "",
            ngay: 0,
            thang: 5,
            quy: 0,
            tu_ngay: 0,
            den_ngay: 0,
            tong_chi: 0,
            tong_thu: 0,
            ghi_chep: []
        };
        this.formatMoney = this.formatMoney.bind(this);
    }

    async componentDidMount() {
        const { params } = this.props.navigation.state;
        await this.setState({
            tong_chi: 0,
            tong_thu: 0
        });
        let tmp = [];
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM chitieu",
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        tmp.push(row);
                    }
                    tx.executeSql(
                        "SELECT * FROM thunhap",
                        [],
                        (tx, results) => {
                            var len = results.rows.length;
                            for (let i = 0; i < len; i++) {
                                let row = results.rows.item(i);
                                tmp.push(row);
                            }
                            let ghi_chep = tmp.sort((a, b) => (moment(a.ngay, "YYYY/MM/DD HH:mm:ss") > moment(b.ngay, "YYYY/MM/DD HH:mm:ss")) ? -1 : 1);
                            this.setState({ ghi_chep: ghi_chep });
                        }
                    );
                }
            );
        });
    }

    formatMoney(money) {
        money += "";
        var x = money.replace(/,/g, "");
        var y = x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return y;
    }

    renderGhiChepTheoThang(item, i) {
        let thang = this.state.thang;
        console.log('ahihi', thang, moment(new Date(item.ngay)).month() + 1);
        if (moment(new Date(item.ngay)).month() + 1 == thang) {
            return (
                <CardItem
                    key={i}
                    button
                    onPress={() => { }}
                    style={styles.cardItem}
                >
                    <Left style={{ flex: 1 }}>
                        <Icon name={item.icon_hang_muc} style={styles.icon} />
                    </Left>
                    <Body style={{ flex: 6, flexDirection: 'column', marginLeft: 10 }}>
                        <Text style={{ fontSize: 20 }}>{item.ten_hang_muc}</Text>
                        <Text style={{ fontSize: 15, marginTop: 5 }}>{item.mo_ta}</Text>
                        <Text style={{ fontSize: 20, marginTop: 5 }}>{moment(item.ngay).format('DD/MM/YYYY')}</Text>
                    </Body>
                    <Right style={{ flex: 6 }}>
                        <Text style={{ ...styles.textContentMoney, color: item.loai == 'chitieu' ? 'red' : 'green' }}>
                            {this.formatMoney(item.so_tien)} đ
                                 </Text>
                    </Right>
                </CardItem>)

        }
        else {
            return null;
        }
    }

    render() {
        const { navigation } = this.props;
        console.log('lieu dep trai chim nho');
        console.log(this.state.ghi_chep);
        return (
            <Container>
                <Header style={styles.header}>
                    <Text style={styles.textHeader}>LỊCH SỬ GHI CHÉP</Text>
                </Header>

                <Content style={styles.content}>
                    <Card>
                        <CardItem>
                            <Left>
                                <Text>Tổng thu</Text>
                            </Left>
                            <Right>
                                <Text style={{ color: 'green' }}>{this.formatMoney(this.state.tong_thu)}đ</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Tổng chi</Text>
                            </Left>
                            <Right>
                                <Text style={{ color: 'red' }}>{this.formatMoney(this.state.tong_chi)}đ</Text>
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        {this.state.ghi_chep.map((item, i) => {
                            return this.renderGhiChepTheoThang(item, i);
                        }
                        )}
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
        color: "#3a455c",
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