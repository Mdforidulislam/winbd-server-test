import { promotionEffersShow } from "../../../lib/users/promotion/promotion.js";


const promotionOfferShow = async (req, res) => {
    try {

        const userName = req.query.userName;
        const finalReuslt = await promotionEffersShow(userName);
        res.status(200).json(finalReuslt);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};

export { promotionOfferShow };


