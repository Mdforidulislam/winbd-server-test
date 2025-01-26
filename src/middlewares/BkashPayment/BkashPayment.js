import axios from 'axios';
import { setValue } from 'node-global-storage';
import Bkash from '../../models/bkashCC.js';
import { bashMarcentGetDB } from '../../lib/subadmin/payment/bkash/index.js';

const bkashPaymentAuth = async (req, res, next) => {
        
    try {
        const {authorId,...info} = req.body;
        
        const {
            marchent_Id,
            username,
            password,
            api_key,
            secret_key
        } = await bashMarcentGetDB(authorId);
        

        console.log( 
            marchent_Id,
            username,
            password,
            api_key,
            secret_key,
            authorId,
        "bkashPaymentAuth"
        )

        const { data } = await axios.post("https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant", {
            app_key: api_key,
            app_secret: secret_key,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                username: username,
                password: password,
            }
        });

        setValue('id_token', data.id_token);
        setValue("api-key",api_key)

        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export { bkashPaymentAuth };