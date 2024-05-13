import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useContext } from 'react';

function MusicNavbar() {
  const navigate = useNavigate();

  const user = useContext(UserContext);

  const isLoggedin = user['Login'];
  const isAdmin = user['UserType'].trim()==='admin' ? true : false;

  return (
        <>
        <Navbar bg="dark" variant="dark" expand="lg" className="d-flex justify-content-between">
              <Container fluid>
                {/* Brand or logo can be placed here */}
                {/* <Navbar.Brand href="/">Navbar</Navbar.Brand> */}
                <Nav className="me-auto">
                  <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                  <Nav.Link onClick={() => navigate("/songs")}>Songs</Nav.Link>
                  <Nav.Link onClick={() => navigate("/playlists")}>Playlists</Nav.Link>
                  <Nav.Link onClick={() => navigate("/artists")}>Artists</Nav.Link>
                  {!isAdmin?'':
                  <Nav.Link onClick={() => navigate("/admin")}>Admin</Nav.Link>
                  }

                  
                  
                {isLoggedin ? 
                <Nav.Link onClick={() => 
                  {
                    user['Login'] = false;
                    user['UserType'] = 'gust';
                    user['Username'] = 'Gust';
                    user['Useremail'] = '';
                    navigate('/', { replace: true });
                  }} >Logout</Nav.Link>
                : 
                <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link> 
                }
                </Nav>
              </Container>
          </Navbar>
          {
          isLoggedin ?
          <div className="user bg-primary rounded p-2 flex m-2">{user['Username']}</div>
         : <div className="user bg-primary rounded p-2 flex m-2" >Gust</div> 
        }
          </>
  )
}

export default MusicNavbar;