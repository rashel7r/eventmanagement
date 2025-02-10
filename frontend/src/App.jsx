import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateEvent from './components/CreateEvent';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import EventDetails from './components/EventDetails';
import BookEvent from './components/BookEvent';
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

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn, isAdmin }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (isAdmin && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (email, role) => {
    console.log('handleLogin called with role:', role);
    setIsLoggedIn(true);
    setUserEmail(email);
    setIsAdmin(role === 'admin');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setIsAdmin(false);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
  };

  // Check for stored user data on app load
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
      setIsAdmin(storedRole === 'admin');
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
          <Navbar isLoggedIn={isLoggedIn} userEmail={userEmail} isAdmin={isAdmin} />
          <Box 
            sx={{ 
              pt: '64px',
              minHeight: 'calc(100vh - 64px)',
              bgcolor: '#e6e0f0',
              flex: 1,
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
              <Route path="/login" element={
                !isLoggedIn ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/signup" element={
                !isLoggedIn ? (
                  <SignUp />
                ) : (
                  <Navigate to="/" replace />
                )
              } />

              {/* Protected Routes */}
              <Route path="/create" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile onSignOut={handleSignOut} isAdmin={isAdmin} />
                </ProtectedRoute>
              } />
              <Route path="/event-details" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <EventDetails />
                </ProtectedRoute>
              } />
              <Route path="/book-event" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <BookEvent />
                </ProtectedRoute>
              } />

              {/* Redirect unmatched routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
