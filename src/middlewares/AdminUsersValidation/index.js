import {Admin} from "../../models/admin.js";
import { UserList } from "../../models/users.js";

const adminUserValidation = async (req, res) => {
    const { userName, password } = req.query;

    // Validate input fields
    if (!userName || !password) {
        return res.status(400).json({ message: 'Missing userName or password' });
    }

    console.log(userName, password);

    try {
        // Query admin and user collections in parallel for better performance
        const [admin, user] = await Promise.all([
            Admin.findOne({ subAdmin: userName, password }),
            UserList.findOne({ userName, password })
        ]);

        // Validate admin credentials
        if (admin) {
            if (admin.role === 'admin' || admin.role === 'subAdmin') {
                return res.status(200).json({ role: admin.role, uniqueId: admin.uniqueId });
            } else {
                return res.status(401).json({ message: "Invalid admin role" });
            }
        }

        // Validate user credentials
        if (user) {
            return res.status(200).json({ role: user.role, authorId: user.authorId });
        }

        // If no admin or user matched
        return res.status(401).json({ message: "Invalid userName or password" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { adminUserValidation };
