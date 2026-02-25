const express = require('express');
const router = express.Router();
router.use(express.json());
const {addToCart, getCartItems, removeCartItem} = require('../controller/CartController');


//장바구니 담기
router.post('/', addToCart);
//장바구니 조회
router.get('/', getCartItems);
//장바구니 도서 삭제
router.delete('/:id', removeCartItem);



module.exports = router