let express = require("express");
let app = express();
let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "checkchecker"
};
let isset = (...variables) => variables.every(variable => typeof variable !== "undefined");
let issetAny = (...variables) => variables.some(variable => typeof variable !== "undefined");
let operations = {
    get: {
        action: (resolve, onMYSQLError, onArgsError, query) => {
            let {table} = query;
            if (!isset(table)) {
                onArgsError();
            } else {
                connection.query("SELECT * FROM " + table, (err, result) => {
                    if (err) {
                        onMYSQLError(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        }
    },
    createUser: {
        action: (resolve, onMYSQLError, onArgsError, query) => {
            let {username, password, avatar} = query;
            if (isset(username, password)) {
                if (isset(avatar)) {
                    connection.query(`INSERT INTO users (username, password, avatar) VALUES ('${username}', '${password}', '${avatar}')`, (err, result) => {
                        if (err) {
                            onMYSQLError(err);
                        } else resolve(result);
                    })
                } else {
                    connection.query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`, (err, result) => {
                        if (err) {
                            onMYSQLError(err);
                        } else resolve(result);
                    })
                }
            } else onArgsError()
        }
    },
    changeUser: {
        action: (resolve, onMYSQLError, onArgsError, query) => {
            let {id, username, password, avatar} = query;
            if (isset(id)) {
                if (isset(username)) {
                    console.log(`UPDATE users SET username = '${username}' WHERE id = ${id}`);
                    connection.query(`UPDATE users SET username = '${username}' WHERE user_id = ${id}`, (err, result) => {
                        if (err) {
                            onMYSQLError(err);
                        } else resolve(result);
                    })
                }
                if (isset(password)) {
                    connection.query(`UPDATE users SET password = '${password}' WHERE user_id = ${id}`, (err, result) => {
                        if (err) {
                            onMYSQLError(err);
                        } else resolve(result);
                    })
                }
                if (isset(avatar)) {
                    connection.query(`UPDATE users SET avatar = '${avatar}' WHERE user_id = ${id}`, (err, result) => {
                        if (err) {
                            onMYSQLError(err);
                        } else resolve(result);
                    })
                }
                if (!issetAny(username, password, avatar)) onArgsError();
            } else onArgsError();
        }
    }
};

let connection = require("mysql").createConnection(config);

app.get('/', function (req, res) {
    let {operation} = req.query;
    let [resolve, onMYSQLError, onArgsError] = [result => {
        res.send(result);
    }, () => res.send("[]"), () => res.send("Not enough arguments")];
    if (operations[operation]) {
        let operationObject = operations[operation];
        operationObject.action(resolve, onMYSQLError, onArgsError, req.query);
    }
});

app.listen(8080);