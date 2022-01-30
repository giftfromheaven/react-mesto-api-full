const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const NotAuthError = require("../errors/not-auth-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new NotAuthError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "randomdata"
    );
  } catch (err) {
    throw new NotAuthError("Необходима авторизация");
  }

  req.user = payload;

  next();
};

// const { NODE_ENV, JWT_SECRET } = process.env;
// const jwt = require("jsonwebtoken");
// const NotAuthError = require("../errors/not-auth-error");

// module.exports = (req, res, next) => {
//   // if (req.method === 'OPTIONS') {
//   //   return next();
//   // }
//   try {
//     const token = req.cookies.jwt;
//     const payload = jwt.verify(
//       token,
//       NODE_ENV === "production" ? JWT_SECRET : "randomdata"
//     );
//     req.user = payload;
//     return next();
//   } catch (error) {
//     throw new NotAuthError("Нет авторизации");
//   }
// };
