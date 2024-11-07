import express from 'express';
import contact from '../contollers/contactControler.js';


const Router = express.Router();


Router.get('/', contact.getContacts);
Router.post('/', contact.createContact);
Router.get('/:id', contact.getContact);
Router.put('/:id', contact.updateContact);
Router.delete('/:id', contact.deleteContact);



export default Router;