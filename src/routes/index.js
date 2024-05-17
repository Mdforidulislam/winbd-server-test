const { adminInsertData, getAdminInfoList } = require('../api/admin');
const { getingSubAdmin, subAdminInsert } = require('../api/subAdmin');
const { getingUserShowSubAdmin } = require('../api/subAdmin/getUsers/getUsers');
const { transactionMethod, getingPaymentmethod, updatePaymentMethodNumber } = require('../api/subAdmin/paymentMethod/paymentMethod');
const { getingHistoryapi } = require('../api/subAdmin/transactionRquest/history');
const { getingTransactionRequestDeposite, getingTransactionRequestWithdraw, transactionRequsetFeedbackapi } = require('../api/subAdmin/transactionRquest/TransactionRequest');
const { userInsert, getingUsersData } = require('../api/users');
const { userHistoryGeting } = require('../api/users/history/userHistory');
const { showNumber } = require('../api/users/showNumber/showNumber');
const { transactionSave } = require('../api/users/transaction/transaction');
const { adminUserValidation } = require('../middlewares/AdminUsersValidation');



const router = require('express').Router()

router.get('/adminInsert',adminInsertData); // insert data to database 
router.get('/getingData',getAdminInfoList);  // geting database all the admin data

router.post('/insertSubAdmin',subAdminInsert); // insert data to database 
router.get('/getingDataSubAdmin',getingSubAdmin) // geting sub admin 

router.post('/insertUsers', userInsert); // insert users for register 
router.get('/getingRegUser', getingUsersData); // geting users data from register 
router.get('/getinguse', getingUserShowSubAdmin); // show the user to subamdin 

router.post('/addTransaction', transactionMethod); // add a transaction method 
router.get('/getingPaymentmethod', getingPaymentmethod); // geting payment method
router.patch('/updatePaymentMethod', updatePaymentMethodNumber); // update payment method


router.get('/showPaymentNumber', showNumber); /// show the number to the users 
router.post('/insertTransaction', transactionSave); // save the transaction data 
router.get('/transactionReqDopsite', getingTransactionRequestDeposite); // userTransaction Request and send to subadmin  deposite 
router.get('/transactionReqWith', getingTransactionRequestWithdraw); // usertransaction Request and send to subamdin withdraw 
router.put('/transactionFeedback', transactionRequsetFeedbackapi); // update the transaction requestion 
router.get('/getingHistory', getingHistoryapi); // this is history geting end point
router.get('/userHistory', userHistoryGeting); // geting user history send to the users


router.get('/userValidation', adminUserValidation) // isRoleExite inside the database ( check )

module.exports = router