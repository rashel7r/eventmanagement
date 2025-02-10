import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Navbar = ({ isLoggedIn, userEmail, isAdmin }) => {
  const navigate = useNavigate();
  
  console.log('Navbar rendered with props:', { isLoggedIn, userEmail, isAdmin });

  console.log("Navbar rendered without search bar");

  return (
    <AppBar 
      position="fixed"
      sx={{ 
        bgcolor: '#4a148c',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            minHeight: '64px',
            width: '100%',
            gap: 2
          }}
        >
          {/* Left side - Brand */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            pl: { xs: 1, sm: 2 }
          }}>
            <MusicNoteIcon sx={{ 
              mr: 1, 
              fontSize: '2rem',
              color: '#ffffff'
            }} />
            <Typography 
              variant="h5" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: '#ffffff',
                fontWeight: 600,
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}
            >
              Rhythm Planner
            </Typography>
          </Box>

          {/* Right side - Navigation */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2, md: 3 },
            alignItems: 'center',
            ml: 'auto',
            pr: { xs: 1, sm: 2 }
          }}>
            {/* Home Button - Always visible */}
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              startIcon={<HomeIcon />}
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textTransform: 'none',
                color: '#ffffff',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Home
            </Button>

            {/* Create Event Button - Only visible for admin */}
            {isAdmin && console.log('Admin check in Navbar passed')}
            {isAdmin && (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/create"
                startIcon={<AddCircleIcon />}
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Create Event
              </Button>
            )}
            
            {/* Profile/Login Button */}
            {isLoggedIn ? (
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                startIcon={<AccountCircleIcon />}
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {userEmail} {isAdmin && '(Admin)'}
              </Button>
            ) : (
              <Button 
                color="inherit"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
