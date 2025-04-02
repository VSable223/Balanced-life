import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
