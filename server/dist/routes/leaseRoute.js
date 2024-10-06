import Express from 'express';
import lease from '../contollers/leasesControllers.js';
const router = Express.Router();
router.get('/', lease.getAllLeases);
router.post('/', lease.createLease);
router.get('/:id', lease.getLease);
router.put('/:id', lease.updateLease);
router.delete('/:id', lease.deleteLease);
export default router;
