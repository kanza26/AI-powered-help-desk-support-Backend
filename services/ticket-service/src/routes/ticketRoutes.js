const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateCreateTicket = require('../validators/validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);

// Authenticated routes
router.post('/', authMiddleware, validateCreateTicket, ticketController.createTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;


