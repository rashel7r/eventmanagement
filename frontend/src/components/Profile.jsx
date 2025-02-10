import { Box, Container, Typography, Paper, Avatar, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Alert, Snackbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email || localStorage.getItem('userEmail') || 'No email provided';
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '/images/user profile.jpg');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [showSignOutMessage, setShowSignOutMessage] = useState(false);

  useEffect(() => {
    setFirstName(localStorage.getItem('userFirstName') || '');
    setLastName(localStorage.getItem('userLastName') || '');
    const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    setBookings(savedBookings);

    // Fetch created events if user is admin
    if (location.state?.isAdmin || localStorage.getItem('userRole') === 'admin') {
      fetchCreatedEvents();
    }
  }, []);

  const fetchCreatedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setCreatedEvents(response.data);
    } catch (error) {
      console.error('Error fetching created events:', error);
    }
  };

  const handleSignOut = async () => {
    setShowSignOutMessage(true);
    
    // Wait for message to be shown before signing out
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSignOut) {
      onSignOut();
    }
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    navigate('/login');
  };

  const handleEdit = (booking) => {
    // Navigate to update page with booking details
    navigate('/book-event', { 
      state: { 
        event: {
          title: booking.eventTitle,
          date: booking.eventDate,
          venue: booking.eventVenue,
          ticketPrice: booking.ticketPrice
        },
        isEditing: true,
        bookingDetails: booking
      } 
    });
  };

  const handleDelete = (index) => {
    // Add delete logic here
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
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

  const toggleBookings = () => {
    setShowBookings(!showBookings);
  };

  const handleEditEvent = (event) => {
    navigate('/create', { 
      state: { 
        event,
        isEditing: true
      } 
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        if (response.status === 200) {
          // Remove the deleted event from the list
          setCreatedEvents(createdEvents.filter(event => event._id !== eventId));
          alert('Event deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Snackbar
        open={showSignOutMessage}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          mt: 6,
          zIndex: 9999
        }}
      >
        <Alert 
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
          Signing out...
        </Alert>
      </Snackbar>

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
                  backgroundColor: 'rgba(55, 2, 91, 0.85)',
                  borderRadius: '12px',
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, fontSize: '2rem', color: '#312177' }}>
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

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Button
            variant="contained"
            onClick={toggleBookings}
            sx={{
              mt: 1,
              px: 3,
              py: 0.75,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              backgroundColor: '#312177',
              minWidth: '120px',
              height: '36px',
              '&:hover': {
                backgroundColor: '#333333'
              }
            }}
          >
            {showBookings ? 'Hide Details' : 'More Details'}
          </Button>
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

      {/* Created Events Section for Admin */}
      {(location.state?.isAdmin || localStorage.getItem('userRole') === 'admin') && (
        <Collapse in={showBookings} timeout="auto" unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(230, 220, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#4D088D' }}>
              Created Events
            </Typography>

            {createdEvents.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No events created yet
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Event Title</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Venue</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Capacity</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createdEvents.map((event) => (
                      <TableRow
                        key={event._id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>${event.ticketPrice}</TableCell>
                        <TableCell>{event.capacity}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#312177',
                                color: 'white',
                                '&:hover': { bgcolor: '#333333' }
                              }}
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#d32f2f',
                                color: 'white',
                                '&:hover': { bgcolor: '#c62828' }
                              }}
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Collapse>
      )}

      {/* Existing Bookings Section for Regular Users */}
      {(!location.state?.isAdmin && localStorage.getItem('userRole') !== 'admin') && (
        <Collapse in={showBookings} timeout="auto" unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(230, 220, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#4D088D' }}>
              Your Event Bookings
            </Typography>

            {bookings.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                No bookings found
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Event</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Venue</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Tickets</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4D088D' }}>Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        <TableCell>{booking.eventTitle}</TableCell>
                        <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.eventVenue}</TableCell>
                        <TableCell>{booking.numberOfTickets}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#312177',
                                color: 'white',
                                '&:hover': { bgcolor: '#333333' }
                              }}
                              onClick={() => handleEdit(booking)}
                            >
                              Edit
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Collapse>
      )}
    </Container>
  );
};

export default Profile; 