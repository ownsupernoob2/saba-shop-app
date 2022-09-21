import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import Menu from "react-native-material-menu";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import NumberFormat from "react-number-format";

import HeaderButton from "../UI/HeaderButton";
import Colors from "../../constants/Colors";
import CartItem from "./CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

function Cart(props) {
  const dispatch = useDispatch();
  const fee = 0;

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productImage: state.cart.items[key].productImage,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const menu = useRef();

  const showMenu = () => {
    menu.current.show();
  };

  return (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <View style={styles.container}>
        <Menu
          style={styles.cartContainer}
          ref={menu}
          button={
            <Item
              title="Cart"
              iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              onPress={() => {
                showMenu();
              }}
            />
          }
        >
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => {
                props.navigate("Cart");
              }}
            >
              <Text style={styles.title}>Your Cart</Text>
            </TouchableOpacity>
            <View style={styles.items}></View>
            {cartItems.length !== 0 ? (
              <FlatList
                data={cartItems.slice(0, 3)}
                keyExtractor={(item) => item.productId}
                renderItem={(itemData) => (
                  <>
                    {}
                    <CartItem
                      productId={itemData.productId}
                      quantity={itemData.item.quantity}
                      title={itemData.item.productTitle}
                      amount={itemData.item.sum}
                      image={itemData.item.productImage}
                      onRemove={() => {
                        dispatch(
                          cartActions.removeFromCart(itemData.item.productId)
                        );
                      }}
                      onAdd={() => {
                        dispatch(
                          cartActions.addOnCart(itemData.item.productId)
                        );
                      }}
                    />
                  </>
                )}
              />
            ) : (
              <Text
                style={{
                  color: "#999",
                  paddingVertical: "25%",
                  textAlign: "center",
                  fontFamily: "ArialBold",
                }}
              >
                {" "}
                No items found. Start adding some in your Cart!{" "}
              </Text>
            )}
            <View
              style={{
                ...{ top: cartItems.length ^ 3 ? 235 : /* 259 */ 255 },
                ...styles.extra,
              }}
            >
              {cartItems.length > 3 ? (
                <TouchableOpacity onPress={() => props.navigate("Cart")}>
                  <Text style={styles.link}>Show more...</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <NumberFormat
                value={
                  cartItems &&
                  cartItems.reduce((value, cart) => {
                    return (value = value + 4000 * cart.quantity);
                  }, fee)
                }
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
                renderText={(value, props) => (
                  <Text>
                    Delivery:{" "}
                    <Text
                      {...props}
                      style={{
                        color: "#fc4a3a",
                        textAlign: "center",
                        fontFamily: "ArialBold",
                      }}
                    >
                      {value}
                    </Text>
                  </Text>
                )}
              />

              <NumberFormat
                value={cartTotalAmount}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
                renderText={(value, props) => (
                  <Text>
                    Sub Total:{" "}
                    <Text
                      {...props}
                      style={{
                        color: Colors.accent,
                        textAlign: "center",
                        fontFamily: "ArialBold",
                      }}
                    >
                      {value}
                    </Text>
                  </Text>
                )}
              />

              <NumberFormat
                value={
                  Math.round(
              cartItems &&
                cartItems.reduce((value, cart) => {
                  return (value =
                    value + (cartTotalAmount + 4000 * cart.quantity));
                }, fee) * 100
            ) / 100
                }
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
                renderText={(value, props) => (
                  <Text>
                    Total:{" "}
                    <Text {...props} style={styles.sum}>
                      {value}
                    </Text>
                  </Text>
                )}
              />
              <Text></Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableCmp
              onPress={() => {
                Alert.alert(
                  "Clear Cart",
                  "Are you sure you want to clear the cart?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => dispatch(cartActions.clearCart()),
                    },
                  ]
                );
              }}
              disabled={cartItems.length === 0}
            >
              <View
                style={
                  cartItems.length === 0
                    ? styles.disabledClearCart
                    : styles.clearCart
                }
              >
                <Text
                  style={
                    cartItems.length === 0
                      ? {
                          color: Platform.OS === "android" ? "#888" : "#999",
                          fontFamily: "Arial",
                        }
                      : {
                          color: Platform.OS === "android" ? "white" : "red",
                          fontFamily: "Arial",
                        }
                  }
                >
                  Clear Cart
                </Text>
              </View>
            </TouchableCmp>
            <TouchableCmp
              onPress={() => {
                Alert.alert(
              "Order",
              "Are you sure you want to order?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => dispatch(
                  ordersActions.addOrder(
                    cartItems,
                    cartItems.reduce((value, cart) => {
                      return (value =
                        value + (cartTotalAmount + 4000 * cart.quantity));
                    }, fee)
                  )),
                },
              ]
            );
              }}
              disabled={cartItems.length === 0}
            >
              <View
                style={
                  cartItems.length === 0 ? styles.disabledButton : styles.button
                }
              >
                <Text
                  style={
                    cartItems.length === 0
                      ? {
                          color: Platform.OS === "android" ? "#888" : "#999",
                          fontFamily: "Arial",
                        }
                      : {
                          color:
                            Platform.OS === "android"
                              ? "white"
                              : Colors.primary,
                          fontFamily: "Arial",
                        }
                  }
                >
                  Order Now
                </Text>
              </View>
            </TouchableCmp>
          </View>
        </Menu>
      </View>
    </HeaderButtons>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 399,
  },

  cartContainer: {
    marginTop: 30,
    width: "95%",
    height: 399,
  },
  content: {
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "ArialBold",
    color: Colors.primary,
  },

  link: {
    textDecorationLine: "underline",
    color: Colors.primary,
    fontFamily: "ArialBold",
    marginBottom: 5,
    margin: 0,
  },
  extra: {
    position: "absolute",
    left: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sum: {
    fontFamily: "ArialBold",
    color: Colors.primary,
    textAlign: "center",
  },
  actions: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 10,
  },
  clearCart: {
    width: "39%",
    height: 43,
    backgroundColor: Platform.OS === "android" ? "#f93636" : "transparent",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Platform.OS === "android" ? "transparent" : "#f93636",
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginRight: 67,
  },
  button: {
    width: "39%",
    height: 43,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : Colors.primary,
  },
  disabledButton: {
    width: "40%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
  disabledClearCart: {
    width: "40%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginRight: 65,
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
});

export default Cart;
