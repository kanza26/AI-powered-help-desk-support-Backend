const { DataTypes } = require('sequelize');
const {sequelize } = require('../config/db.js');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255],
    },
  },
  complaint: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open',
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tickets',
  timestamps: false, // manually manage datetime and updated_at
  underscored: true,
  indexes: [
    {
      fields: ['user_id'],
      name: 'idx_user_id',
    },
    {
      fields: ['status'],
      name: 'idx_status',
    },
    {
      fields: ['priority'],
      name: 'idx_priority',
    },
    {
      fields: ['datetime'],
      name: 'idx_datetime',
    },
  ],
});


module.exports = Ticket;