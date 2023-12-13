require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 3002,
  },
  db: {
    url: process.env.URL || process.env.DBURL,
  },
};

module.exports = dev;
