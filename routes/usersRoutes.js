const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const { protect, authorize } = require('../middlewares/auth');

// Short way to use "Protect"
// Anything below this is gonna use "Protect"
router.use(protect);
router.use(authorize('admin'));

// Now anything below is gonna be "protected" & you must be an "admin"

router.route('/').post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
