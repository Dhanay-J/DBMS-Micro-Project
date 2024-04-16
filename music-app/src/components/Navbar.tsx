import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function MusicNavbar() {
  return (
        <>
          <Navbar bg="dark" data-bs-theme="dark" fixed="top">
            <Container>
              {/* <Navbar.Brand href="/">Navbar</Navbar.Brand> */}
              <Nav className="me-auto" >
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/songs">Songs</Nav.Link>
                <Nav.Link href="/playlists">Playlists</Nav.Link>
                <Nav.Link href="/artists">Artist</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          </>
  )
}

export default MusicNavbar;