const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');

// Load env vars
dotenv.config();

const movies = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    duration: 152,
    language: 'English'
  },
  {
    title: 'Inception',
    description: 'A skilled thief is given a chance at redemption if he can pull off an impossible task: Inception, the implantation of another person\'s idea into a target\'s subconscious.',
    duration: 148,
    language: 'English'
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    duration: 169,
    language: 'English'
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    duration: 136,
    language: 'English'
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    duration: 154,
    language: 'English'
  },
  {
    title: 'Dangal',
    description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    duration: 161,
    language: 'Hindi'
  },
  {
    title: '3 Idiots',
    description: 'In the tradition of "Educating Rita" and "Dead Poets Society" comes this refreshing comedy about a rebellious prankster with a crafty mind and a heart of gold.',
    duration: 170,
    language: 'Hindi'
  },
  {
    title: 'Baahubali 2: The Conclusion',
    description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
    duration: 167,
    language: 'Telugu'
  },
  {
    title: 'Ponniyin Selvan: Part 1',
    description: 'A historical epic based on Kalki Krishnamurthy\'s novel, following the Chola dynasty and the adventures of Prince Arulmozhi Varman.',
    duration: 167,
    language: 'Tamil'
  },
  {
    title: 'Vikram',
    description: 'A special agent investigates a murder case involving drug dealers, leading to unexpected revelations about his past.',
    duration: 175,
    language: 'Tamil'
  },
  {
    title: 'Jai Bhim',
    description: 'A tribal woman fights for justice when her husband goes missing from police custody. A lawyer takes up the case and fights for justice.',
    duration: 164,
    language: 'Tamil'
  },
  {
    title: 'Master',
    description: 'An alcoholic professor takes up a teaching job at a juvenile reform school, where he clashes with a ruthless gangster.',
    duration: 179,
    language: 'Tamil'
  },
  {
    title: 'Kaithi',
    description: 'A recently released prisoner must help a cop transport seized drugs to save his daughter, while evading a gang of criminals.',
    duration: 145,
    language: 'Tamil'
  },
  {
    title: '96',
    description: 'Two high school sweethearts meet at a reunion after 22 years, rekindling old memories and unspoken feelings.',
    duration: 158,
    language: 'Tamil'
  }
];

const seedMovies = async () => {
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

    // Clear existing movies (optional - remove if you want to keep existing)
    // await Movie.deleteMany({});
    // console.log('Cleared existing movies');

    // Insert movies
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`✅ Successfully added ${insertedMovies.length} movies to the database!`);
    
    insertedMovies.forEach(movie => {
      console.log(`  - ${movie.title} (${movie.duration} min, ${movie.language})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    process.exit(1);
  }
};

seedMovies();

