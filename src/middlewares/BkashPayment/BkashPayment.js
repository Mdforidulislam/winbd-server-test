import axios from "axios";
import { bashMarcentGetDB } from "../../lib/subadmin/payment/bkash/index.js";
import { setValue } from "node-global-storage";

const bkashPaymentAuth = async (req, res, next) => {
    try {
        const { authorId, ...info } = req.body;

        // Validate authorId
        if (!authorId) {
            return res.status(400).json({ error: "authorId is required in the request body." });
        }

        // Fetch merchant details
        const { marchent_Id, username, password, api_key, secret_key } = await bashMarcentGetDB(authorId);

        if (!marchent_Id || !username || !password || !api_key || !secret_key) {
            throw new Error("Missing required merchant credentials.");
        }

        console.log({
            marchent_Id,
            username,
            password,
            api_key,
            secret_key,
            authorId
        }, "bkashPaymentAuth");

        // Make API request
        const { data } = await axios.post(
            "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant",
            { app_key: api_key, app_secret: secret_key },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    username,
                    password,
                }
            } 
        );

        if (!data.id_token) {
            throw new Error("Failed to retrieve id_token from bKash.");
        }

        // Set token and proceed
        setValue("id_token", data.id_token);
        setValue("api-key", api_key);

        console.log(data, "Check the response token");

        next();
    } catch (error) {
        console.error(error.response?.data || error.message, "Middleware Error");
        return res.status(401).json({ error: error.message });
    }
};


export { bkashPaymentAuth };