import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check for success message in localStorage when component mounts
  useEffect(() => {
    const message = localStorage.getItem('signupSuccessMessage');
    if (message) {
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      // Remove the message from localStorage after retrieving it
      localStorage.removeItem('signupSuccessMessage');
    }
  }, []);

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Email must contain "@" symbol';
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (name === 'email') {
      setEmailError('');
    }
    if (name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both email and password
    const emailValidationError = validateEmail(formData.email);
    const passwordValidationError = validatePassword(formData.password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    try {
      // Make API call to login
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
        
        // Call the onLogin prop with the email
        onLogin(user.email);
        
        // Navigate to home page
        navigate('/', { state: { loginSuccess: true }});
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { field, message } = error.response.data;
        if (field === 'email') {
          setEmailError(message);
        } else if (field === 'password') {
          setPasswordError(message);
        }
      } else {
        console.error('Login error:', error);
        setEmailError('Error during login. Please try again.');
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
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success"
          sx={{ width: '100%' }}
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
          maxWidth: '500px',
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
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ 
              marginBottom: '1rem',
              fontWeight: 600,
              fontSize: '1.5rem',
              color: '#000000',
              letterSpacing: '0.5px'
            }}
          >
            Event Login Form
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                component="label"
                sx={{
                  display: 'block',
                  mb: 0.5,
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!emailError}
                helperText={emailError}
                onBlur={() => {
                  const error = validateEmail(formData.email);
                  setEmailError(error);
                }}
                placeholder="Enter your email"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '& fieldset': {
                      borderRadius: '8px'
                    }
                  }
                }}
                inputProps={{
                  'aria-label': 'Email address',
                  autoComplete: 'email'
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                sx={{
                  display: 'block',
                  mb: 0.5,
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                error={!!passwordError}
                helperText={passwordError}
                onBlur={() => {
                  const error = validatePassword(formData.password);
                  setPasswordError(error);
                }}
                placeholder="Enter your password"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '& fieldset': {
                      borderRadius: '8px'
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  'aria-label': 'Password',
                  autoComplete: 'current-password'
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 1,
                mb: 1.5,
                py: 1.25,
                bgcolor: '#000000',
                '&:hover': {
                  bgcolor: '#333333',
                },
                transition: 'background-color 0.3s ease',
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
                mt: 2, 
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
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                Sign up
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 