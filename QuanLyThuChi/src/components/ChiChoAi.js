// Import thư viện
import React, { Component } from "react";
import { Text, Dimensions, StyleSheet } from "react-native";
import {
  Button,
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
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");
// var db;

export default class ChonHangMucChi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danhSachChi: [],
      soNguoiChi: 0
    };
  }

  componentDidMount() {
    let array = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM danhsachchi", [], (tx, results) => {
        var len = results.rows.length;
        this.setState({ soNguoiChi: len });
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          array.push(row);
        }
        this.setState({ danhSachChi: array });
      });
    });
  }
  render() {
    const { navigation } = this.props;
    const { params } = this.props.navigation.state;
    const { goBack } = this.props.navigation;
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="bars" style={styles.icon} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={styles.textHeader}>VỚI AI</Text>
          </Body>
          <Right style={{ flex: 2 }} />
        </Header>

        <Content style={styles.content}>
          <Card style={styles.card}>
            {this.state.danhSachChi.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataNguoiChi(item.ma_nguoi_chi, item.ten);
                  goBack();
                }}
                style={styles.buttonCardItem}
              >
                <Left style={{ flex: 1 }}>
                  <Icon name="user" style={styles.icon} />
                </Left>
                <Body style={{ flex: 8 }}>
                  <Text style={styles.textContent}>{item.ten}</Text>
                </Body>
                <Right style={{ flex: 1 }} />
              </CardItem>
            ))}
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
    marginTop: 5,
    backgroundColor: "#3a455c"
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
    backgroundColor: "#3a445c",
    borderBottomColor: "#757575",
    height: 40
  },
  icon: {
    color: "white",
    fontSize: 18
  },
  iconPlusCircle: {
    color: "white",
    fontSize: 30
  },
  textContent: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
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
  }
});
