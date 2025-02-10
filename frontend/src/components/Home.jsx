import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Snackbar,
  Alert,
  IconButton,
  TextField
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const images = [
  {
    src: '/images/stage1.jpg',
    title: 'Live Performance Stage',
    description: 'Experience the thrill of live music in our state-of-the-art venues.'
  },
  {
    src: '/images/stage3.jpg',
    title: 'Festival Atmosphere',
    description: 'Join thousands of music lovers in celebrating live performances.'
  },
  {
    src: '/images/stage4.jpg',
    title: 'Premium Stage Setup',
    description: 'Witness performances on professionally designed stages with top-tier equipment.'
  }
];

const Home = ({ isLoggedIn, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for event creation success
  useEffect(() => {
    if (location.state?.eventCreated) {
      setShowSuccess(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
    // Check for search query from navigation
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      filterEvents(location.state.searchQuery);
      // Clear the state to avoid persisting the search
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter events based on search query
  const filterEvents = (query) => {
    if (!query) {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`);
      // Update the events list after deletion
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize filtered events with all events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Update filtered events when search query changes
  useEffect(() => {
    filterEvents(searchQuery);
  }, [searchQuery, events]);

  const handleBookEvent = (event) => {
    if (isAdmin) {
      navigate('/profile');
    } else if (!isLoggedIn) {
      navigate('/signup', { 
        state: { 
          redirectAfterSignup: '/event-details',
          event: event
        }
      });
    } else {
      navigate('/event-details', { state: { event } });
    }
  };

  const handleEditEvent = (event) => {
    navigate('/create', { state: { event } });
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          // Remove the deleted event from the events list
          setEvents(events.filter(event => event._id !== eventId));
          setFilteredEvents(filteredEvents.filter(event => event._id !== eventId));
          alert('Event deleted successfully');
        } else {
          throw new Error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Event created successfully!
        </Alert>
      </Snackbar>

      {/* Carousel Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '400px',
          overflow: 'hidden',
          bgcolor: 'black'
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <img
              src={image.src}
              alt={image.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant="h4" sx={{
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                {image.title}
              </Typography>
              <Typography variant="body1" sx={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                textAlign: 'center'
              }}>
                {image.description}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Bootstrap-style Carousel Controls */}
        <IconButton
          onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'transparent',
            borderRadius: 0,
            height: '100%',
            width: '15%',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.1)'
            }
          }}
        >
          <KeyboardArrowLeft sx={{ fontSize: '2rem' }} />
        </IconButton>
        <IconButton
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'transparent',
            borderRadius: 0,
            height: '100%',
            width: '15%',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.1)'
            }
          }}
        >
          <KeyboardArrowRight sx={{ fontSize: '2rem' }} />
        </IconButton>

        {/* Bootstrap-style Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            mb: 2,
            zIndex: 2
          }}
        >
          {images.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentImage(index)}
              sx={{
                minWidth: 30,
                height: 3,
                p: 0,
                bgcolor: currentImage === index ? 'white' : 'rgba(255,255,255,0.5)',
                border: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'white'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Search Section */}
      <Box
        sx={{
          bgcolor: '#312177',
          py: 4,
          width: '100%',
          mt: 6
        }}
      >
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 100,
                  mb: 0.5,
                  fontSize: '1.8rem'
                }}
              >
                Find Your Dream Event
              </Typography>
              <Typography
                sx={{
                  color: '#C369D5',
                  fontSize: '0.9rem'
                }}
              >
                Search For Your Dream Event
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box
                sx={{
                  display: 'flex',
                  boxShadow: '0px 4px 18px 0px rgba(0, 0, 0, 0.1)',
                  bgcolor: '#ffffff',
                  borderRadius: 1
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '45px',
                      bgcolor: '#ffffff',
                      '& fieldset': {
                        border: 'none'
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => filterEvents(searchQuery)}
                  sx={{
                    bgcolor: '#8854BF',
                    height: '45px',
                    px: 4,
                    borderRadius: '0 4px 4px 0',
                    '&:hover': {
                      bgcolor: '#231858'
                    }
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Events Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        {filteredEvents.length === 0 && searchQuery && (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.secondary'
            }}
          >
            No Events Found 
          </Typography>
        )}

        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ 
            mt: 1,
            px: { xs: 0, sm: 1, md: 2 }
          }}
        >
          {(filteredEvents.length > 0 ? filteredEvents : events).map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: 2,
                  maxWidth: 345,
                  mx: 'auto',
                  bgcolor: '#f3e5f5',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="290"
                  image={event.imageUrl || '/images/stage2.jpg'}
                  alt={event.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1.5 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 600,
                      mb: 1.5,
                      color: '#312177',
                      textAlign: 'center'
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {event.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                      Venue: {event.venue}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Price: ${event.ticketPrice}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions 
                  sx={{ 
                    justifyContent: 'center', 
                    pb: 2, 
                    pt: 0.5
                  }}
                >
                  <Button 
                    variant="contained"
                    size="large"
                    sx={{ 
                      bgcolor: '#312177',
                      color: 'white',
                      px: 4,
                      py: 1,
                      '&:hover': {
                        bgcolor: '#333333'
                      }
                    }}
                    onClick={() => handleBookEvent(event)}
                  >
                    {isAdmin ? 'View Event' : isLoggedIn ? 'Book Event' : 'Sign Up to Book'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;