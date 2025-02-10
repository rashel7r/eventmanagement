import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const images = [
  '/images/Event details.jpg',
  '/images/event management.jpg'
];

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        pt: 4,
        pb: 4
      }}
    >
      {/* Title Section */}
      <Typography 
        variant="h2" 
        component="h1" 
        align="center"
        sx={{ 
          fontWeight: 600,
          color: '#312177',
          mb: 2,
          letterSpacing: '0.5px'
        }}
      >
        Event Details
      </Typography>

      {/* Carousel Section */}
      <Box
        sx={{
          width: '100vw',
          height: '60vh',
          position: 'relative',
          mt: 1,
          overflow: 'hidden'
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: '100%',
              opacity: currentImage === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        ))}

        {/* Carousel Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentImage(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: currentImage === index ? 'white' : 'rgba(255,255,255,0.5)',
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

      {/* Event Details Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          height: 'auto',
          backgroundImage: 'url("/images/eventdetails background 2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          py: 8,
          mt: 4,
          mb: -6
        }}
      >
        <Container maxWidth="sm" sx={{ 
          pl: { xs: 2, sm: 4, md: 10 }, 
          pr: { xs: 2, sm: 4 },
          mx: 'auto',
          mt: 8,
          mb: 10,
          position: 'relative',
        }}>
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'rgba(243, 229, 245, 0.95)',
              maxWidth: '650px',
              mx: 'auto',
              border: '2px solid #4D088D',
              boxShadow: '0 8px 24px rgba(77, 8, 141, 0.25)',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Title
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.title || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.description || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Time
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.time || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Venue
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.venue || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Artist
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.artist || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Ticket Price
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ${event?.ticketPrice || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Capacity
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.capacity || 'N/A'} people
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#4D088D' }}>
                  Genre
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event?.genre || 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            {/* Buttons Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 6,
              mt: 2
            }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
                sx={{
                  bgcolor: 'red',
                  color: 'white',
                  px: 4,
                  '&:hover': {
                    bgcolor: '#d32f2f'
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/book-event', { state: { event } })}
                sx={{
                  bgcolor: '#312177',
                  color: 'white',
                  px: 4,
                  '&:hover': {
                    bgcolor: '#333333'
                  }
                }}
              >
                Book Now
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Footer Section */}
        <Box
          component="footer"
          sx={{
            width: '100%',
            bgcolor: 'rgba(49, 33, 119, 0.9)',
            color: 'white',
            py: 3,
            mt: 4,
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body1" sx={{ mb: 1 }}>
              © 2024 Rhythm Planner. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Experience the best musical events with us
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetails; 