const { adminInsertData, getAdminInfoList } = require('../api/admin');
const { insertDynamiceUrl, getingDynamicallyUrl } = require('../api/admin/dynamiceUrl/dynamicUrl');
const { insertPayInstraction, getingPayInstraction } = require('../api/admin/payInstraction');
const { getingSubAdmin, subAdminInsert, updateAdminInfoAPI, updatesubAdminInfoAPI } = require('../api/subAdmin');
const { getingSubAdminEmail, updateSubAdminEmail } = require('../api/subAdmin/email/email');
const { getingUserShowSubAdmin, getingUserCountList } = require('../api/subAdmin/getUsers/getUsers');
const { transactionMethod, getingPaymentmethod, updatePaymentMethodNumber } = require('../api/subAdmin/paymentMethod/paymentMethod');
const { promtionOfferinser, getingPromotinOfferInfo, updatePromotionData, deletedPromtion, promotionTurnoverDeleted } = require('../api/subAdmin/promotion/promotion');
const { insertSocialMediaLink, getingSocialLink} = require('../api/subAdmin/socialMedia');
const { getingHistoryapi } = require('../api/subAdmin/transactionRquest/history');
const { getingTransactionRequestDeposite, getingTransactionRequestWithdraw, transactionRequsetFeedbackapi, getingVerifydata } = require('../api/subAdmin/transactionRquest/TransactionRequest');
const { userInsert, getingUsersData, updateUserInfoAPI } = require('../api/users');
const { userHistoryGeting } = require('../api/users/history/userHistory');
const { getingSubAdminSocialLink, passwordForgotuser } = require('../api/users/passsword/passwordForgot');
const { promotionOfferShow } = require('../api/users/promotion/promotion');
const { showNumber } = require('../api/users/showNumber/showNumber');
const { transactionSave } = require('../api/users/transaction/transaction');
const { getingWebHook, postWebHook } = require('../chat/liveChat');
const { emailGeting } = require('../lib/subadmin/email/email');
const { updateUserInfo } = require('../lib/users/register');
const { adminUserValidation } = require('../middlewares/AdminUsersValidation');

// ================================= below api call ===========================================



const router = require('express').Router()

router.get('/adminInsert', adminInsertData); // insert data to database 
router.get('/getingData',getAdminInfoList);  // geting database all the admin data

router.post('/insertSubAdmin', subAdminInsert); // insert data to database 
router.put('/updatesubAdminInfoAPI', updatesubAdminInfoAPI); // update the subadmin info here 
router.get('/getingDataSubAdmin', getingSubAdmin) // geting sub admin 
router.get('/getingUserCountList', getingUserCountList); // geting  user Register lenght 


router.post('/insertUsers', userInsert); // insert users for register 
router.put('/updateUserInfoAPI', updateUserInfoAPI); // update the userinfo here
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
router.get('/getingHistory', getingHistoryapi); // this is history send to subadmin not processing data 
router.get('/getingVerifydata', getingVerifydata); // geting verify data send to subadmin
router.get('/userHistory', userHistoryGeting); // geting user history send to the users

router.post('/insertPayInstraction', insertPayInstraction); // payInstraction insert to database 
router.get('/getingPaymentInstraction', getingPayInstraction); // geting instraction to send global way

//  forgot password here
router.put('/insertSocialMFPF',insertSocialMediaLink); // insert the social link here for password forgot 
router.get('/getSocialMFPF', getingSocialLink); // get the social medial info send to subadmin
router.get('/getinPassordContact', getingSubAdminSocialLink); // geting socailinfo send to users for contactsubadmin

// insert Dynamically url
router.patch('/insertDynamiceUrl', insertDynamiceUrl); // insert dynamically url 
router.get('/getingDynamicallyUrl', getingDynamicallyUrl); // geting dynamically url

// promotion api make here
router.post('/promtionOfferinser', promtionOfferinser); // insert the promotion data here
router.get('/getingPromotininfo', getingPromotinOfferInfo); // geting promotion offer info send admin page
router.put('/updatePromotionData', updatePromotionData); // update the promotion 
router.delete('/deletedPromtion', deletedPromtion); // delete the promotion 
router.get('/promotionOfferShow', promotionOfferShow); // send to promotion offer title dscription to users
router.delete('/turnoverdeleted', promotionTurnoverDeleted); // delted the promotion turnover data from subadmin reqquest withdraw and deposite


// email features here
router.get("/getingSubAdminEmail", getingSubAdminEmail); // geting email from database send to subAdmin
router.put("/updateSubAdminEmail",updateSubAdminEmail ); // updateEmail from the subAdmin 


// live chat features add here

router.get('/webhook', getingWebHook); // giting webhook here 
router.post("/webhook", postWebHook); // post the webhook here 


// ===================== role validation ===============================
router.put('/passwordForgotuser', passwordForgotuser); // update the users and admin password 
router.get('/userValidation', adminUserValidation); // isRoleExite inside the database ( check )

module.exports = router