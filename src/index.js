const express = require('express');
const app = express();
const clinicRoutes = require('./routes/clinics');

app.use(express.json());
app.use('/api/clinics', clinicRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
