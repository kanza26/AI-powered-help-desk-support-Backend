const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateCreateTicket = require('../validators/validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', ticketController.getAllTickets);

// Authenticated routes
router.post('/', authMiddleware, validateCreateTicket, ticketController.createTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);
router.put('/:id', authMiddleware, ticketController.updateTicketStatus);


module.exports = router;



