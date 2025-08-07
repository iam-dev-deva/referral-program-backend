const router = require('express').Router();
const userController = require('../controllers/user.controller');
const {protect} = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser); 

module.exports = router;
