import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ Status: "Error", Message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ Error: "Token is expired!" });
    req.name = decoded.name;
    req.email = decoded.email;
    req.id = decoded.id;
    next();
  });
  console.log('Token from cookie:', req.cookies.token);

};
