import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchEvents();
  }, [location.search]); // Re-fetch when search query changes

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const searchQuery = new URLSearchParams(location.search).get('search');
      const response = await axios.get('http://localhost:5000/api/events' + (searchQuery ? `?search=${searchQuery}` : ''));
      
      // If there's a search query, filter events on the frontend as well
      let filteredEvents = response.data;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredEvents = response.data.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.artist.toLowerCase().includes(searchLower) ||
          event.venue.toLowerCase().includes(searchLower) ||
          event.genre.toLowerCase().includes(searchLower)
        );
      }
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No events found. Create your first event!
          </Typography>
          <Button
            variant="contained"
            sx={{ 
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: '#333333'
              }
            }}
            onClick={() => navigate('/create')}
          >
            Create Event
          </Button>
        </Box>
      ) : (
        /* Horizontal Events List */
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 3,
            pb: 2,
            '::-webkit-scrollbar': {
              height: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          {events.map((event) => (
            <Card 
              key={event._id}
              sx={{ 
                width: '350px',
                minWidth: '350px',
                height: '480px',
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: '#f3e5f5',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  bgcolor: '#ede7f6',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                {/* Title Section */}
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    color: 'black',
                    mb: 2,
                    height: '64px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textAlign: 'center'
                  }}
                >
                  {event.title}
                </Typography>

                {/* Date and Time Section */}
                <Typography 
                  color="textSecondary" 
                  sx={{ mb: 2 }}
                >
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </Typography>

                <Divider sx={{ my: 2, borderStyle: 'dotted' }} />

                {/* Description Section */}
                <Typography 
                  variant="body2" 
                  component="p" 
                  sx={{ 
                    mb: 2,
                    height: '80px',
                    overflow: 'auto',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '4px',
                    },
                  }}
                >
                  {event.description}
                </Typography>

                <Divider sx={{ my: 2, borderStyle: 'dotted' }} />

                {/* Event Details Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Artist:</strong> {event.artist}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Venue:</strong> {event.venue}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Genre:</strong> {event.genre}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ticket Price:</strong> ${Number(event.ticketPrice).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Capacity:</strong> {event.capacity}
                  </Typography>
                </Box>
              </CardContent>

              <Divider sx={{ borderStyle: 'dotted' }} />

              {/* Action Buttons */}
              <CardActions sx={{ p: 2, pt: 1, justifyContent: 'center', gap: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    minWidth: '80px',
                    '&:hover': {
                      bgcolor: '#333333',
                    }
                  }}
                  onClick={() => navigate(`/edit/${event._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: '#d32f2f',
                    color: 'white',
                    minWidth: '80px',
                    '&:hover': {
                      bgcolor: '#f44336',
                    }
                  }}
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default EventList; 
