import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import NumberFormat from "react-number-format";

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const fee = 0;

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
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

  const dispatch = useDispatch();

const totalAmountCart = cartItems &&
cartItems.reduce((value, cart) => {
  return (value = value + (cartTotalAmount + 4000 * cart.quantity));
}, fee) * 100

const delivery =   cartItems &&
cartItems.reduce((value, cart) => {
  return (value = value + 4000 * cart.quantity);
}, fee) * 100

const clearCartHandler = () => {
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
}

const sendWhatsAppMessage = async (link) => {
  await Linking.canOpenURL(link)
    .then(supported => {
     if (!supported) {
       alert(
         'Please install Whatsapp to send your address via Whatsapp'
       );
     } else {
      setIsLoading(true);
       Alert.alert(
         "Almost there!",
         "You have to put your address now via Whatsapp!",
         [
           {
             text: "Cancel Order",
             onPress: () => console.log("Cancel Pressed"),
             style: "cancel",
           },
           {
             text: "Okay",
             onPress: () => {
              return Linking.openURL(link),
             dispatch(ordersActions.addOrder(cartItems, totalAmountCart));       
             }
           },
         ]
       );
       setIsLoading(false);
      

     }
   })
   .catch(err => console.error('An error occurred', err));

 };

  const sendOrderHandler = async (link) => {

     
  };
  // Alert.alert(
  //   "Almost there!",
  //   "All you have to do now is put your address!",
  //   {
  //     text: "Okay",
  //     onPress: () => {
       
  //     }

  //   },

  //   {
  //     text: "Cancel order",
  //   }
  // )

  
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.product}>
        {cartItems.length !== 0 ? (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            renderItem={(itemData) => (
              <CartItem
                quantity={itemData.item.quantity}
                title={itemData.item.productTitle}
                amount={itemData.item.sum}
                image={itemData.item.productImage}
                onRemove={() => {
                  dispatch(cartActions.removeFromCart(itemData.item.productId));
                }}
                onAdd={() => {
                  dispatch(cartActions.addOnCart(itemData.item.productId));
                }}
              />
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
            No items found. Start adding some in your Cart!
          </Text>
        )}
      </ScrollView>
      <View style={styles.summary}>
        <NumberFormat
          value={
            Math.round(
              totalAmountCart
            ) / 100
          }
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={styles.summaryText}>
              Total:{" "}
              <Text {...props} style={styles.amount}>
                {value}
              </Text>
            </Text>
          )}
        />

        <NumberFormat
          value={Math.round(cartTotalAmount * 100) / 100}
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={{ fontFamily: "ArialBold" }}>
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
            delivery
            ) / 100
          }
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={{ fontFamily: "ArialBold", fontSize: 13.9 }}>
              Delivery:{" "}
              <Text
                {...props}
                style={{
                  color: "#fc4a3a",
                  textAlign: "center",
                  fontFamily: "ArialBold",
                  fontSize: 14.9,
                }}
              >
                {value}
              </Text>
            </Text>
          )}
        />

        <View style={styles.action}>
          <TouchableCmp
            onPress={clearCartHandler}
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
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <TouchableCmp
              onPress={() => {sendWhatsAppMessage(
      "whatsapp://send?text=Complete+address+%3A%0ARt+%26+Rw%3A%0AVillage%3A%0ASub-district+%3A%0ADistrict+%2F+City%3A%0AProvince%3A%0APinCode&phone=62087784779639"
    )}}  
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
          )}
        </View>
      </View>
    </View>
  );
};
CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};
const styles = StyleSheet.create({
  screen: {
    margin: 20,
    flex: 1,
  },
  product: {
    borderWidth: 1,
    borderColor: "#eee",
    maxHeight: "70%",
    borderRadius: 15,
  },
  summary: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "white",
    position: "absolute",
    bottom: -15,
    width: "100%",
  },
  summaryText: {
    fontFamily: "ArialBold",
    fontSize: 15,
  },
  amount: {
    color: Colors.primary,
  },
  action: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  clearCart: {
    width: "43%",
    height: 45,
    backgroundColor: Platform.OS === "android" ? "#f93636" : "transparent",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Platform.OS === "android" ? "transparent" : "#f93636",
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    marginRight: 67,
  },
  button: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : Colors.primary,
  },
  disabledButton: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
  disabledClearCart: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    marginRight: 65,
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
});

export default CartScreen;
