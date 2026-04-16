const app = require('./src/app');
require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
});