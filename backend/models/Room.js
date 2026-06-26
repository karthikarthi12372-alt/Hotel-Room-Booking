import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please add a room number'],
    },
    type: {
      type: String,
      required: [true, 'Please add a room type'],
      enum: ['Single', 'Double', 'Suite', 'Deluxe'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a room price per night'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Please add room capacity (number of people)'],
      min: 1,
    },
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
