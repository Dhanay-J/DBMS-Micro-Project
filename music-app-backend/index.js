const express = require('express');
const oracledb = require('oracledb');
var mysql = require('mysql');

const cors = require("cors");
const port = 3000;





// const config = {
//     user: 'system', // User name
//     password: 'system', // Password for user
//     connectString: '192.168.2.1:1521/xe'
// };

var connection;


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQL@123",
  database : 'music'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected! To MySQL");
})


// async function connect() {
//     try {
//       connection = await oracledb.getConnection(config);
//       console.log('Connected to Oracle Database!');
//     } catch (err) {
//       console.error('Error connecting to Oracle DB:', err);
//     }
// }



let app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// connect();  // Connect to Oracle DB
var result;
app.get('/songs', async (req, res) => {
  var query = req.query['Query'];
  // console.log(query);
  //var result;
  try {
      connection.query(query, function (err, results, fields) {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          // console.log(results);
          res.json(results); // Send result as JSON
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/like', async (req, res) => {
  // var query = req.query['Query'];

  let songid = req.body['songid'];


  // console.log('Received like request: ', songid);
  try {
    // songid = -1;
    connection.query(`select likes from songs where songid=${songid}`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if(results.length == 0){
          return res.status(404).json({ error: 'Song not found' });
        }

        // No error in getting the song
        else{
          let likes = results[0]['likes'];
          likes += 1;
          connection.query(`UPDATE songs SET likes = ${likes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            return res.status(200).json({ likes: likes });

          });
          
        }

        // res.json(results); // Send result as JSON
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});



app.post('/dislike', async (req, res) => {
  // var query = req.query['Query'];

  let songid = req.body['songid'];


  // console.log('Received like request: ', songid);
  try {
    // songid = -1;
    connection.query(`select dislikes from songs where songid=${songid}`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if(results.length == 0){
          return res.status(404).json({ error: 'Song not found' });
        }

        // No error in getting the song
        else{
          let dislikes = results[0]['dislikes'];
          dislikes += 1;
          connection.query(`UPDATE songs SET dislikes = ${dislikes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            return res.status(200).json({ dislikes: dislikes });

          });
          
        }

        // res.json(results); // Send result as JSON
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});