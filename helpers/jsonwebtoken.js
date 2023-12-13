const jwt = require("jsonwebtoken");

const createToken = (payload, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty Object");
  }

  try {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: expiresIn,
    });

    return `Bearer ${token}`;
  } catch (error) {
    console.error("Failed to sign the jwt : ", error);
  }
};

module.exports = { createToken };
