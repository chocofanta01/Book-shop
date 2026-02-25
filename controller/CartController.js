const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    const { book_id, quantity, user_id } = req.body;

    let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES(?, ?, ?)";
    let values = [book_id, quantity, user_id];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}

const getCartItems = (req, res) => {
    const { user_id, selected } = req.body;
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id = ? AND cartItems.id IN (?)`;
    let values = [user_id, selected]
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}

const removeCartItem = (req, res) => {
    const { id } = req.params;

    let sql = "DELETE FROM cartItems WHERE id=?;";
    conn.query(sql, id,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}


module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
};

