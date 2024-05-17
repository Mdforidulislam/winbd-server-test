const PaymentMehod = require("../../../models/paymentMethod")

const showNumberlib = async (author, type, method) => {
    console.log(author, type, method , 'check the api show number');
    try {
        if (author === '' || type === '' || method === '') {
            return {message:"Please given write info"}
        } 

        // convert the type condtion
        const personalType = type === 'cashout' ? 'agent' : type === 'sendmoney' ? 'personal' : type === 'payment' ? 'payment' : null;

        console.log(personalType);

        const isExitePaymentMehtod = await PaymentMehod.findOne({ $and: [{ authorId: author }, { transactionType: personalType }, { transactionMethod: method }] }); // query the is exite data insde the payment system

        if (isExitePaymentMehtod) {
            if (isExitePaymentMehtod.status === 'active') {
                return {message:"geting data sucessfully inside the database ", isExitePaymentMehtod}
            }
            
        } else {
            return {message:"paymentMethod don't exite"}
        }

    }catch(error){return error}
}

module.exports = { showNumberlib };