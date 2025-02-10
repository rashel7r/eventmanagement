import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Check for signup success message
  useEffect(() => {
    const signupMessage = localStorage.getItem('signupSuccessMessage');
    if (signupMessage) {
      setSuccessMessage(signupMessage);
      setShowSuccessMessage(true);
      localStorage.removeItem('signupSuccessMessage');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password
      });
  
      if (response.status === 200) {
        const { user } = response.data;
  
        // Store user information in localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userFirstName', user.firstName);
        localStorage.setItem('userLastName', user.lastName);
        localStorage.setItem('userRole', user.role);
  
        // Call the onLogin prop
        onLogin(user.email, user.role);
  
        // ✅ Show success message
        setSuccessMessage(`Welcome ${user.firstName}! Login successful${user.role === 'admin' ? ' (Admin)' : ''}`);
        setShowSuccessMessage(true);

        // ✅ Wait before navigating (Allow Snackbar to appear)
        setTimeout(() => {
          navigate('/', { 
            state: { 
              loginSuccess: true,
              redirectAfterLogin: location.state?.redirectAfterLogin,
              event: location.state?.event
            }
          });
        }, 2500);  // Adjust the delay if necessary
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        const { field, message } = error.response.data;
        setErrors(prev => ({
          ...prev,
          [field]: message
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: 'Login failed. Please try again.'
        }));
      }
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url("/images/login image1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        margin: 0,
        padding: 0,
      }}
    >
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={2500}  // Make sure this matches the setTimeout duration
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 6, zIndex: 9999 }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success"
          elevation={6}
          variant="filled"
          sx={{ 
            width: '100%',
            minWidth: '300px',
            fontSize: '1.1rem',
            bgcolor: '#4caf50',
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}
      />

      {/* Form Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          padding: '20px',
          zIndex: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            padding: '2rem',
            backgroundColor: 'rgba(230, 220, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ 
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontSize: '1.75rem',
              color: '#312177',
              letterSpacing: '0.5px'
            }}
          >
            Rhythm Planner Login
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'background-color 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'background-color 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }
                  }
                }}
              />
            </Box>

            {errors.submit && (
              <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                {errors.submit}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                bgcolor: '#312177',
                '&:hover': {
                  bgcolor: '#333333',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '8px'
              }}
            >
              Login
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              Don't have an account?
              <Button
                color="primary"
                onClick={() => navigate('/signup')}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'rgba(55, 2, 91, 0.85)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
