import {getUserById} from "../database.js"
export const hasRole = (allowedRoles) => {
    return async(req, res, next) => {
      const userId = req.user.id; // from session.user
      const user = await getUserById(userId);
        const userRoles = user.role || [];

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