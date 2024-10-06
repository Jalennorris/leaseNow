import express from 'express';
import payment from '../contollers/paymentContoller.js';
const router = express.Router();
router.get('/', payment.getAllPayments);
router.post('/', payment.createPayment);
router.get('/:id', payment.getPayment);
router.put('/:id', payment.updatePayment);
router.delete('/:id', payment.deletePayment);
export default router;
