const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {protect} = require('../middlewares/auth.middleware');

router.get('/check-auth', protect, userController.checkAuth);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.use(protect);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.get('/referral/me', protect, userController.getMyReferralInfo);
router.post('/referral/redeem', protect, userController.redeemReward);

module.exports = router;