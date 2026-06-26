import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getBookings);

router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id')
  .put(protect, admin, updateBookingStatus)
  .delete(protect, admin, deleteBooking);

export default router;
