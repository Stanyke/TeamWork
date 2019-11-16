const justAuthenticate = function isAuthenticated(req, res, next)
{
    if (typeof req.headers.authorization !== "undefined")
    {
        const token = req.headers.authorization.split(" ")[1];
        
        req.token = token;
        
        return next();
    }
    
    res.status(500).json({ error: "Not Authorized" });
};

module.exports = justAuthenticate;