const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateCreateTicket = require('../validators/validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', ticketController.getAllTickets); //just for admin wo saray tickets dekh sakay, normal user apne tickets dekh sakay, iske liye role based authorization middleware banana padega, jisme check hoga ki user admin hai ya nahi, agar admin hai to sab tickets return karega, warna sirf uske apne tickets return karega.



// Authenticated routes
router.post('/', authMiddleware, validateCreateTicket, ticketController.createTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

//admin only route for updating ticket status
router.put('/:id',authMiddleware, ticketController.updateTicketStatus);
//isko admin ke liye restrict karna hai, iske liye role based authorization middleware banana padega, jisme check hoga ki user admin hai ya nahi, agar admin hai to hi ticket status update kar sakta hai, warna unauthorized error return karega.

module.exports = router;



