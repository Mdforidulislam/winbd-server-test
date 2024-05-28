const { craateDynamicallyUrlAdmin, getingURlDaynamicaly } = require("../../../lib/admin/dynamiceURL/dynamiceUrl");

// insert url
const insertDynamiceUrl = async (req, res) => {
    try {

        const urlInfo = req.body;
        const finalResust = await craateDynamicallyUrlAdmin(urlInfo);
        res.status(200).json(finalResust);
        } catch (error) {
            res.status(500).json({
                error: error.message,
            })
        }
};


// geting url

const getingDynamicallyUrl = async (req, res) => {
    try { 
        const finalResult = await getingURlDaynamicaly();
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};

module.exports = {insertDynamiceUrl,getingDynamicallyUrl}