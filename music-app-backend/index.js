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


// select * from music.albums alb where alb.ArtistID in ( SELECT ArtistID FROM music.artistuser a where a.UserID=7 );

app.post('/albums', async (req, res) => {

  let userid = req.body['UserID'];

  try {
    // songid = -1;
    connection.query(`select AlbumID, Title,ReleaseDate from music.albums alb where alb.ArtistID in ( SELECT ArtistID FROM music.artistuser a where a.UserID=${userid} )`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if(results.length == 0){
          return res.status(404).json({ error: 'No Album found' });
        }

        // Album(s) is/are present
        res.status(200).json(results);
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

});


app.post('/addSong', async (req, res) => {

    let userid = 0;
    userid = req.body['UserID'];
    
    let songid = 0;

    let title = '';
    title = req.body['Title'];
    
    let artistid = 0;
    let albumid = 0;
    
    let albumtitle = '';
    albumtitle = req.body['AlbumTitle'];
    
    let releaseDate = req.body['ReleaseDate'];

    let imageurl = '';
    imageurl = req.body['ImageURL'];

    let dutation = req.body['Duration'];
    let explicit = req.body['Explicit'];

    let url = '';
    url = req.body['URL'];

    let likes = 0;
    let dislikes = 0;

  try {
    // songid , title, artistid, albumid, duration ,explicit, url, likes, dislikes
    // albumid, title, artistid, releaseDate, imageurl

    // Get the songID
    connection.query(`select max(s.songID)+1 as ID from music.songs s`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        songid = results[0]['ID'];
        console.log('SongID: ', songid, '\n\n\n\n');

        // Get the artistID
        connection.query(`SELECT ArtistID FROM music.artistuser a where a.UserID=${userid}`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Internal Server Error : Artist Not Found ' });
            }
    
            if(results.length == 0){
              return res.status(404).json({ success: false, error: 'No User found' });
            }

            artistid = results[0]['ArtistID'];
            // Get the albumID
            connection.query(`SELECT COUNT(*) as c FROM music.albums AS a WHERE a.ArtistID = ${artistid} AND a.Title = '${title.replace(/'/g, "''")}'`, function (err, results, fields) {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }
        
              if(results.length == 0){
                return res.status(404).json({ success: false, error: 'No Album found' });
              }
        
              if(results[0]['c']==0){
                // Album is not present
                connection.query(`select max(AlbumID)+1 as ID from music.albums`, function (err, results, fields) {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ success: false, error: 'Internal Server Error : Couldn\'t Get New AlbumID' });
                  }
                  albumid = results[0]['ID'];
                  
                  console.log('\n\n\n\nAlbumID: ', imageurl, '\n\n\n\n');
                  // Insert the album
                  connection.query(`INSERT INTO music.albums (AlbumID, Title, ArtistID, ReleaseDate, ImageURL) VALUES (${albumid}, '${albumtitle.replace(/'/g, "''")}', ${artistid}, '${releaseDate}', '${imageurl.replace(/'/g, "''")}' )`, function (err, results, fields) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false,error: 'Internal Server Error : Cannot Create Album' });
                    }
                  });
        
                  // Insert the song      
                  connection.query(`insert into music.songs values (${songid},'${title.replace(/'/g, "''")}', ${artistid}, ${albumid}, ${dutation}, '${explicit}', '${url.replace(/'/g, "''")}', ${likes}, ${dislikes} )`, function (err, results, fields) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, error: 'Internal Server Error' });
                    }
                    // Song Inserted Successfully
                    return res.status(200).json({ success: true });
                    
                  });
                  
                }
                );
              }
              else{
                // Album is present
                  connection.query(`select AlbumID as ID from music.albums where ArtistID=${artistid} AND Title='${albumtitle.replace(/'/g, "''")}'`, function (err, results, fields) {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ error: 'Internal Server Error' });
                  }
                  albumid = results[0]['ID'];
        
                   // Insert the song      
                    connection.query(`insert into music.songs values (${songid},'${title.replace(/'/g, "''")}', ${artistid}, ${albumid}, ${dutation}, '${explicit}', '${url.replace(/'/g, "''")}', ${likes}, ${dislikes} )`, function (err, results, fields) {
                      if (err) {
                          console.error(err);
                          return res.status(500).json({ error: 'Internal Server Error' });
                      }
                    
                      // Song Inserted Successfully
                      return res.status(200).json({ success: true });
                      
                    });
                  });
        
        
                }
        
              
          }); // End of AlbumID Query
    });

    });



    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

});




