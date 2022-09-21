import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { default as NumberFormat } from "react-number-format";

import Colors from "../../constants/Colors";
import Card from "../UI/Card";

const ProductItem = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }


  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{props.title}</Text>
              <View>
                <NumberFormat
                  value={props.discount > 0 ? props.discountPrice : props.price}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp"}
                  renderText={(value, props) => (
                    <Text {...props} style={styles.newPrice}>
                      {value}
                    </Text>
                  )}
                />
                
                {props.discount > 0 ? (
                  <View style={styles.discountDrop}>
                  <NumberFormat
                    value={props.price}
                    className="foo"
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                    renderText={(value, props) => (
                      <Text>
                        <Text {...props} style={styles.oldPrice}>
                          {value}
                        </Text>{" "}
                      </Text>
                    )}
                  />
                  <Text
                  style={{
                    color: Colors.accent,
                    textDecorationLine: "none",
                    fontFamily: "ArialBold",
                  }}
                >
                  {props.discount}%
                </Text>
                </View>
                ) : null}

              </View>
              <View style={styles.actions}>{props.children}</View>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {

    height: 300,
    margin: 6,
    width: "47%",
  },
  touchable: {
    borderRadius: 5,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: "Arial",
    fontSize: 18,
    marginVertical: 5,
  },
  oldPrice: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#666",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  newPrice: {
    fontSize: 17,
    color: Colors.primary,
    fontFamily: "ArialBold",
  },
  actions: {
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountDrop: {
    flexDirection: "row",
  }
});

export default ProductItem;
