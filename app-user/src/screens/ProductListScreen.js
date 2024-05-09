import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartReducer";

const ProductListScreen = ({ route }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigation = useNavigation();
  const { storeId } = route.params;
  const [addedToCart, setAddedToCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:5000/api/categories/listCategory"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchProducts = async (categoryId = null) => {
    try {
      let url = "http://10.0.2.2:5000/api/client/products/" + storeId;
      if (categoryId) {
        url += `/${categoryId}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleCategorySelection = (categoryId) => {
    fetchProducts(categoryId);
  };
  const handleShowAllProducts = () => {
    fetchProducts();
  };
  const images = [
    "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712715564/shopee-do-gia-dung-comet-sale-tung-bung-0_itupuo.jpg",
    "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712714924/dyrpkfhnnq8wmssh2met.png",
    "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712715100/salethit_qoxcqm.png",
  ];
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);
  const dispatch = useDispatch();
  const addItemToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // Lọc danh sách sản phẩm dựa trên từ khóa tìm kiếm
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  return (
    <SafeAreaView
      style={{
        paddinTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          backgroundColor: "#00CED1",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 36,
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput
            placeholder="Search Product"
            value={searchKeyword}
            onChangeText={handleSearch}
          />
        </Pressable>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 60 }}
        >
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleShowAllProducts}
          >
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              style={styles.categoryButton}
              key={category._id}
              onPress={() => handleCategorySelection(category._id)}
            >
              <Text>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View>
        <SliderBox
          images={images}
          autoPlay
          circleLoop
          dotColor={"#13274F"}
          inactiveDotColor="#90A4AE"
          ImageComponentStyle={{ width: "100%" }}
        />
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {(searchKeyword ? filteredProducts : products).map((product) => (
            <TouchableOpacity
            key={product._id}
              onPress={() => {
                navigation.navigate("ProductDetail", {
                  productId: product._id,
                  productName: product.name,
                  productPrice: product.price,
                  productImage: product.imageURL[0],
                  productDes: product.description,
                  productQuantity: product.quantity,
                  product: product,
                });
              }}
              style={styles.productContainer}
            >
              <Image
                source={{ uri: product.imageURL[0] }}
                style={styles.productImage}
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 3 }}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    Price: {product.price} $
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => addItemToCart(product)}
                  style={styles.cardButton}
                >
                  {addedToCart ? (
                    <Fontisto
                      name="shopping-basket-add"
                      size={35}
                      color="black"
                    />
                  ) : (
                    <Fontisto
                      name="shopping-basket-add"
                      size={35}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    height: 40,
    borderWidth: 1, // Độ dày của đường viền
    borderColor: "#ccc", // Màu của đường viền
    borderRadius: 20, // Độ cong của góc (nếu muốn bo tròn)
    backgroundColor: "#f0f0f0", // Màu nền của nút
  },
  categoryText: {
    fontSize: 16,
  },
  productContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 7,
    alignItems: "center",
    width: 190,
    height: 180,
  },
  productImage: {
    width: 187,
    height: 125,
    borderRadius: 11,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 16,
    marginTop: 5,
    alignItems: "center",
    flex: 1,
    paddingLeft: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    flex: 1,
    paddingLeft: 5,
  },
  cardButton: {
    paddingVertical: 5,
    alignItems: "center",
    flex: 1,
  },
});

export default ProductListScreen;
