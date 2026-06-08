const express = require('express');
const router  = express.Router();

const SERVICES = [
  { id:1, icon:'🩺', title:'Nursing Care',       tag:'Medical',        price:800,  desc:'Certified nurses for IV therapy, wound care, medication management and vitals monitoring.' },
  { id:2, icon:'🧘', title:'Physiotherapy',       tag:'Rehabilitation', price:900,  desc:'Licensed physiotherapists for post-surgical recovery and mobility restoration.' },
  { id:3, icon:'🤝', title:'Elderly Attendant',   tag:'Personal Care',  price:500,  desc:'Compassionate companions for daily living, personal hygiene and emotional support.' },
  { id:4, icon:'🏥', title:'Post-Hospital Care',  tag:'Recovery',       price:1000, desc:'Seamless recovery support after discharge.' },
  { id:5, icon:'💊', title:'Medication Support',  tag:'Medical',        price:400,  desc:'Structured reminders and adherence tracking.' },
  { id:6, icon:'🧠', title:'Dementia Care',       tag:'Specialized',    price:1100, desc:'Specialists trained in cognitive support.' },
];

router.get('/', (req, res) => res.json({ success: true, services: SERVICES }));
router.get('/:id', (req, res) => {
  const s = SERVICES.find(s => s.id === parseInt(req.params.id));
  if (!s) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, service: s });
});

module.exports = router;
