const { insertPromotionOffers, updatePromotionValue, deletePromotionOffers, getingPromotionOfferList, deletedTurnoverSave } = require("../../../lib/subadmin/Promotion/promotion");


// Insert promotion offer data here
const promtionOfferinser = async (req, res) => {
    try {
        const promotionInfo = req.body;
        const finalResult = await insertPromotionOffers(promotionInfo);
        res.status(200).json(finalResult);
    } catch (error) {
        console.error("Error inserting promotion offer:", error); // Log error details
        res.status(500).json({
            error: error.message
        });
    }
};

//  geing promotion info

const getingPromotinOfferInfo = async (req, res) => {
    try { 
        const finalResult = await getingPromotionOfferList();
        res.status(200).json(finalResult);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

// update the promotion data here

const updatePromotionData = async (req, res) => {
    try { 
        const findById = req.query.id;
        const updateInfo = req.body;
        const finalResulst = await updatePromotionValue(findById,updateInfo);
        res.status(200).json(finalResulst);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

// deleted promotion uption
const deletedPromtion = async (req, res) => {
    try {

        const id = req.query.id;
        const finalResult = await deletePromotionOffers(id);
        res.status(200).json(finalResult);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// deleted the turnover

const promotionTurnoverDeleted = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return { message: "please provide currect id" };
        }
        const finalResult = await deletedTurnoverSave(id); // call the api funtion
        res.status(200).json(finalResult);
     } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};





module.exports = { promtionOfferinser , getingPromotinOfferInfo ,updatePromotionData , deletedPromtion ,promotionTurnoverDeleted  };


