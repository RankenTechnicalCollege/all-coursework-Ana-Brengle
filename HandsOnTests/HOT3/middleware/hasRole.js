export const hasRole = (allowedRoles) => {
    return async (req, res, next) => {

        if (!req.user) {  
            return res.status(401).json({ error: "Unauthorized", message: "User not authenticated" });
        }
        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

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