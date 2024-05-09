import { createSlice, createSelector  } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCartOk: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (itemPresent) {
        itemPresent.quantities++;
      } else {
        state.cart.push({ ...action.payload, quantities: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item._id !== action.payload._id
      );
      state.cart = removeItem;
    },
    incementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );
      itemPresent.quantities++;
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (itemPresent.quantities === 1) {
        itemPresent.quantities = 0;
        const removeItem = state.cart.filter(
          (item) => item._id !== action.payload._id
        );
        state.cart = removeItem;
      } else {
        itemPresent.quantities--;
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    }
  },
});

export const { addToCartOk, removeFromCart, incementQuantity, decrementQuantity, cleanCart } = CartSlice.actions;

export const addToCart = (item) => async (dispatch) => {
  try {
    dispatch(addToCartOk(item));
  } catch (error) {
    console.log(error);
  }
};
export const selectCartItemsCount = createSelector(
  (state) => state.cart.cart,
  (cart) => cart.reduce((total, item) => total + item.quantities, 0)
);

export default CartSlice.reducer