const express = require('express')
const models = require('../mongo');
const { validationChecks } = require('./data/validation');
const { check } = require('express-validator');
const passwordHash = require('password-hash');
const { sendMail } = require('./data/nodemailer')

const userRouter = () => {
  const router = express.Router()

  router.post('/forgetpass', [
    check('email').normalizeEmail().isEmail().withMessage('Email Incorrect')
  ], validationChecks, async (req, res) => {
    const { email } = req.body;
    const user = await models.user.find({ email });
    if (user.length > 0) {
      const codeThere = await models.verifyPassCode.find({ email });
      if (codeThere.length < 1) {
        const code = Math.round((Math.random() * 9000) + 1000);
        const verifyCode = new models.verifyPassCode({ email, verifyPassCode: code })
        return verifyCode.save().then(() => {
          sendMail(code, email);
          res.status(200).send({ message: code })
        }).catch((err) => {
          res.status(500).send({ error: err })
        });
      }

      res.status(401).send({ message: 'You have already requested code' });
    }

    res.status(401).send({ message: 'Email incorrect' });
  });

  router.use('/resetpass', [
    check('newPassword').not().isEmpty().isLength({ min: 6 }).withMessage('your password should have at least 6 characters'),
    check('email').normalizeEmail().isEmail().withMessage('Email Incorrect'),
    check('verifyPassCode').not().isEmpty().isLength(4).withMessage('something wrong in your verification code'),
  ], validationChecks, async (req, res) => {
    const { verifyPassCode, newPassword, email } = req.body;
    const passCode = await models.verifyPassCode.find({ verifyPassCode: verifyPassCode });
    if (passCode.length > 0 && passCode[0].email === email) {
      const password = passwordHash.generate(newPassword);
      await models.user.findOneAndUpdate({ email: passCode[0].email }, { password }).then(result => {
        if (result) {
          res.status(200).send({ message: 'La contraseña de ha cambiado correctamente' });
          return models.verifyPassCode.findByIdAndDelete(passCode[0].id);
        }
      }).catch((err) => {
        res.status(500).send({ error: err })
      });
    } else {
      res.status(401).send({ message: 'Something did not turn out as you expected' });
    }
  });

  return router;
};

module.exports = {
  userRouter,
}
