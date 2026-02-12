const mariadb = require('mysql2');
const connection = mariadb.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'Bookshop',
    dateStrings : true
});
module.exports = connection;