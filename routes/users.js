const router = require('express').Router();
const { updateUser, getCurrentUser } = require('../contollers/users');
const { validateUpdateUser } = require('../middlewares/validation');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
