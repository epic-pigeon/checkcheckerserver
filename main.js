let express = require("express");
let app = express();
let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "checkchecker"
};

let connection = require("mysql").createConnection(config);

app.get('/', function (req, res) {
    let {operation} = req.query;
    switch (operation) {
        case "getUsers":
            connection.query('SELECT * FROM users', function(err, result) {
                res.send(result);
            });
    }
});

app.listen(8080);