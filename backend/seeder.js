import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear all existing documents
    await Booking.deleteMany();
    await Room.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared...');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@hotel.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890',
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '9876543210',
      },
    ]);

    console.log('Seed users created...');

    // 2. Create Hotels
    const hotels = await Hotel.create([
      {
        name: 'Grand Hyatt Regency',
        location: 'New York City, NY',
        description: 'Experience luxury in the heart of Midtown Manhattan. Offering stunning views, a world-class spa, and five-star dining options.',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        ],
        rating: 4.8,
        amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Fine Dining', 'Valet Parking'],
      },
      {
        name: 'Mesa Verde Resort & Spa',
        location: 'Aspen, Colorado',
        description: 'A premium ski-in/ski-out resort featuring rustic elegance, warm stone fireplaces, heated pools, and breathtaking mountain landscapes.',
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
        ],
        rating: 4.6,
        amenities: ['Ski Access', 'Hot Tub', 'Fireplace Room', 'Free WiFi', 'Bar & Lounge', 'Airport Shuttle'],
      },
      {
        name: 'Sandy Shores Beach Resort',
        location: 'Miami, Florida',
        description: 'Soak up the sun at our premium beachfront resort. Features private beach access, poolside cabanas, tiki bars, and local water sports activities.',
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        ],
        rating: 4.5,
        amenities: ['Private Beach', 'Outdoor Pool', 'Beach Cabanas', 'Tiki Bar', 'Water Sports', 'Free WiFi'],
      },
    ]);

    console.log('Seed hotels created...');

    // 3. Create Rooms for Hotels
    const hotel1 = hotels[0]._id;
    const hotel2 = hotels[1]._id;
    const hotel3 = hotels[2]._id;

    await Room.create([
      // Hotel 1 Rooms (Grand Hyatt)
      {
        hotel: hotel1,
        roomNumber: '101',
        type: 'Single',
        pricePerNight: 150,
        capacity: 1,
        description: 'Comfortable single room with a city view. Perfect for solo business travelers.',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Work desk', 'Flat-screen TV', 'Mini bar', 'Air conditioning'],
        isAvailable: true,
      },
      {
        hotel: hotel1,
        roomNumber: '102',
        type: 'Double',
        pricePerNight: 220,
        capacity: 2,
        description: 'Spacious double room with queen-sized bed. Includes work area and high-speed internet.',
        images: ['https://images.unsplash.com/photo-1611891405120-449a04dfd8f5?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Queen bed', 'Balcony', 'Flat-screen TV', 'Coffee maker'],
        isAvailable: true,
      },
      {
        hotel: hotel1,
        roomNumber: '201',
        type: 'Deluxe',
        pricePerNight: 350,
        capacity: 3,
        description: 'Deluxe room with panoramic Manhattan views. Premium bedding and lounge seating.',
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        amenities: ['King bed', 'Skyline view', 'Luxury toiletries', 'Espresso machine', 'Bathtub'],
        isAvailable: true,
      },
      {
        hotel: hotel1,
        roomNumber: '301',
        type: 'Suite',
        pricePerNight: 600,
        capacity: 4,
        description: 'Presidential suite with large living area, dining table, kitchen counter, and luxury bath.',
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
        amenities: ['2 Bedrooms', 'Living room', 'Private jacuzzi', 'Butler service', 'Kitchenette'],
        isAvailable: true,
      },

      // Hotel 2 Rooms (Mesa Verde)
      {
        hotel: hotel2,
        roomNumber: '101',
        type: 'Double',
        pricePerNight: 190,
        capacity: 2,
        description: 'Cozy room with direct ski-slope view and warm wooden paneling.',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Fireplace', 'Heated floors', 'Coffee maker', 'Ski storage'],
        isAvailable: true,
      },
      {
        hotel: hotel2,
        roomNumber: '201',
        type: 'Suite',
        pricePerNight: 450,
        capacity: 4,
        description: 'Mountain-view suite with hot tub, stone fireplace, and rustic furnishings.',
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Balcony', 'Jacuzzi', 'Fireplace', 'Mini-kitchen', 'Smart TV'],
        isAvailable: true,
      },

      // Hotel 3 Rooms (Sandy Shores)
      {
        hotel: hotel3,
        roomNumber: '101',
        type: 'Single',
        pricePerNight: 120,
        capacity: 1,
        description: 'Clean, modern single room with courtyard garden access.',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Patio', 'Mini fridge', 'Air conditioning', 'Flat-screen TV'],
        isAvailable: true,
      },
      {
        hotel: hotel3,
        roomNumber: '202',
        type: 'Deluxe',
        pricePerNight: 280,
        capacity: 2,
        description: 'Oceanfront deluxe room. Wake up to the sound of ocean waves and enjoy gorgeous sunsets.',
        images: ['https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80'],
        amenities: ['Private balcony', 'Ocean view', 'Hammock', 'Mini-bar', 'Rain shower'],
        isAvailable: true,
      },
    ]);

    console.log('Seed rooms created...');
    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Room.deleteMany();
    await Hotel.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
