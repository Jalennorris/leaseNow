import express from 'express';
import properties  from '../contollers/propertiesController.js'


const router = express.Router();

router.get('/', properties.getAllProperties);
router.post('/', properties.createProperty);
router.get('/:id', properties.getProperty);
router.put('/:id', properties.updateProperty);
router.delete('/:id', properties.deleteProperty);


export default router;

