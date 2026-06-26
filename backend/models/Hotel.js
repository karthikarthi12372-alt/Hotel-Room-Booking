import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
