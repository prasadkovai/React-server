const express = require('express');
const cors = require('cors');
const mssql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const selectTable = 'select TABLE_NAME from INFORMATION_SCHEMA.TABLES'
 const TbleNameQuery = 'SELECT TableName = t.Name, ColumnName = c.Name,TypeName = ty.Name FROM sys.columns c INNER JOIN sys.tables t ON t.object_id = c.object_id INNER JOIN sys.schemas sch ON sch.schema_id = t.schema_id INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id '
//const selectQuery="SELECT tp.name 'TableName',cp.name 'Column',tr.name 'Refrenced_From_Table',cr.name 'Refrenced_From_Column',fk.name 'FKName'into #REL FROM sys.foreign_keys fk INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id     AND fkc.parent_object_id = cp.object_id INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id     AND fkc.referenced_object_id = cr.object_id ORDER BY tp.name, cp.column_id select * from #REL union select a.name 'TableName',b.name 'Column','' as 'Refrenced_From_Table','' as 'Refrenced_From_Column','' as 'FKName' from sys.tables a ,sys.columns b where a.object_id = b.object_id and a.name in('Orders','Persons','sales','salesinfo')"
//const refSelectQuery="SELECT tp.name 'TableName',cp.name 'ColumnName',tr.name 'Refrenced_From_Table',cr.name'Refrenced_From_Column',fk.name 'FKName' into #REL FROM sys.foreign_keys fk INNER JOIN sys.tables tp    ON fk.parent_object_id = tp.object_id INNER JOIN sys.tables tr    ON fk.referenced_object_id = tr.object_id INNER JOIN sys.foreign_key_columns fkc    ON fkc.constraint_object_id = fk.object_id INNER JOIN sys.columns cp    ON fkc.parent_column_id = cp.column_id        AND fkc.parent_object_id = cp.object_id INNER JOIN sys.columns cr    ON fkc.referenced_column_id = cr.column_id        AND fkc.referenced_object_id = cr.object_id        ORDER BY tp.name,    cp.column_id		select a.name 'TableName',b.name 'ColumnName',convert(varchar(100),'') as 'Refrenced_From_Table',		convert(varchar(100),'') as 'Refrenced_From_Column',		convert(varchar(100),'') as 'FKName' 		into #UPD		from sys.tables a ,sys.columns b where a.object_id = b.object_id update a SET Refrenced_From_Table = b.Refrenced_From_Table ,Refrenced_From_Column = b.Refrenced_From_Column ,FKName = b.FKName	from #UPD a,#REL b	where a.TableName = b.TableName and a.ColumnName = b.ColumnName	select * from #UPD"
const refSelectQuery="SELECT tp.name 'TableName',cp.name 'ColumnName',tr.name 'Refrenced_From_Table',cr.name'Refrenced_From_Column',fk.name 'FKName',ty.Name 'TypeName' into #REL FROM sys.foreign_keys fk INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id INNER JOIN sys.types ty ON cp.user_type_id = ty.user_type_id ORDER BY tp.name,cp.column_id select a.name 'TableName',b.name 'ColumnName',convert(varchar(100),'') as 'Refrenced_From_Table',convert(varchar(100),'') as 'Refrenced_From_Column',convert(varchar(100),'') as 'FKName' , ty.Name 'TypeName' into #UPD from sys.tables a ,sys.columns b, sys.types ty where a.object_id = b.object_id and  b.user_type_id = ty.user_type_id update a SET Refrenced_From_Table = b.Refrenced_From_Table ,Refrenced_From_Column = b.Refrenced_From_Column ,FKName = b.FKName from #UPD a,#REL b	where a.TableName = b.TableName and a.ColumnName = b.ColumnName	select * from #UPD";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send('hai')
})

app.post('/getuser', (req, res) => {

    // console.log('hi');
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
        const json = []
        if (err) {
            console.log(err);
            res.send('Invalid')
        }
        else {
            console.log('success');
            // res.send('success');
            connection.query(refSelectQuery, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send('Invalid');
                }
                else {
                    console.log(result.recordset);
                    var data = result.recordset;
                    // res.status(200).send((data));
                    json.push(data)
                    connection.query(selectTable, (err, result) => {

                        if (err) {
                            console.log('nope2');
                        }
                        else {
                            // console.log(result.recordset);  
                            var datatwo = result.recordset
                            json.push(datatwo);
                            console.log(json);
                            res.status(200).send((json))
                        }
                    });
                }
            });
        
        }
    });

});
 
app.post('/gettblname', (req, res) => {

    // console.log('hi');
    const userData = {
        server: req.body.server,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database
    }
    
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
        else {
            console.log('success');
            // res.send('success');
            connection.query(TbleNameQuery, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send('Invalid');
                }
                else {
                    console.log(result.recordset);
                    var data = result.recordset;
                    res.status(200).send((data));

                }
            });
        
        }
    });

});


app.post('/getData', (req, res) => {

    console.log('hi');
    const userData = {
        server: req.body.server,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database,
        table: req.body.tablename
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
            console.log('error');
        }
        else {
            console.log('success');
            const selectData = 'select * from '+ userData.table
            console.log(selectData)
            connection.query(selectData, (err, result) => {
        
                if (err) {
                    console.log(err);
                    res.send('invalid')
                }
                else {
                    console.log(result.recordset);
        
                    var data = result.recordset;
              
                    res.status(200).send((data))
                }
            });
        }
    })
   
}

);

app.listen(4000, () => {
    console.log('server running on port 4000')
});