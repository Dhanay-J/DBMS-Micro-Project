const express = require('express');
const oracledb = require('oracledb');
const cors = require("cors");
const port = 3000;

const config = {
    user: 'system', // User name
    password: 'system', // Password for user
    connectString: '192.168.2.1:1521/xe'
};

var connection;

async function connect() {
    try {
      connection = await oracledb.getConnection(config);
      console.log('Connected to Oracle Database!');
    } catch (err) {
      console.error('Error connecting to Oracle DB:', err);
    }
}



let app = express();
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connect();  // Connect to Oracle DB

app.get('/songs', async (req, res) => {
    var query = req.query['Query'];
    console.log(query);
    try{
        const result = await connection.execute(query);
        res.json(result.rows); // Send result as JSON
    }
    catch(err){
        console.log(err);
    }

});

