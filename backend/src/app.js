require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const researchRoutes = require('./routes/research.routes');
const submissionRoutes = require('./routes/submissions.routes');
const meetingRoutes = require('./routes/meetings.routes');
const minuteRoutes = require('./routes/minutes.routes');
const reportRoutes = require('./routes/reports.routes');
const vivaVoceRoutes = require('./routes/vivaVoce.routes');
const thesisRoutes = require('./routes/thesis.routes');
const publicationRoutes = require('./routes/publication.routes');
const auditRoutes = require('./routes/audit.routes');
const notificationRoutes = require('./routes/notification.routes');
const { uploadRoot } = require('./services/storageService');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
// Allow multiple origins: the Vercel frontend + localhost dev
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/uploads', express.static(path.resolve(uploadRoot())));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/minutes', minuteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/viva-voce', vivaVoceRoutes);
app.use('/api/thesis', thesisRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
