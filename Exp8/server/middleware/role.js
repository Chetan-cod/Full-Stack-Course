/**
 * Role Middleware — restricts access based on user role.
 * Must be used AFTER authMiddleware.
 *
 * Role Hierarchy: admin > moderator > user
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
