const redis = require('redis');
const nodemailer = require('nodemailer');

// Redis connection
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  }
});

redisClient.on('connect', () => console.log('✅ Email service connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));
redisClient.connect();

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: false
});

// Process email queue
async function processEmails() {
  console.log('📧 Email worker started, waiting for emails...');
  
  while (true) {
    try {
      const emailJob = await redisClient.rPop('email:queue');
      
      if (emailJob) {
        const { to, subject, message, type, userId } = JSON.parse(emailJob);
        
        await transporter.sendMail({
          from: process.env.FROM_EMAIL,
          to: to,
          subject: subject,
          text: message,
          html: `<h1>${subject}</h1><p>${message}</p>`
        });
        
        console.log(`📧 Email sent to ${to} - Type: ${type}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error processing email:', error);
    }
  }
}

processEmails();