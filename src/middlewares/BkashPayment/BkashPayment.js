import axios from 'axios';
import { setValue } from 'node-global-storage';
import { v4 as uuidv4 } from 'uuid';

const bkashPaymentAuth = async (req, res, next) => {

    try {
        const { data } = await axios.post(process.env.bkash_grant_token_url, {
            app_key: process.env.bkash_api_key,
            app_secret: process.env.bkash_secret_key,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                username: process.env.bkash_username,
                password: process.env.bkash_password,
            }
        });

        setValue('id_token', data.id_token);

        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export { bkashPaymentAuth };