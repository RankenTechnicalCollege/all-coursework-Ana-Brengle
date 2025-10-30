export const hasAnyRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userRoles = req.user.role || [];
            if (!Array.isArray(userRoles) || userRoles.length === 0) {
                return res.status(403).json({ error: 'User has no roles assigned' });
            }

            const hasRequiredRole = userRoles.some((role) => roles.includes(role));

            if (!hasRequiredRole) {
                return res.status(403).json({
                    error: `Access denied. Requires one of these roles: ${roles.join(', ')}`
                });
            }
                
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Error"})
        }
    }
}