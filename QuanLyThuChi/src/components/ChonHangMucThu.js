// Import thư viện
import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Platform } from "react-native";
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
import MateIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MyFooter from "./../MyFooter";
import db from "../../connectionDB";

// Const & Variable:
const { height, width } = Dimensions.get("window");

export default class ChonHangMucThu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danhMucThu: [],
      soHangMuc: 0
    };
  }

  // Function
  componentDidMount() {
    let array = [];
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM hangmucthu", [], (tx, results) => {
        var len = results.rows.length;
        this.setState({ soHangMuc: len });
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          array.push(row);
        }
        this.setState({ danhMucThu: array });
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
              <Icon name="bars" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Left>
          <Body style={{ flex: 8 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              CHỌN HẠNG MỤC
            </Text>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button transparent>
              <Icon name="plus" style={{ color: "white", fontSize: 18 }} />
            </Button>
          </Right>
        </Header>

        <Content style={styles.content}>
          <Card style={{ marginLeft: 5, marginRight: 5 }}>
            {this.state.danhMucThu.map((item, i) => (
              <CardItem
                key={i}
                button
                onPress={() => {
                  params.returnDataHangMuc(item.icon, item.ma_thu, item.ten);
                  goBack();
                }}
                style={styles.buttonCardItem}
              >
                <Left style={{ flex: 1 }}>
                  <MateIcon
                    name={item.icon}
                    style={{ fontSize: 18, color: "white" }}
                  />
                </Left>
                <Body style={{ flex: 8 }}>
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  >
                    {item.ten}
                  </Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonCardItem: {
    // js
    borderColor: "grey",
    borderBottomWidth: 0.7,
    height: 50,
    marginTop: 5,
    backgroundColor: "rgb(76,171,242)"
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
