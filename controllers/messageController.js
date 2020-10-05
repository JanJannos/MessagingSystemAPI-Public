const Message = require('../models/Message');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all messages
 * @route   GET /api/v1/messages
 * @access  Public
 */

exports.getMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ user: req.user.id });
  res.status(200).json(messages);
});

/**
 * @desc    Get 1 message
 * @route   GET /api/v1/messages/:id
 * @access  Public
 */

exports.getMessage = asyncHandler(async (req, res, next) => {
  const singleMessage = await Message.findById(req.params.id);
  if (!singleMessage) {
    // when we have multiple res.status , we need to return the first one !
    // return res.status(400).json({ success: false });
    return next(
      // This is when we have an ID that's not in the DB
      new ErrorResponse(`Message not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: singleMessage });
});

/**
 * @desc    Create new message
 * @route   POST /api/v1/messages
 * @access  Private
 */

exports.createMessage = asyncHandler(async (req, res, next) => {
  // Add user to body
  req.body.user = req.user.id;
  const message = await Message.create(req.body);
  // res.status(200).json({ success: true, msg: "Create new message" });
  res.status(201).json({
    success: true,
    data: message,
  });
});

/**
 * @desc    Update message
 * @route   POST /api/v1/messages/:id
 * @access  Private
 */

exports.updateMessage = asyncHandler(async (req, res, next) => {
  let message = await Message.findById(req.params.id);

  if (!message) {
    // return res.status(400).json({ success: false });
    return next(
      // This is when we have an ID that's not in the DB
      new ErrorResponse(`Message not found with ID of ${req.params.id}`, 404)
    );
  }

  // Make sure user is message owner
  console.log('Make sure user is message owner ...');
  // If the user is the owner & not an admin ...
  if (message.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this message!`,
        401
      )
    );
  }

  // Everything went OK and here we'll update
  message = await Message.findOneAndUpdate(req.params.id, req.body, {
    new: true, // return the updated message
    runValidators: true,
  });

  res.status(200).json({ success: true, data: message });
});

/**
 * @desc    Delete message
 * @route   DELETE /api/v1/messages/:id
 * @access  Private
 */
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return next(
      // This is when we have an ID that's not in the DB
      new ErrorResponse(`Message not found with ID of ${req.params.id}`, 404)
    );
  }

  // If the user is the owner & not an admin ...
  if (message.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this message!`,
        401
      )
    );
  }

  message.remove(); // This will also remove all the associated courses
  res.status(200).json({ success: true, data: {} });
});
