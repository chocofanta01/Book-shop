const express = require('express');
const router = express.Router();
router.use(express.json());
const {addLike, removeLike} = require('../controller/LikeController')

//좋아요 추가
router.post('/:id', addLike);
//좋아요 삭제
router.delete('/:id', removeLike);

module.exports = router