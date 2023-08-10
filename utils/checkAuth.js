const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.userId = decoded.id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа 1',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа 2',
    });
  }
};

module.exports = checkAuth;
