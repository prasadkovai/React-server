const express = require('express');
const cors = require('cors');
const mssql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const selectQuery = 'select * from userinfo'

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('hai')
})

app.post('/getuser', (req, res) => {

    console.log('hi');
    const userData = {
        server: req.body.server,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database
    }
    console.log(userData);
    const connection = new mssql.ConnectionPool({
        server: userData.server,
        user: userData.user,
        password: userData.password,
        database: userData.database,
        options: {
            encrypt: true
        },
    });

    connection.connect(err => {
        if (err) {
            console.log(err);
            res.send('Invalid')
        }
        else{
            console.log('success');
            res.send('success');
        }
    });
    // connection.query(selectQuery, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         res.send(err);
    //     }
    //     else {
    //         console.log(result.recordset);
    //         return res.json({
    //             data: result.recordset
    //         })
    //     }
    // });
});

app.listen(4000, () => {
    console.log('server running on port 4000')
});