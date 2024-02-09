const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin); //point @ controller w/ getLogin function

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin); //point @ controller w/ getLogin function

router.post(
  '/signup',
  check('email').isEmail().withMessage('Please enter a valid e-mail'),
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
