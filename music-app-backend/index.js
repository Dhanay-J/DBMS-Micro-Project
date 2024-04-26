const express = require('express');
var mysql = require('mysql');

const cors = require("cors");
const port = 30000;

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


let app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/songs', async (req, res) => {
  var query = req.query['Query'];
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

app.post('/signin', async (req, res) => {

  let email = req.body['email'];
  let password = req.body['password'];

  try {
    // songid = -1;
    connection.query(`select * from users where email='${email}'`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        if(results.length == 0){
          return res.status(404).json({ success: false , error: 'Incorrect Username or Password' });
        }
        // console.log("Pass+++ ", results[0]['Password'] , password)

        if(! (results[0]['Password'] === password)){
          return res.status(401).json({ success: false, error: 'Incorrect Username or Password' });
        }

        // Password is correct
        res.status(200).json(
          {
            success: true,
            user: results[0]
          }
        );
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

});