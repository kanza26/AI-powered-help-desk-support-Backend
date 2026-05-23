const ticketService = require('../services/ticketService');
const TICKET_STATUS = require('../../../../constants/ticketStatus');
const TICKET_STATUS = require('../../../../constants/ticketStatus');
const createTicket = (req, res) =>{
    const {subject,complaint,priority,location} = req.body;


    if(!subject || !complaint || !location){
        return res.status(400).json({success:false,message:'Subject, complaint and location are required'});
    }
    const userId = req.user.userId;

    const newTicket = {
        user_id: userId,
        subject,
        complaint,
        priority: priority || 'medium',
        location
    };
    ticketService.create(newTicket)
    .then(ticket => {
        res.status(201).json({success:true,message:'Ticket created successfully',data:ticket});
    })
    .catch(error => {
        console.error('Error creating ticket:', error);
        res.status(500).json({success:false,message:'Internal server error'});
    });

}

const deleteTicket = (req, res) => {
    const ticketId = req.params.id;
    const userId = req.user.userId;
    ticketService.delete(ticketId, userId)
    .then(deleted => {
        if(deleted){
            res.status(200).json({success:true,message:'Ticket deleted successfully'});
        } else {
            res.status(404).json({success:false,message:'Ticket not found or unauthorized'});
        }
    })
    .catch(error => {
        console.error('Error deleting ticket:', error);
        res.status(500).json({success:false,message:'Internal server error'});
    });
}

const getAllTickets = (req, res) => {
    // Implementation for fetching all tickets
    ticketService.getAll()
    .then(tickets => {
        res.status(200).json({success:true,message:'Fetched all tickets',data:tickets});
    })
    .catch(error => {
        console.error('Error fetching tickets:', error);
        res.status(500).json({success:false,message:'Internal server error'});
    });
}

const updateTicketStatus = (req, res) => {
    const ticketId = req.params.id;
    const { status } = req.body;
    const userId = req.user.userId;

    let statusValue = null;
    if (typeof status === 'number') {
        statusValue = TICKET_STATUS.names[status];
    } else if (typeof status === 'string') {
        statusValue = TICKET_STATUS.values[status] ? status : null;
    }

    if (!statusValue) {
        return res.status(400).json({success:false,message:'Invalid status value'});
    }
    ticketService.updateStatus(ticketId, userId, statusValue)
    .then(updated => {
        if(updated){
            res.status(200).json({success:true,message:'Ticket status updated successfully'});
        } else {
            res.status(404).json({success:false,message:'Ticket not found or unauthorized'});
        }
    })
    .catch(error => {
        console.error('Error updating ticket status:', error);
        res.status(500).json({success:false,message:'Internal server error'});
    });
}
