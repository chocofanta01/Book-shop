const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    let allBooksRes = {}; // 결과값들을 담을 객체
    let { category_id, news, limit, currentPage } = req.query;

    // limit : page 당 도서 수, currentPage : 현재 몇 페이지
    // offset 계산 (문자열인 경우를 대비해 parseInt 권장)
    let offset = parseInt(limit) * (parseInt(currentPage) - 1);

    // SQL_CALC_FOUND_ROWS를 추가하여 전체 행의 개수를 계산할 수 있게 함
    let sql = "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
    let values = [];

    if (category_id && news) {
        sql += ' WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [category_id];
    } else if (category_id) {
        sql += " WHERE category_id = ?";
        values = [category_id];
    } else if (news) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

    // 1. 도서 목록 조회 쿼리 실행
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.length) {
            allBooksRes.books = results;
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        // 2. 전체 행 개수(found_rows) 조회를 위한 두 번째 쿼리 실행
        let sqlCount = "SELECT found_rows()";
        conn.query(sqlCount, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            let pagination = {};
            pagination.currentPage = parseInt(currentPage);
            pagination.totalCount = results[0]["found_rows()"];

            allBooksRes.pagination = pagination;

            return res.status(StatusCodes.OK).json(allBooksRes);
        });
    });
};


const bookDetail = (req, res) => {
    let book_id = req.params.id;
    let { user_id } = req.body;
    let sql = `SELECT *,
                    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                    (SELECT exists (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked 
                FROM books 
                LEFT JOIN category 
                ON books.category_id = category.category_id
                WHERE books.id =?`;
    let values = [user_id, book_id, book_id]

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results[0])
            return res.status(StatusCodes.OK).json(results[0])
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    })
}

module.exports = {
    allBooks,
    bookDetail,
};