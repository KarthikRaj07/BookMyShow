const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Show = require('../models/Show');

// Load env vars
dotenv.config();

// List of theatres (including Tamil Nadu theatres)
const theatres = [
  'PVR Cinemas',
  'INOX',
  'Cinepolis',
  'Miraj Cinemas',
  'Carnival Cinemas',
  'SPI Cinemas',
  'Fun Cinemas',
  'Big Cinemas',
  // Tamil Nadu Theatres
  'AGS Cinemas - Chennai',
  'Sathyam Cinemas - Chennai',
  'Escape Cinemas - Chennai',
  'PVR Grand Galada - Chennai',
  'INOX Chennai City Centre',
  'Mayajaal Multiplex - Chennai',
  'Rohini Cinemas - Chennai',
  'Luxe Cinemas - Chennai',
  'PVR Skywalk - Chennai',
  'INOX Chennai Citi Centre',
  'The Cinema - Coimbatore',
  'PVR Cinemas - Coimbatore',
  'INOX Prozone Mall - Coimbatore',
  'KG Cinemas - Madurai',
  'INOX Madurai',
  'PVR Cinemas - Trichy',
  'INOX Trichy'
];

// Generate shows for a movie
const generateShows = (movieId, movieTitle) => {
  const shows = [];
  const today = new Date();
  
  // Generate shows for the next 7 days
  for (let day = 0; day < 7; day++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + day);
    
    // Generate 3-4 shows per day at different times
    const showTimes = [
      { hour: 10, minute: 30 }, // Morning
      { hour: 14, minute: 0 },  // Afternoon
      { hour: 18, minute: 30 }, // Evening
      { hour: 22, minute: 0 }   // Night
    ];
    
    // Randomly select 2-3 theatres per day
    const selectedTheatres = theatres
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 2);
    
    selectedTheatres.forEach((theatre, index) => {
      if (index < showTimes.length) {
        const showTime = new Date(showDate);
        showTime.setHours(showTimes[index].hour, showTimes[index].minute, 0, 0);
        
        // Random seat capacity between 50-200
        const totalSeats = Math.floor(Math.random() * 150) + 50;
        // Available seats: 70-100% of total
        const availableSeats = Math.floor(totalSeats * (0.7 + Math.random() * 0.3));
        
        shows.push({
          movieId: movieId,
          theatre: theatre,
          showTime: showTime,
          totalSeats: totalSeats,
          availableSeats: availableSeats
        });
      }
    });
  }
  
  return shows;
};

const seedShows = async () => {
  try {
    // Connect to MongoDB with explicit database name
    let mongoUri = process.env.MONGO_URI;
    
    // Ensure database name is in the connection string
    if (!mongoUri.includes('/bookmyshow')) {
      if (mongoUri.includes('/?')) {
        mongoUri = mongoUri.replace('/?', '/bookmyshow?');
      } else if (mongoUri.includes('?')) {
        mongoUri = mongoUri.replace('?', '/bookmyshow?');
      } else {
        mongoUri = mongoUri.replace(/\/$/, '') + '/bookmyshow';
      }
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    console.log(`Database: ${conn.connection.name}`);

    // Get all movies
    const movies = await Movie.find({});
    
    if (movies.length === 0) {
      console.log('❌ No movies found. Please run seedMovies.js first.');
      process.exit(1);
    }

    console.log(`Found ${movies.length} movies. Creating shows...\n`);

    // Clear existing shows (optional - remove if you want to keep existing)
    // await Show.deleteMany({});
    // console.log('Cleared existing shows\n');

    let totalShowsCreated = 0;

    // Create shows for each movie
    for (const movie of movies) {
      const shows = generateShows(movie._id, movie.title);
      const insertedShows = await Show.insertMany(shows);
      totalShowsCreated += insertedShows.length;
      
      console.log(`✅ Created ${insertedShows.length} shows for "${movie.title}"`);
      console.log(`   Theatres: ${[...new Set(insertedShows.map(s => s.theatre))].join(', ')}`);
    }

    console.log(`\n🎉 Successfully created ${totalShowsCreated} shows across ${movies.length} movies!`);
    console.log(`\nTheatres available: ${theatres.join(', ')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding shows:', error);
    process.exit(1);
  }
};

seedShows();

