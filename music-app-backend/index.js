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
  let userid = req.body['userid'];

  try {
    let likes = 0;
    connection.query(`select count(*) c from likes where songid=${songid}`, function (err, likeCount, fields) {
      // Handle errors (consider prepared statements)
      if (err) {
        console.error(err.sqlMessage);
        return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
      
      }
      likes = likeCount[0]?likeCount[0]['c']:0;

      connection.query(`select count(*) c from dislikes where userid=${userid} and songid=${songid}`, function (err, dislikes, fields) {
      // Handle errors (consider prepared statements)
      if (err || !dislikes[0]) {
        console.error(err.sqlMessage);
        return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
      
      }
      if(dislikes[0]['c'] > 0){
            connection.query(`delete from dislikes where userid=${userid} and songid=${songid}`, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
              }
        });
      }


      connection.query(`select count(*) c from dislikes where songid=${songid}`, function (err, resultsDislikes, fields) {
        if(err || !resultsDislikes[0]){
          console.error(err.sqlMessage);
          return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
        }
        let dislikes_=0;
        dislikes_ = resultsDislikes[0]['c'];
        connection.query(`select count(*) c from likes where userid=${userid} and songid=${songid}`, function (err, resultsLikes, fields) {
          // Handle errors (consider prepared statements)
          if (err) {
            console.error(err.sqlMessage);
            return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
          }
          if(resultsLikes[0]['c'] > 0){
            connection.query(`delete from likes where userid=${userid} and songid=${songid}`, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
              }
              likes = likes - 1;
              connection.query(`UPDATE songs SET likes = ${likes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
                if (err) {
                  console.error(err);
                  // Consider returning an error or logging for consistency
                }
                return res.status(200).json({ likes: likes,dislikes:dislikes_, error: 'Cannot Like a Liked Song' });
              });
            }
          );
  
          }else{
            connection.query(`insert into likes (userid, songid ) values (${userid},${songid}) `, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
              }
              likes = likes + 1;
              connection.query(`UPDATE songs SET likes = ${likes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
                if (err) {
                  console.error(err);
                  // Consider returning an error or logging for consistency
                }
                return res.status(200).json({ likes: likes,dislikes:dislikes_ });
              });
            });
          }
        });
      });

    });
  });

  } catch (err) {
    console.log(err);
    res.status(504).json({ error: 'Internal Server Error :: ' + err });
  }
});




app.post('/dislike', async (req, res) => {
  // var query = req.query['Query'];

  let songid = req.body['songid'];
  let userid = req.body['userid'];

  try {
    let dislikes = 0;
    connection.query(`select count(*) c from dislikes where songid=${songid}`, function (err, dislikeCount, fields) {
      // Handle errors (consider prepared statements)
      if (err) {
        console.error(err.sqlMessage);
        return res.status(502).json({ likes: likes, error: 'Internal Server Error :: ' + err });
      
      }

      dislikes = dislikeCount[0] ? dislikeCount[0]['c'] : 0;

      connection.query(`select count(*) c from likes where userid=${userid} and songid=${songid}`, function (err, likes, fields) {
      // Handle errors (consider prepared statements)
      if (err || !likes[0]) {
        console.error(err.sqlMessage);
        return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
      
      }
      
      if(likes[0]['c'] > 0){
            connection.query(`delete from likes where userid=${userid} and songid=${songid}`, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
              }

        });
      }

      connection.query(`select count(*) c from likes where songid=${songid}`, function (err, resultsLikes, fields) {
        if (err || !resultsLikes[0]) {
          console.error(err.sqlMessage);
          return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
        }
        let likes_=0;
        likes_ = resultsLikes[0]['c'];
        connection.query(`select count(*) c from dislikes where userid=${userid} and songid=${songid}`, function (err, resultsDislikes, fields) {
          // Handle errors (consider prepared statements)
          if (err) {
            console.error(err.sqlMessage);
            return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
          }

          if(resultsDislikes[0]['c'] > 0){
            connection.query(`delete from dislikes where userid=${userid} and songid=${songid}`, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
              }
              dislikes = dislikes - 1;
              connection.query(`UPDATE songs SET dislikes = ${dislikes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
                if (err) {
                  console.error(err);
                  // Consider returning an error or logging for consistency
                }
                return res.status(200).json({ dislikes: dislikes,likes:likes_, error: 'Cannot Like a Liked Song' });
              });
            }
          );
  
          }else{

            connection.query(`insert into dislikes (userid, songid ) values (${userid},${songid}) `, function (err, results, fields) {
              // Handle errors (consider prepared statements)
              if (err) {
                console.error(err.sqlMessage);
                return res.status(502).json({ dislikes: dislikes, error: 'Internal Server Error :: ' + err });
              }
              dislikes = dislikes + 1;
              connection.query(`UPDATE songs SET dislikes = ${dislikes} WHERE (SongID = '${songid}')`, function (err, results, fields) {
                if (err) {
                  console.error(err);
                  // Consider returning an error or logging for consistency
                }
                return res.status(200).json({ dislikes: dislikes ,likes:likes_});
              });
            });
          }
        });
      });

    });
  });

  } catch (err) {
    console.log(err);
    res.status(504).json({ error: 'Internal Server Error :: ' + err });
  }

});

app.post('/signup', async (req, res) => {

  let email = '';
  email = req.body['email'];
  
  let password = '' ;
  password = req.body['password'];

  let username = '';
  username = req.body['username'];

  let isArtist = false;
  isArtist = req.body['artist'];

  let isPremium = false;
  isPremium = req.body['premium'];

  try {
    // songid = -1;
    connection.query(`SELECT max(userid)+1 id FROM music.users;`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        let userid = results[0]['id'];
        // console.log("Pass+++ ", results[0]['Password'] , password)

        
        connection.query(`insert into users (userid, username, email, password, subscriptiontier, usertype) values (${userid}, '${username}', '${email}', '${password}', '${isPremium}', '${isArtist}')`, function (err, results, fields) {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Internal Server Error' });
          }

          // User is created
          res.status(200).json(
            {
              success: true,
            }
          );
        });

    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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

//playlists

app.post('/numberofplaylists', async (req, res) => {

  let userid = req.body['UserID'];

  try {
    // songid = -1;
    connection.query(`select count(*) c from playlist where userid=${userid}`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        
        // Password is correct
        res.status(200).json(
          {
            success: true,
            count: results[0]['c']
          }
        );
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

});


app.post('/removePlaylist', async (req, res) => {

  let userid = 0;
  userid = req.body['UserID'];
  
  let songid = 0;
  songid = req.body['SongID'];

  let playlistid = 0;
  playlistid = req.body['PlaylistID'];

  let isPlaylist = true;
  isPlaylist = req.body['isPlaylist'];


  console.log('PlaylistID: ', playlistid, userid, '\n\n\n\n');
  try {
      // songid , name, playlistid, userid


      // Check if Playlist exists
      connection.query(`select count(*) c from playlist where PlaylistID=${playlistid} and userid=${userid}`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error : Songs Removal Failed' });
        }
        if(results[0]['c'] == 0){
          return res.status(200).json({ success: true, error: 'No Playlist found for user' });
        }
      });


      // Create and Add Song to Playlist
      if(isPlaylist){

        connection.query(`select song_id from playsong where playlists_id=${playlistid};`, function (err, results, fields) {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Internal Server Error ' + err });
          }
          
          // Remove all songs from playsong
          for(let i=0; i<results.length; i++){
              connection.query(`delete from playsong where playlists_id=${playlistid} and song_id=${results[i]['song_id']}`, function (err, results, fields) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, error: 'Internal Server Error : Songs Removal Failed' });
                }
                            
              });
          }

          // Remove Playlist
          connection.query(`delete from playlist where PlaylistID=${playlistid}`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Internal Server Error : Songs Removal Failed' });
            }
          
            
          });
          
              
      });
      }
      // Remove Song from Playlist
      else{
          connection.query(`delete from playsong where playlists_id=${playlistid} and song_id=${songid}`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Internal Server Error : Song Removal Failed' });
            }

            // Check if Playlist is empty
            connection.query(`select count(*) c from playsong where playlists_id=${playlistid}`, function (err, results, fields) {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, error: 'Internal Server Error : Song Removal Failed' });
              }
              // Remove Playlist if empty
              if(results[0]['c'] == 0){
                connection.query(`delete from playlist where PlaylistID=${playlistid}`, function (err, results, fields) {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ success: false, error: 'Internal Server Error : Songs Removal Failed' });
                  }
                  // return res.status(200).json({ success: true});        
                });
              }
            // Successfully removed song from playlist
            
            });
          
            
          });
        }

        // Successfully removed song from playlist
        return res.status(200).json({ success: true});        

  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

});



app.post('/addPlaylist', async (req, res) => {

  let userid = 0;
  userid = req.body['UserID'];
  
  let songid = 0;
  songid = req.body['SongID'];

  let playlistid = 0;
  playlistid = req.body['PlaylistID'];

  let description = '';
  description = req.body['Description'];

  let name = '';
  name = req.body['PlaylistName'];


  console.log('PlaylistID: ', playlistid, name, userid, '\n\n\n\n');
  try {
      // songid , name, playlistid, userid

      // Create and Add Song to Playlist
      if(playlistid == 0){

        connection.query(`SELECT (max(playlistid))+1 id FROM music.playlist`, function (err, results, fields) {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Internal Server Error ' + err });
          }
          
          playlistid = results[0]['id'];

          //Playlist creation
          connection.query(`insert into playlist values (${playlistid}, ${userid} , '${name}', '${description}')`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Internal Server Error : Playlist Creation Failed' +err});
            }
            
            // Add Song to Playlist
            console.log('PlaylistID: ', playlistid, name, userid, '\n\n\n\n');
            connection.query(`insert into playsong (song_id, playlists_id) values (${songid}, ${playlistid})`, function (err, results, fields) {
              if (err) {
                  console.error(err);
                  return res.status(500).json({  success: false, error: 'Internal Server Error : Inserion Into Playlist Failed' });
              }
              
              // Successfully added song to playlist
              return res.status(200).json({ success: true});        
              
          });
            
        });
              
      });
      }
      // Add Song to Playlist
      else{
          connection.query(`insert into playsong (song_id, playlists_id) values (${songid}, ${playlistid})`, function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(230).json({ success: false, error: 'Internal Server Error : Playlist Creation Failed :: ' + err});
            }
          
          // Successfully added song to playlist
          return res.status(200).json({ success: true});        
          
      });

      }

  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

});



app.post('/playlists', async (req, res) => {

  let userid = req.body['UserID'];

  try {
    // songid = -1;
    connection.query(`select playlistid, p.name from playlist p where UserID=${userid}`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        if(results.length == 0){
          return res.status(200).json({success: true,  error: 'No Playlist found' });
        }

        // Album(s) is/are present
        res.status(200).json(results);
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

app.post('/deleteSong', async (req, res) => {

  let userid = 0;
  let songid = 0;
  userid = req.body['UserID'];
  songid = req.body['SongID'];

  try {
    connection.query(`SELECT ArtistID FROM music.artistuser a where a.UserID=${userid}`, function (err, results, fields) {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal Server Error : Artist Not Found ' });
      }

      if(results.length == 0){
        return res.status(404).json({ success: false, error: 'No User found' });
      }

      artistid = results[0]['ArtistID'];

      connection.query(`DELETE FROM music.songs WHERE (SongID=${songid} and ArtistID=${artistid} )`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error : Deletion Failed ' });
        }

        if(!results.affectedRows){
          return res.status(404).json({ success: false, error: 'No Song found' });
        }
        res.status(200).json({ success: true});
      });

    });
  } catch (error) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

});

app.post('/deleteAlbum', async (req, res) => {

  let userid = 0;
  let songid = 0;
  userid = req.body['UserID'];
  albumid = req.body['AlbumID'];

  try {
    connection.query(`SELECT ArtistID FROM music.artistuser a where a.UserID=${userid}`, function (err, results, fields) {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal Server Error : Artist Not Found ' });
      }

      if(results.length == 0){
        return res.status(404).json({ success: false, error: 'No User found' });
      }

      artistid = results[0]['ArtistID'];

      connection.query(`DELETE FROM music.albums WHERE (AlbumID=${albumid} and ArtistID=${artistid} )`, function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error : Deletion Failed ' });
        }
        res.status(200).json({ success: true});
      });

    });
  } catch (error) {
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

    let albumid=0;
    albumid = req.body['AlbumID'];
    
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
            connection.query(`SELECT COUNT(*) as c FROM music.albums AS a WHERE a.ArtistID = ${artistid} AND a.Title = '${albumtitle.replace(/'/g, "''")}'`, function (err, results, fields) {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }
        
              if(results.length === 0){
                return res.status(404).json({ success: false, error: 'No Album found' });
              }

              console.log(`SELECT COUNT(*) as c FROM music.albums AS a WHERE a.ArtistID = ${artistid} AND a.Title = '${title.replace(/'/g, "''")}'`)
              
        
              if(results[0]['c']===0){
                // Album is not present
                connection.query(`select max(AlbumID)+1 as ID from music.albums`, function (err, results, fields) {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ success: false, error: 'Internal Server Error : Couldn\'t Get New AlbumID' });
                  }
                  albumid = results[0]['ID'];
                  
                  console.log('\n\n\n\nAlbumID: ', albumid, '\n\n\n\n');
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




