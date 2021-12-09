import React, { useEffect, useState } from 'react';
import { Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillXCircleFill, BsFillBagCheckFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCard, removeFromCard } from '../Redux/Actions/addToCard.action';
import store from '../Redux/Store';

const CartItem = ({ show, handleClose, ...props }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [pds, setPds] = useState([]);
  const { cardItem } = useSelector((state) => state.CardReducer);
  const { products } = useSelector((state) => state.productReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (products) {
      setPds(products);
    }
  }, [products]);
  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const pd = Object.keys(cardItem);
      const sProducts = pd.map((key) => {
        const pt = pds.find((item) => item._id === key);
        if (pt) {
          pt.qnt = cardItem[key];
        }
        return pt;
      });
      setCartProducts(sProducts);
    } else {
      setCartProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardItem, pds, show, store.getState().CardReducer]);

  const handleIncPdQty = (item, qty) => {
    dispatch(addToCard(item._id, qty + 1, 'fromCart'));
  };
  const handleDeIncPdQty = (item, qty) => {
    if (qty - 1 < 1) {
      dispatch(removeFromCard(item._id));
      handlePdRemove(item._id);
    } else {
      dispatch(addToCard(item._id, qty - 1, 'fromCart'));
    }
  };
  const handlePdRemove = (id) => {
    setCartProducts(cartProducts.filter((item) => item._id !== id));
  };
  let total=0
  if(cartProducts?.length > 0){
    total=0
    cartProducts.forEach(item => {
      total += item?.productPrice*item?.qnt
    });
    
  }
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      {...props}
      className="bg-blue-300"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <div className="flex items-center">
            <BsFillBagCheckFill className="text-xl" />
            <h3 className="text-black text-2xl font-semibold ml-1">
              {cartProducts.length} {cartProducts.length > 1 ? 'Items' : 'Item'}
            </h3>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div className="flex-col justify-between">
          <div className=" overflow-y-auto " style={{ height: '78vh' }}>
            {cartProducts.length > 0
              ? cartProducts.map((item) => (
                  <OverlayTrigger
                    key={Math.random()}
                    placement={'top'}
                    overlay={<Tooltip>{item?.productName}</Tooltip>}
                  >
                    <div className="cursor-pointer ">
                      <div className="flex  justify-between items-center p-2 rounded-md mb-3 border hover:shadow-lg">
                        <div>
                          <button
                            onClick={() => {
                              handleIncPdQty(item, item?.qnt);
                            }}
                            className="w-5 h-10 rounded-full bg-blue-600 text-gray-50"
                          >
                            +
                          </button>
                          <input
                            type="text"
                            readOnly
                            defaultValue={item?.qnt}
                            className="w-12 text-center mx-2 rounded-md outline-none ring-0  border-0 focus:ring-0 "
                          />
                          <button
                            onClick={() => handleDeIncPdQty(item, item?.qnt)}
                            className="w-5 h-10 rounded-full bg-blue-600 text-gray-50"
                          >
                            -
                          </button>
                        </div>
                        <div>
                          <img
                            src={item?.productImage[0].url}
                            alt=""
                            width="40"
                            height="40"
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          $ <b>{item?.qnt}</b>×<strong>{item?.productPrice}</strong>{' '}
                        </div>
                        <div>
                          {' '}
                          <button
                            onClick={() => {
                              dispatch(removeFromCard(item._id));
                              handlePdRemove(item._id);
                            }}
                          >
                            <BsFillXCircleFill className="text-xl text-gray-600 hover:text-gray-900" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </OverlayTrigger>
                ))
              : 'No Product'}
          </div>
          {cartProducts.length > 0 && (
            <>
            <div className="text-right">
              <strong>Total =  {total}</strong>
            </div>
            <div className="flex justify-between">
              <Link
                to="/shoppingCard"
                className="px-4 py-1 bg-blue-50 rounded-md text-blue-700"
              >
                See Item
              </Link>
              <Link
                to="/"
                className="px-4 py-1 bg-blue-50 rounded-md text-blue-700"
              >
                CheckOut
              </Link>
            </div>
            
            </>
          )}

        </div>
      </Offcanvas.Body>
     
    </Offcanvas>
  );
};

export default CartItem;
