require("dotenv").config();
const app = require("./app");
const dev = require("./config/config");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
