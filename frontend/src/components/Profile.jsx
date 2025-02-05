import { Box, Container, Typography, Paper, Avatar, Button, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import { useState, useEffect } from 'react';

const Profile = ({ onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email || localStorage.getItem('userEmail') || 'No email provided';
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '/images/user profile.jpg');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    setFirstName(localStorage.getItem('userFirstName') || '');
    setLastName(localStorage.getItem('userLastName') || '');
  }, []);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    navigate('/login');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl); // Update state immediately
        localStorage.setItem('profileImage', imageUrl);
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        alert('Error uploading image');
        console.error('Image upload error:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: 'rgba(230, 220, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Avatar 
              src={profileImage}
              sx={{ 
                width: 90, 
                height: 90, 
                bgcolor: '#4a148c',
                fontSize: '2.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              {!profileImage && (firstName && lastName ? `${firstName[0]}${lastName[0]}` : <FaceIcon sx={{ fontSize: 50 }} />)}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-image-upload">
              <Button
                component="span"
                onClick={() => document.getElementById('profile-image-upload').click()}
                sx={{
                  position: 'absolute',
                  bottom: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  marginTop: '15px',
                  paddingTop: '5px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'auto',
                  textTransform: 'none',
                  minWidth: 'unset',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  borderRadius: '12px',
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)'
                  }
                }}
                size="small"
                variant="text"
              >
                Profile Picture
              </Button>
            </label>
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, fontSize: '2rem' }}>
              User Profile
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {firstName && lastName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaceIcon sx={{ color: 'text.secondary' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    {`${firstName} ${lastName}`}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  {userEmail}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sign Out Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            onClick={handleSignOut}
            sx={{
              mt: 1,
              px: 3,
              py: 0.75,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              backgroundColor: '#d32f2f',
              minWidth: '120px',
              height: '36px',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 