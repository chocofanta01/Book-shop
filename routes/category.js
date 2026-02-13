const express = require('express');
const router = express.Router();
router.use(express.json());
const { allCategory
} = require('../controller/CategoryController');

router.get('/', allCategory);

module.exports = router