export const hasAnyRole = (allowedRoles) => {
  return (req, res, next) => {

    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: 'No role assigned to user' });
    }


    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];


    const hasAllowedRole = rolesArray.includes(userRole);

    if (!hasAllowedRole) {
      return res.status(403).json({ 
        error: `Access denied. Required role(s): ${rolesArray.join(', ')}. Your role: ${userRole}` 
      });
    }

    next();
  };
};