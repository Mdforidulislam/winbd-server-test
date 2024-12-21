import { getUsersLibray } from "../../../lib/subadmin/getUsersLibray/getUserLibray.js";


const getingUserShowSubAdmin = async (req, res) => {
    try {
        const uniqueId = req.query.uniqueId;
        const searchValue = req.query.searchValue;
        const pageNumbers = req.query.pageNumber;
        const finalResult = await getUsersLibray(uniqueId, searchValue, pageNumbers);
        res.status(200).json(finalResult);
    } catch (error) {
        res.status(500).json({ eror: error.message });
    }
};

//  geting RegiseterUser Count

const getingUserCountList = async (req, res) => {
    try { 
        const authoreId = req.query.authoreId;

        if (!authoreId) {
            return { message: "User Authored Id is missing here" };
        }

        const finalResult = await getingRegisterUserCount(authoreId);

        res.status(200).json(finalResult);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};

export { getingUserShowSubAdmin, getingUserCountList };