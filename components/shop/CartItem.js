import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import NumberFormat from "react-number-format";

import { Ionicons } from "react-native-vector-icons";
import Colors from "../../constants/Colors";

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: props.image }} />
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>
          <Text style={styles.quantity}>{props.quantity}</Text> {props.title}
        </Text>
        <Text>
          <NumberFormat
            value={props.amount} // value to be formatted
            className="foo" 
            displayType={"text"} // text, currency, percent
            thousandSeparator={true}  // default is false
            prefix={"Rp"}     // prefix for number
            renderText={(value, props) => (
              <Text
                {...props}
                style={{ ...styles.mainText, ...{ color: Colors.primary } }}
              >
                {value}  
              </Text>
            )}
          />
        </Text>
        <View style={styles.actions}></View>
      </View>

      <TouchableOpacity style={styles.button} onPress={props.onAdd}>
        <Ionicons
          name={
            Platform.OS === "android" ? "add-circle" : "ios-add-circle-outline"
          }
          size={30}
          color={!props.disable ? "green" : "#888"}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={props.onRemove}>
        <Ionicons
          name={
            Platform.OS === "android"
              ? "remove-circle"
              : "ios-remove-circle-outline"
          }
          size={30}
          color={!props.disable ? "red" : "#888"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
  },

  imageContainer: {
    borderColor: "#aaa",
    borderWidth: 2,
    width: "17%",
    height: 55,
    alignSelf: "center",
    marginRight: 10,
  },
  image: {
    height: 50,
    padding: 0,
    margin: 0,
  },
  itemData: {
    width: "54%",
    height: 63,
  },
  quantity: {
    fontFamily: "Arial",
    color: "#888",
    fontSize: 16,
  },
  mainText: {
    paddingTop: 5,
    fontFamily: "ArialBold",
    fontSize: 15,
  },
  button: {
    marginTop: 30,
    marginLeft: 10,
  },
});

export default CartItem;
