// api/index.js
require('dotenv').config();
const app = require('./src/server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Up running on ${PORT} on ${process.env.NODE_ENV} mode.`);
});
