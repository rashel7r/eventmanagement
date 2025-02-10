import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  Box,
} from '@mui/material';
import axios from 'axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);
  const [errors, setErrors] = useState({});
  const isEditing = location.state?.isEditing || false;
  const eventToEdit = location.state?.event || null;

  const images = [
    '/images/drums.jpg',
    '/images/guitars.jpg'
  ];

  // Carousel auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Initialize form data with event data if editing
  const [formData, setFormData] = useState({
    title: eventToEdit?.title || '',
    description: eventToEdit?.description || '',
    date: eventToEdit?.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '',
    time: eventToEdit?.time || '',
    venue: eventToEdit?.venue || '',
    artist: eventToEdit?.artist || '',
    ticketPrice: eventToEdit?.ticketPrice || '',
    capacity: eventToEdit?.capacity || '',
    genre: eventToEdit?.genre || '',
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (value.length < 3) {
          error = 'Title must be at least 3 characters long';
        } else if (value.length > 100) {
          error = 'Title must not exceed 100 characters';
        }
        break;
      case 'description':
        if (value.length < 10) {
          error = 'Description must be at least 10 characters long';
        } else if (value.length > 1000) {
          error = 'Description must not exceed 1000 characters';
        }
        break;
      case 'date':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          error = 'Date cannot be in the past';
        }
        break;
      case 'time':
        if (!value) {
          error = 'Please select a valid time';
        }
        break;
      case 'venue':
        if (value.length < 3) {
          error = 'Venue must be at least 3 characters long';
        } else if (value.length > 100) {
          error = 'Venue must not exceed 100 characters';
        }
        break;
      case 'artist':
        if (value.length < 2) {
          error = 'Artist name must be at least 2 characters long';
        } else if (value.length > 100) {
          error = 'Artist name must not exceed 100 characters';
        }
        break;
      case 'ticketPrice':
        if (value === '') {
          error = 'Please enter a ticket price';
        } else {
          const price = parseFloat(value);
          if (isNaN(price) || price < 0) {
            error = 'Please enter a valid positive price';
          } else if (price > 10000) {
            error = 'Ticket price cannot exceed $10,000';
          }
        }
        break;
      case 'capacity':
        const cap = parseInt(value);
        if (isNaN(cap) || cap < 1) {
          error = 'Capacity must be at least 1';
        } else if (cap > 100000) {
          error = 'Capacity cannot exceed 100,000';
        }
        break;
      case 'genre':
        if (value.length < 2) {
          error = 'Genre must be at least 2 characters long';
        } else if (value.length > 50) {
          error = 'Genre must not exceed 50 characters';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ticketPrice') {
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === '' || regex.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    try {
      const eventData = {
        ...formData,
        ticketPrice: parseFloat(formData.ticketPrice) || 0,
        capacity: parseInt(formData.capacity)
      };

      let response;
      if (isEditing) {
        // Update existing event
        response = await axios.put(`http://localhost:5000/api/events/${eventToEdit._id}`, eventData);
        if (response.status === 200) {
          alert('Event updated successfully!');
        }
      } else {
        // Create new event
        response = await axios.post('http://localhost:5000/api/events', eventData);
        if (response.status === 201) {
          alert('Event created successfully!');
        }
      }

      // Reset form data
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        artist: '',
        ticketPrice: '',
        capacity: '',
        genre: '',
      });

      // Navigate to homepage
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.response?.data?.message || 'Error saving event. Please try again.');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '90vh',
        gap: 6,  // Increased gap between carousel and form
        px: 4
      }}
    >
      <Box 
        sx={{ 
          flex: '0 0 400px',
          height: '600px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 3,
          display: { xs: 'none', md: 'block' } // Hide on mobile
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            alt={`Event image ${index + 1}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentImage === index ? 1 : 0
            }}
          />
        ))}
      </Box>

      <Container 
        maxWidth="lg"
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          flex: '1',
          maxWidth: '1200px !important',  // Increased from 1000px
          ml: { md: 4 },  // Adjusted margin
          mr: { md: 0 }   // Reduced right margin
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,  // Reduced from p: 4
            width: '100%',
            bgcolor: '#f3e5f5',
            borderRadius: 2,
            boxShadow: 3,
            mx: 'auto'
          }}
        >
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 1.5, fontWeight: 600, color: '#312177' }}  // Reduced from mb: 2
          >
            {isEditing ? 'Update Event' : 'Create New Event'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title || 'Enter event title (3-100 characters)'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.artist}
                  helperText={errors.artist || 'Enter artist name (2-100 characters)'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={1}
                  required
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description || 'Enter event description (10-1000 characters)'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  size="small"
                  error={!!errors.date}
                  helperText={errors.date || 'Select future date'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  size="small"
                  error={!!errors.time}
                  helperText={errors.time || 'Select event time'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.venue}
                  helperText={errors.venue || 'Enter venue name (3-100 characters)'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.genre}
                  helperText={errors.genre || 'Enter music genre (2-50 characters)'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ticket Price"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.ticketPrice}
                  helperText={errors.ticketPrice || 'Enter price (max $10,000)'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  placeholder="0.00"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  size="small"
                  error={!!errors.capacity}
                  helperText={errors.capacity || 'Enter capacity (1-100,000)'}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    sx={{
                      mt: 0.5,  // Reduced from mt: 1
                      py: 0.75,  // Reduced from py: 1
                      px: 8,
                      width: '300px',
                      bgcolor: '#312177',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#333333'
                      }
                    }}
                  >
                    {isEditing ? 'Update Event' : 'Create Event'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateEvent; 
