const TICKET_STATUS = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,

  names: {
    1: 'open',
    2: 'in_progress',
    3: 'resolved',
    4: 'closed',
  },

  values: {
    open: 1,
    in_progress: 2,
    resolved: 3,
    closed: 4,
  },

  strings: ['open', 'in_progress', 'resolved', 'closed'],
};

module.exports = TICKET_STATUS;
