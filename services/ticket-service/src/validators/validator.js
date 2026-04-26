export const validateCreateTicket = (req, res, next) => {
    if (!req.body.subject) {
        return res.status(400).json({ success: false, message: 'Subject is required' });
    }
    if(!req.body.complaint) {
        return res.status(400).json({ success: false, message: 'Complaint is required' });
    }
    if(!req.body.location) {
        return res.status(400).json({ success: false, message: 'Location is required' });
    }
    if(req.body.priority && !['low', 'medium', 'high', 'urgent'].includes(req.body.priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
    }
    next();

}