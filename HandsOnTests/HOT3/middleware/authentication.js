import { auth } from "../auth.js";


export async function isAuthenticated(req, res, next) {
  try {
    const session = await auth.api.getSession({headers: req.headers});
    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to access this resource."
      })
    }
    req.user = session.user;
    req.session = session.session;
    next();
  }catch(err) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired session."
    })
  }
}

export const hasRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.role || [];

        if(!Array.isArray(userRoles) || userRoles.length === 0){
            return res.status(403).json({error: "No Roles assigned to user"});
        }
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
        const hasAllowedRole = userRoles.some(role => rolesArray.includes(role));

        if(!hasAllowedRole){
            return res.status(403).json({
                error: `Access denied. Required role(s): ${rolesArray.join(', ')}`
            });
        }
        next();
    }
}