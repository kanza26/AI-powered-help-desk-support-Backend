const ticketModel = require('../model/ticket');
class ticketService {

    async create(ticketData) {
        try {
            const newTicket = await ticketModel.create(ticketData);
            return newTicket;
            
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    async delete(ticketId, userId) {
        try {
            const deleted = await ticketModel.delete({
                where: {
                    id: ticketId,
                    user_id: userId
                }
            });
            return deleted > 0; // returns true if a ticket was deleted
        }
        catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const tickets = await ticketModel.findAll();
            return tickets;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    }

}