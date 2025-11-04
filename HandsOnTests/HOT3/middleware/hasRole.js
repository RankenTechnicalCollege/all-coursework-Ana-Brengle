export const hasRole = (allowedRoles) => {
    return (req, res, next) => {
         
        const userRoles = (req.user && req.user.role) || [];

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