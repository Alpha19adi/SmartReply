import jwt from "jsonwebtoken";
 // Make sure this is defined in your config

const JWT_SECRET = process.env.JWT_SC || ""; 

export function verifyToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        return decoded.id;
    } catch (error) {
        console.error("Invalid JWT token:", error);
        return null;
    }
}
