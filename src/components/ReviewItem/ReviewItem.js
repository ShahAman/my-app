import React from 'react';

const ReviewItem = (props) => {
 // console.log(props);
 const {name, quantity, key} = props.product;
 const reviewItemStyle = {
  borderBottom: '1px solid lightgray',
  marginBottom:'5px',
  paddingBottom: '5px',
  marginLeft: '100px'
 };
  return (
    <div style={reviewItemStyle}>
      <h3 className="product-name">{name}</h3>
      <p>{quantity}</p>
      <br/>
      <button 
        className="main-button"
        onClick={() => props.removeProduct(key)}
      >Remove Item</button>
    </div>
  );
};

export default ReviewItem;