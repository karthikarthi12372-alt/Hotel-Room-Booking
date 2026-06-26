import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// @desc    Get all hotels (with search filter)
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res) => {
  const { name, location, description, images, rating, amenities } = req.body;

  try {
    const hotel = new Hotel({
      name,
      location,
      description,
      images: images || [],
      rating: rating || 0,
      amenities: amenities || [],
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res) => {
  const { name, location, description, images, rating, amenities } = req.body;

  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      hotel.name = name || hotel.name;
      hotel.location = location || hotel.location;
      hotel.description = description || hotel.description;
      hotel.images = images !== undefined ? images : hotel.images;
      hotel.rating = rating !== undefined ? rating : hotel.rating;
      hotel.amenities = amenities !== undefined ? amenities : hotel.amenities;

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a hotel and its rooms
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      // Delete associated rooms first
      await Room.deleteMany({ hotel: hotel._id });
      await Hotel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Hotel and its associated rooms deleted successfully' });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
