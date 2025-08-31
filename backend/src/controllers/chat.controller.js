import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const token = generateStreamToken(userId);
        if (!token) return res.status(500).json({ message: "Token generation failed" });

        res.status(200).json({ token });
    } catch (error) {
        console.log("error generating stream token", error);
        res.status(500).json({ message: "failed to generate the token" });
    }
};