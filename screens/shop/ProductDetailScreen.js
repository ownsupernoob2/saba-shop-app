import React, { useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Cart from "../../components/shop/Cart";
import Colors from "../../constants/Colors";
import Rating from "react-native-easy-rating";
import * as cartActions from "../../store/actions/cart";
import { Button, InvertedButton } from "../../components/UI/Buttons";
import NumberFormat from "react-number-format";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  const dispatch = useDispatch();

  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  const [rating, setRating] = useState(4.5);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: selectedProduct.imageUrl }}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{selectedProduct.title}</Text>

          <Rating
            rating={rating}
            iconWidth={18}
            iconHeight={24}
            onRate={setRating}
          />
          {selectedProduct.discount > 0 ?

          <Text style={styles.discount}>{selectedProduct.discount}%</Text>
: null}
          <View style={styles.priceContainer}>
            {selectedProduct.discount > 0 ?
            <NumberFormat
              value={selectedProduct.price}
              className="foo"
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp"}
              renderText={(value, props) => (
                <Text {...props} style={styles.oldPrice}>
                  {value}
                </Text>
              )}
            />
            : null}
            <NumberFormat
              value={selectedProduct.discount > 0 ? selectedProduct.discountedPrice : selectedProduct.price}
              className="foo"
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp"}
              renderText={(value, props) => (
                <Text {...props} style={styles.newPrice}>
                  {value}
                  {" "}
                </Text>
              )}
            />
          </View>

          <Text style={styles.description}>{selectedProduct.description}</Text>
            <View style={styles.action}>
              <Button
                onClick={() => dispatch(cartActions.AddToCart(selectedProduct))}
                title="Add to Cart"
              />
              <InvertedButton onClick={() => {}} title="Buy now" />
            </View>
        </View>
      </View>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
    headerRight: () => <Cart navigate={navData.navigation.navigate} />,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  image: {
    width: "75%",
    height: 300,
    alignSelf: "center",
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  title: {
    fontSize: 22,
    marginVertical: 20,
    fontFamily: "ArialBold",
  },
  priceContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  oldPrice: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    marginTop: 5,
    fontFamily: "Arial",
  },
  newPrice: {
    fontSize: 20,
    color: Colors.primary,
    paddingLeft: 5,
    fontFamily: "ArialBold",
  },

  description: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Arial",
  },
 
  content: {
    marginHorizontal: 40,
    marginBottom: 40,
  },


  discount: {
    fontSize: 16,
    color: Colors.accent,
    fontFamily: "Arial",
    marginTop: 15,
  },
});

export default ProductDetailScreen;
