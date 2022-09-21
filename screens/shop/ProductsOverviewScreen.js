import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  LogBox,
  Platform,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import Cart from "../../components/shop/Cart";
import ProductItem from "../../components/shop/ProductItem";
import * as productActions from "../../store/actions/products";
import Rating from "react-native-easy-rating";
import Colors from "../../constants/Colors";

LogBox.ignoreLogs([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
]);
const ProductsOverviewScreen = (props, navigation) => {
  const [rating, setRating] = useState(4.5);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };


  if (isLoading) {
    return (
      <View style={styles.cenetered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.noProducts}>
        <Text style={{ fontFamily: "ArialBold", color: "bbb" }}>
          No products found
        </Text>
      </View>
    );
  }


  return (
    <FlatList
    onRefresh={loadProducts}
      refreshing={isRefreshing}
      numColumns={2}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          discount={itemData.item.discount}
          discountPrice={itemData.item.discountedPrice}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Text style={{ color: "#666" }}>Saba shop</Text>
            <Rating
              rating={rating}
              iconWidth={15}
              iconHeight={21}
              onRate={setRating}
            />
          </View>
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "All Product",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => <Cart navigate={navigation.navigate} />,
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProducts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
});

export default ProductsOverviewScreen;
