const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("DEBUG: No Authorization header received");
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Ensure token has the "Bearer" prefix
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      console.log("DEBUG: Token missing after 'Bearer'");
      return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified user to the request object
    req.user = verified;

    // Debugging logs
    console.log("DEBUG: Token successfully verified. User:", verified);

    next();
  } catch (err) {
    console.error("DEBUG: Error verifying token:", err.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = auth;
