const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

const {
  getMessage,
  getMessages,
  deleteMessage,
  createMessage,
  updateMessage,
} = require('../controllers/messageController');

router
  .route('/')
  .get(protect, getMessages)
  .post(protect, authorize('publisher', 'admin'), createMessage);

router
  .route('/:id')
  .get(getMessage)
  .put(protect, authorize('publisher', 'admin'), updateMessage)
  .delete(protect, authorize('publisher', 'admin'), deleteMessage);

module.exports = router;
