import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import lolImage from '../../images/giphy.gif'
import { useHistory } from 'react-router';

const Review = () => {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const history = useHistory();

  const handleProceedCheckout = () => {
    // setCart([]);
    // setOrderPlaced(true);
    // processOrder();
    history.push('/shipment');
  };

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
  },[]);

  let thanks;
  if(orderPlaced){
    thanks = <img src={lolImage} alt="" />
  } 
  return (
    <div className="twin-container">
      <div className="product-container">
        {
          cart.map(pd => <ReviewItem 
            key = {pd.key}
            removeProduct = {handleRemoveProduct} 
            product={pd}></ReviewItem>)
        }
        {
          thanks
        }
      </div>
      <div className="cart-container">
        <Cart cart={cart}>
          <button 
          className="main-button"
          onClick = {handleProceedCheckout}
          >Proceed Checkout</button>
        </Cart>
      </div>    
    </div>
  );
};

export default Review;