import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#e6e0f0',
      paper: '#ffffff'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#e6e0f0',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          '& #root': {
            backgroundColor: '#e6e0f0',
            minHeight: '100vh',
          }
        },
      },
    },
  },
});

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('userEmail');
  };

  // Check for stored email on app load
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            bgcolor: '#e6e0f0',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0,
          }}
        >
          <Navbar onSearch={handleSearch} isLoggedIn={isLoggedIn} userEmail={userEmail} />
          <Box 
            sx={{ 
              pt: '64px', 
              minHeight: 'calc(100vh - 64px)',
              bgcolor: '#e6e0f0',
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/edit/:id" element={<EditEvent />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile onSignOut={handleSignOut} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
