export const protectRoute = (req, res, next) => {
    try {
        const isAuthed = req.auth?.userId && req.auth?.sessionId;
        if (!isAuthed) {
            return res
                .status(401)
                .json({ message: "Unauthorized - you must be logged in" });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};