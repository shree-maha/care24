const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/caregivers', require('./routes/caregivers'));
app.use('/api/bookings',   require('./routes/bookings'));
app.use('/api/services',   require('./routes/services'));
app.use('/api/carenotes',  require('./routes/carenotes'));
app.use('/api/admin',      require('./routes/admin'));

// ── Health check ──
app.get('/', (req, res) => res.json({ message: 'Care24 API running ✅', version: '1.0.0' }));

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ── Connect DB & Start ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Care24 API running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
