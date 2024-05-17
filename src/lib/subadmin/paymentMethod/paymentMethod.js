const PaymentMehod = require("../../../models/paymentMethod");


// payment method insert successfully 
const addTransactionMethod = async (paymentInfo) => {
    try {
 
        console.log(paymentInfo, 'check the payement info');
        if (Object.keys(paymentInfo).length < 1 && !Object.keys(paymentInfo).every(item => item)) {
            return {message:"Empty input fild"}
        } else {
            const allpaymentMethod = await PaymentMehod.find({ $or: [{ number: paymentInfo.number }] }); // queery exite data
       
            const isPermisstionPayment = allpaymentMethod.some((item) => {
                if (item.transactionMethod === paymentInfo.transactionMethod) {
                    if (item.transactionType === paymentInfo.transactionType) {
                        return { message: "payament method exite" };
                     }
                 }
            })
            
          
            
            // data insert database
            if (!isPermisstionPayment) {
                const insertPaymentMethod = await PaymentMehod.create(paymentInfo); insertPaymentMethod.save();
                return { message: "insert data Sucessfully", insertPaymentMethod };
            }
           
        }
        
        
    }catch(error){return error}
}

// geting data paymentMehod here

const getingPaymentMethod = async (authorId) => {
    console.log(authorId ,'athour id check ');
    try {
        const getingPaymentMehod = await PaymentMehod.find({ authorId: authorId });
        console.log(getingPaymentMehod,'check the data ');
        return { message: "successfully geting paymentMethod", getingPaymentMehod };
    }catch(error){return error}
}

// update the paymentMethod
const updatePaymentmethod = async (updateInfo) => {
    try {
        console.log(updateInfo);
        //  return the empty valu , validation 
        if (updateInfo.number === '') {
                return {messge:'Please provide Correct data '}
        }
        console.log(isNaN(parseInt(updateInfo.number)));
        // update query here
        if (updateInfo.number !== '') {
            const updateData = await PaymentMehod.updateOne(
                {
                    $or: [
                        { _id: updateInfo.id }
                    ]
                }, 
                {
                    $set: {
                        ...( !isNaN(parseInt(updateInfo.number)) ? { number: updateInfo.number } : {}),
                        ...( isNaN(parseInt(updateInfo.number)) ? { status: updateInfo.number } : {})
                    }
                }
            );

            console.log(updateData);
            if (updateData.modifiedCount === 1) {
                return { message:"update data sucessfully"}
            }
        }

      }catch(error){return error}
}

module.exports = { addTransactionMethod, getingPaymentMethod , updatePaymentmethod };