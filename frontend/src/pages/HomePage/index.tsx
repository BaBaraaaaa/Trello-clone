import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      title: 'Boards',
      description: 'Organize your projects with customizable boards that fit your workflow.',
      color: theme.palette.primary.main,
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Cards & Lists',
      description: 'Break down projects into manageable tasks with our intuitive card system.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates and team management.',
      color: theme.palette.success.main,
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Built with modern technology for the best performance and user experience.',
      color: theme.palette.warning.main,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and reliability.',
      color: theme.palette.error.main,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Analytics',
      description: 'Track progress and productivity with built-in analytics and reporting.',
      color: theme.palette.info.main,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager',
      avatar: 'SJ',
      rating: 5,
      comment: 'This Trello clone has revolutionized how our team manages projects. Highly recommended!',
    },
    {
      name: 'Mike Chen',
      role: 'Software Developer',
      avatar: 'MC',
      rating: 5,
      comment: 'Clean interface, fast performance, and all the features we need. Perfect for agile development.',
    },
    {
      name: 'Emily Davis',
      role: 'Marketing Lead',
      avatar: 'ED',
      rating: 5,
      comment: 'The collaboration features are amazing. Our team productivity has increased by 40%!',
    },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.3)} 0%, transparent 50%)`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
          }}>
            <Box sx={{ flex: 1 }}>
              <Chip
                label="✨ New & Improved"
                color="primary"
                variant="outlined"
                sx={{ mb: 3, fontWeight: 600 }}
              />
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Organize anything, together
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}
              >
                Trello's boards, lists, and cards enable you to organize and prioritize your 
                projects in a fun, flexible, and rewarding way.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Demo Boards */}
                <Box sx={{ transform: 'rotate(-5deg)' }}>
                  <Card
                    sx={{
                      width: 280,
                      height: 200,
                      borderRadius: 3,
                      boxShadow: theme.shadows[8],
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                  >
                    <CardContent sx={{ color: 'white', p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" mb={2}>
                        🚀 Project Launch
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {['Planning', 'In Progress', 'Review'].map((status) => (
                          <Box
                            key={status}
                            sx={{
                              background: alpha('#fff', 0.2),
                              p: 1,
                              borderRadius: 1,
                              fontSize: '0.8rem',
                            }}
                          >
                            {status}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ transform: 'rotate(5deg)', ml: -2, mt: 4 }}>
                  <Card
                    sx={{
                      width: 280,
                      height: 200,
                      borderRadius: 3,
                      boxShadow: theme.shadows[8],
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    }}
                  >
                    <CardContent sx={{ color: 'white', p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" mb={2}>
                        💼 Marketing Campaign
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {['Ideas', 'Design', 'Launch'].map((status) => (
                          <Box
                            key={status}
                            sx={{
                              background: alpha('#fff', 0.2),
                              p: 1,
                              borderRadius: 1,
                              fontSize: '0.8rem',
                            }}
                          >
                            {status}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Everything you need to stay organized
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Powerful features that help teams of all sizes collaborate effectively
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                border: `1px solid ${alpha(feature.color, 0.1)}`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[12],
                  borderColor: alpha(feature.color, 0.3),
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: alpha(feature.color, 0.1),
                    color: feature.color,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.6}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ background: alpha(theme.palette.background.paper, 0.5), py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Loved by teams worldwide
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See what our users have to say about their experience
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#ffd700', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" mb={3} fontStyle="italic">
                    "{testimonial.comment}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Ready to boost your productivity?
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Join thousands of teams already using our Trello clone to stay organized
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Today'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage;