const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users/check-auth:
 *   get:
 *     tags: [Users]
 *     summary: Check if user is authenticated
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/check-auth', protect, userController.checkAuth);

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *               referralCode:
 *                 type: string
 *                 example: JOH1234
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use or invalid referral
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', userController.logout);

router.use(protect);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

/**
 * @swagger
 * /users/referral/me:
 *   get:
 *     tags: [Users]
 *     summary: Get referral info of logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral info returned
 *       401:
 *         description: Unauthorized
 */
router.get('/referral/me', userController.getMyReferralInfo);

/**
 * @swagger
 * /users/referral/redeem:
 *   post:
 *     tags: [Users]
 *     summary: Redeem referral rewards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reward redeemed successfully
 *       400:
 *         description: Not enough points to redeem
 *       401:
 *         description: Unauthorized
 */
router.post('/referral/redeem', userController.redeemReward);

module.exports = router;