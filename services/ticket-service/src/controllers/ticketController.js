const ticketService = require('../services/ticketService');
const TICKET_STATUS = require('../../../../constants/ticketStatus');

const createTicket = (req, res) => {
  const { subject, complaint, priority, location } = req.body;
  if (!subject || !complaint || !location) {
    return res.status(400).json({ success: false, message: 'Subject, complaint and location are required' });
  }

  const userId = req.user.userId;
  const newTicket = {
    user_id: userId,
    subject,
    complaint,
    priority: priority || 'medium',
    location,
  };

  ticketService.create(newTicket)
    .then(ticket => {
      res.status(201).json({ success: true, message: 'Ticket created successfully', data: ticket });
    })
    .catch(error => {
      console.error('Error creating ticket:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

const getAllTickets = (req, res) => {
  const user = req.user;
  const fetchPromise = user.role === 'admin'
    ? ticketService.getAll()
    : ticketService.getByUserId(user.userId);

  fetchPromise
    .then(tickets => {
      res.status(200).json({ success: true, message: 'Fetched tickets', data: tickets });
    })
    .catch(error => {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

const getMyTickets = (req, res) => {
  ticketService.getByUserId(req.user.userId)
    .then(tickets => {
      res.status(200).json({ success: true, message: 'Fetched my tickets', data: tickets });
    })
    .catch(error => {
      console.error('Error fetching user tickets:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

const getTicketById = (req, res) => {
  const ticketId = req.params.id;
  const user = req.user;

  ticketService.getById(ticketId)
    .then(ticket => {
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      if (user.role !== 'admin' && ticket.user_id !== user.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized to access this ticket' });
      }

      res.status(200).json({ success: true, message: 'Fetched ticket', data: ticket });
    })
    .catch(error => {
      console.error('Error fetching ticket:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

const deleteTicket = (req, res) => {
  const ticketId = req.params.id;
  const userId = req.user.userId;
  ticketService.delete(ticketId, userId)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Ticket not found or unauthorized' });
      }
    })
    .catch(error => {
      console.error('Error deleting ticket:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

const updateTicketStatus = (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;
  const user = req.user;

  if (user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admin can update ticket status' });
  }

  let statusValue = null;
  if (typeof status === 'number') {
    statusValue = TICKET_STATUS.names[status];
  } else if (typeof status === 'string') {
    statusValue = TICKET_STATUS.strings.includes(status) ? status : null;
  }

  if (!statusValue) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  ticketService.updateStatus(ticketId, statusValue)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, message: 'Ticket status updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Ticket not found' });
      }
    })
    .catch(error => {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  deleteTicket,
  updateTicketStatus,
};
