import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, removeFromDatabaseCart } from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';

const Review = () => {
  const [cart, setCart] = useState([]);

  const handleRemoveProduct = (productKey) => {
    const newCart = cart.filter(product => product.key !== productKey);
    setCart(newCart);
    removeFromDatabaseCart(productKey);
  };

  useEffect( () => {
    //cart data
    const saveCart = getDatabaseCart();
    const productKeys = Object.keys(saveCart);
    const cartProducts = productKeys.map(key => {
      const product = fakeData.find( pd => pd.key === key );
      product.quantity = saveCart[key];
      return product;
    });
    setCart(cartProducts);
    console.log(cart);
   // console.log(cartProducts);
   // console.log(productKeys); 
  },[]);
  return (
    <div>
      <h1>Cart Items: {cart.length}</h1>
      {
        cart.map(pd => <ReviewItem 
          key = {pd.key}
          removeProduct = {handleRemoveProduct} 
          product={pd}></ReviewItem>)
      }
    </div>
  );
};

export default Review;