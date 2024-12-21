import { emailGetingFromSubAdmin, getingSubAdminEmaildata } from "../../../lib/subadmin/email/email.js";

//  geting subAdmin Email
const getingSubAdminEmail = async (req, res) => {
    try {
        const authoreId = req.query.authoreId;

        if (authoreId === '') {
            return { message: "Wrong authoreId" };
        }

        const finalResult = await getingSubAdminEmaildata(authoreId); 
        res.status(200).json(finalResult);

    } catch (error) { 
        res.status(500).json({
            error: error.message
        })
     };
};

//  updateSub Admin email

const updateSubAdminEmail = async (req, res) => {
    try { 
        const authoreId = req.query.authoreId;
        const infoSubAdmin = req.body;
        if (!authoreId) {
            return { message: "authoredid  invalid" };
        };

        const finalResult = await emailGetingFromSubAdmin(authoreId, infoSubAdmin);
        res.status(200).json(finalResult);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
};


export { updateSubAdminEmail, getingSubAdminEmail };