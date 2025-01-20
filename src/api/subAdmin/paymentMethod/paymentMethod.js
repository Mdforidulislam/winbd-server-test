import { addTransactionMethod, getingPaymentMethod, updatePaymentmethod, updatePermissionPaymentDB } from "../../../lib/subadmin/paymentMethod/paymentSystem.js";

const transactionMethod = async (req, res) => {
    try {
        const paymentInfo = req.body;
        const finalResult = await addTransactionMethod(paymentInfo)
        res.status(200).json(finalResult)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}



// getingPaymentMethod staring

const getingPaymentmethod = async (req, res) => {
    try { 
        const authorId = req.query.uniqueId;
        const paymentType = req.query.paymentType;
        const finalResult = await getingPaymentMethod(authorId , paymentType );
        res.status(200).json(finalResult);
    } catch(error) {
        res.status(500).json({error : error.message})
    }
}



// update data paymentMehotd
const updatePaymentMethodNumber = async (req, res) => {
    try {
        const updateInfo = req.body;
        const finalResult = await updatePaymentmethod(updateInfo)
        res.status(200).json(finalResult)
     } catch (error) { 
        res.status(500).json({error : error.message})
    };
}

const updatePermissionPayment = async(req,res) =>{
    try{
        const { id, type} = req.query;

        if(!id || !type){
            res.status(404).json({
                message:"wrong info given", 
            })
        }

        const response = await updatePermissionPaymentDB(id, type)
        res.status(200).json({
            message: "successfully update the paymemnt",
            status: 200,
            data: response,
        })
        
    }catch(error){
        res.statu(500).json({
            message: "error accorurect",
            statu: 500, 
            error: error.message
        })
    }
}



export { transactionMethod, getingPaymentmethod, updatePaymentMethodNumber , updatePermissionPayment };