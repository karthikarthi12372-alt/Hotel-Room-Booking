import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// @desc    Get rooms by hotel (with optional filters)
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
export const getRoomsByHotel = async (req, res) => {
  try {
    const { type, isAvailable, capacity, minPrice, maxPrice } = req.query;
    let query = { hotel: req.params.hotelId };

    if (type) {
      query.type = type;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name location');

    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  const { hotelId, roomNumber, type, pricePerNight, capacity, description, images, amenities, isAvailable } = req.body;

  try {
    const hotelExists = await Hotel.findById(hotelId);
    if (!hotelExists) {
      return res.status(400).json({ message: 'Hotel not found for the room' });
    }

    const room = new Room({
      hotel: hotelId,
      roomNumber,
      type,
      pricePerNight,
      capacity,
      description: description || '',
      images: images || [],
      amenities: amenities || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  const { roomNumber, type, pricePerNight, capacity, description, images, amenities, isAvailable } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.pricePerNight = pricePerNight !== undefined ? pricePerNight : room.pricePerNight;
      room.capacity = capacity !== undefined ? capacity : room.capacity;
      room.description = description !== undefined ? description : room.description;
      room.images = images !== undefined ? images : room.images;
      room.amenities = amenities !== undefined ? amenities : room.amenities;
      room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await Room.findByIdAndDelete(req.params.id);
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
