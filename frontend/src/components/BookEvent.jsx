import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const images = [
  '/images/Bookevent1 (2).jpg',
  '/images/Bookevent2 (2).jpg',
  '/images/Bookevent3.jpg'
];

const BookEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const isEditing = location.state?.isEditing;
  const existingBooking = location.state?.bookingDetails;
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-play effect for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: existingBooking?.name || '',
    email: existingBooking?.email || '',
    phone: existingBooking?.phone || '',
    numberOfTickets: existingBooking?.numberOfTickets || 1,
    specialRequirements: existingBooking?.specialRequirements || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create booking details object
    const bookingDetails = {
      ...formData,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      ticketPrice: event.ticketPrice,
      totalAmount: event.ticketPrice * formData.numberOfTickets,
      bookingDate: new Date().toISOString()
    };

    // Get existing bookings
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    if (isEditing) {
      // Update existing booking
      const updatedBookings = existingBookings.map(booking => 
        booking.bookingDate === existingBooking.bookingDate ? bookingDetails : booking
      );
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      alert('Booking updated successfully!');
    } else {
      // Add new booking
      existingBookings.push(bookingDetails);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      alert('Booking submitted successfully!');
    }

    navigate('/profile');
  };

  if (!event) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5">No event details found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go Back Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      gap: 4,
      pl: 4
    }}>
      {/* Carousel Section */}
      <Box sx={{ 
        flex: '0 0 55%',
        height: '80vh',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        ml: 0,
        minWidth: '600px'
      }}>
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
              src={image}
              alt={`Book Event ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '8px'
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Form Section */}
      <Container maxWidth="sm" sx={{ flex: '0 0 auto', ml: 8 }}>
        <Paper 
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: '#f3e5f5',
            maxWidth: '900px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#312177', mb: 2 }}>
            {isEditing ? 'Update Booking' : 'Book Event'}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'rgba(55, 2, 91, 0.85)', mb: 2 }}>
            {event.title}
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of Tickets"
                  name="numberOfTickets"
                  type="number"
                  value={formData.numberOfTickets}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{ inputProps: { min: 1, max: event.capacity } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Requirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ bgcolor: 'red', color: 'white', px: 4, '&:hover': { bgcolor: '#d32f2f' } }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: '#312177', color: 'white', px: 4, '&:hover': { bgcolor: '#333333' } }}
                  >
                    {isEditing ? 'Update Booking' : 'Confirm Booking'}
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

export default BookEvent; 