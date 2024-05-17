const { getUsersLibray } = require("../../../lib/subadmin/getUsersLibray/getUserLibray");


const getingUserShowSubAdmin = async (req, res) => {
    try {
        console.log('call the api');
        const uniqueId = req.query.uniqueId;
        const searchValue = req.query.searchValue;
        const pageNumbers = req.query.pageNumber;
        const finalResult = await getUsersLibray(uniqueId, searchValue, pageNumbers);
        res.status(200).json(finalResult);
     } catch (error) { res.status(500).json({ eror: error.message }) };
}


module.exports = { getingUserShowSubAdmin };