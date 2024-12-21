import express from 'express';
import { adminInsertData, getAdminInfoList } from '../api/admin/index.js';
import { getingSubAdmin, subAdminInsert, updatesubAdminInfoAPI } from '../api/subAdmin/index.js';
import { getingUserCountList, getingUserShowSubAdmin } from '../api/subAdmin/getUsers/getUsers.js';// jamela
import { getingPaymentmethod, transactionMethod, updatePaymentMethodNumber } from '../api/subAdmin/paymentMethod/paymentMethod.js'; // jamela
import { showNumber } from '../api/users/showNumber/showNumber.js'; // jamela
import { getingUsersData, updateUserInfoAPI, userInsert } from '../api/users/index.js';
import { transactionSave } from '../api/users/transaction/transaction.js';// jamela
import { getingTransactionRequestDeposite, getingTransactionRequestWithdraw, getingVerifydata, transactionRequsetFeedbackapi } from '../api/subAdmin/transactionRquest/TransactionRequest.js'; // jamela
import { getingHistoryapi } from '../api/subAdmin/transactionRquest/history.js';// jamela
import { userHistoryGeting } from '../api/users/history/userHistory.js'; // jamela 
import { getingPayInstraction, insertPayInstraction } from '../api/admin/payInstraction.js';
import { getingSocialLink, insertSocialMediaLink } from '../api/subAdmin/socialMedia/index.js';
import { getingSubAdminSocialLink, passwordForgotuser } from '../api/users/passsword/passwordForgot.js'; // jamela
import { getingDynamicallyUrl, insertDynamiceUrl } from '../api/admin/dynamiceUrl/dynamicUrl.js';// jamela
import { deletedPromtion, getingPromotinOfferInfo, promotionTurnoverDeleted, promtionOfferinser, updatePromotionData } from '../api/subAdmin/promotion/promotion.js';// jamlea
import { promotionOfferShow } from '../api/users/promotion/promotion.js'; // jamela
import { getingSubAdminEmaildata } from '../lib/subadmin/email/email.js';
import {  updateSubAdminEmail } from '../api/subAdmin/email/email.js';
import { getingWebHook, postWebHook } from '../chat/liveChat.js'; // jamela
import { adminUserValidation } from '../middlewares/AdminUsersValidation/index.js';
import { bkashPaymentAuth } from '../middlewares/BkashPayment/BkashPayment.js';
import PaymentController from '../paymentControler/paymentControler.js';
import paymentControler from '../paymentControler/paymentControler.js';
// import { insertDynamiceUrl, getingDynamicallyUrl } from '../api/admin/dynamiceUrl/dynamicUrl.js';
// import { insertPayInstraction, getingPayInstraction } from '../api/admin/payInstraction.js';
// import { getingSubAdminEmail, updateSubAdminEmail } from '../api/subAdmin/email/email.js';
// import { getingUserShowSubAdmin, getingUserCountList } from '../api/subAdmin/getUsers/getUsers.js';
// import { transactionMethod, getingPaymentmethod, updatePaymentMethodNumber } from '../api/subAdmin/paymentMethod/paymentMethod.js';
// import { promtionOfferinser, getingPromotinOfferInfo, updatePromotionData, deletedPromtion, promotionTurnoverDeleted } from '../api/subAdmin/promotion/promotion.js';
// import { getingHistoryapi } from '../api/subAdmin/transactionRquest/history.js';
// import { getingTransactionRequestDeposite, getingTransactionRequestWithdraw, transactionRequsetFeedbackapi, getingVerifydata } from '../api/subAdmin/transactionRquest/TransactionRequest.js';
// import { userHistoryGeting } from '../api/users/history/userHistory.js';
// import { getingSubAdminSocialLink, passwordForgotuser } from '../api/users/passsword/passwordForgot.js';
// import { promotionOfferShow } from '../api/users/promotion/promotion.js';
// import { showNumber } from '../api/users/showNumber/showNumber.js';
// import { transactionSave } from '../api/users/transaction/transaction.js';
// import { getingWebHook, postWebHook } from '../chat/liveChat.js';
// import { adminInsertData, getAdminInfoList } from '../api/admin/index.js';
// import subAdmin, { getingSocialLink, insertSocialMediaLink } from '../api/subAdmin/socialMedia/index.js';
// import { getingSubAdmin, subAdminInsert, updatesubAdminInfoAPI } from '../api/subAdmin/index.js';
// import { getingUsersData, updateUserInfoAPI, userInsert } from '../api/users/index.js';
// import { adminUserValidation } from '../middlewares/AdminUsersValidation/index.js';

const router = express.Router();

router.get('/adminInsert', adminInsertData); // insert data to database 
router.get('/getingData', getAdminInfoList);  // geting database all the admin data

router.post('/insertSubAdmin', subAdminInsert); // insert data to database 
router.put('/updatesubAdminInfoAPI', updatesubAdminInfoAPI); // update the subadmin info here 
router.get('/getingDataSubAdmin', getingSubAdmin); // geting sub admin 
router.get('/getingUserCountList', getingUserCountList); // geting user Register length 

router.post('/insertUsers', userInsert); // insert users for register 
router.put('/updateUserInfoAPI', updateUserInfoAPI); // update the userinfo here
router.get('/getingRegUser', getingUsersData); // geting users data from register 
router.get('/getinguse', getingUserShowSubAdmin); // show the user to subadmin 

router.post('/addTransaction', transactionMethod); // add a transaction method 
router.get('/getingPaymentmethod', getingPaymentmethod); // geting payment method
router.patch('/updatePaymentMethod', updatePaymentMethodNumber); // update payment method

router.get('/showPaymentNumber', showNumber); // show the number to the users 
router.post('/insertTransaction', transactionSave); // save the transaction data 
router.get('/transactionReqDopsite', getingTransactionRequestDeposite); // userTransaction Request and send to subadmin deposite 
router.get('/transactionReqWith', getingTransactionRequestWithdraw); // usertransaction Request and send to subadmin withdraw 
router.put('/transactionFeedback', transactionRequsetFeedbackapi); // update the transaction request 
router.get('/getingHistory', getingHistoryapi); // this is history send to subadmin not processing data 
router.get('/getingVerifydata', getingVerifydata); // geting verify data send to subadmin
router.get('/userHistory', userHistoryGeting); // geting user history send to the users

router.post('/insertPayInstraction', insertPayInstraction); // payInstraction insert to database 
router.get('/getingPaymentInstraction', getingPayInstraction); // geting instraction to send global way

// forgot password here
router.put('/insertSocialMFPF', insertSocialMediaLink); // insert the social link here for password forgot 
router.get('/getSocialMFPF', getingSocialLink); // get the social media info send to subadmin
router.get('/getinPassordContact', getingSubAdminSocialLink); // geting social info send to users for contact subadmin

// insert Dynamically url
router.patch('/insertDynamiceUrl', insertDynamiceUrl); // insert dynamically url 
router.get('/getingDynamicallyUrl', getingDynamicallyUrl); // geting dynamically url

// promotion api make here
router.post('/promtionOfferinser', promtionOfferinser); // insert the promotion data here
router.get('/getingPromotininfo', getingPromotinOfferInfo); // geting promotion offer info send admin page
router.put('/updatePromotionData', updatePromotionData); // update the promotion 
router.delete('/deletedPromtion', deletedPromtion); // delete the promotion 
router.get('/promotionOfferShow', promotionOfferShow); // send to promotion offer title description to users
router.delete('/turnoverdeleted', promotionTurnoverDeleted); // delete the promotion turnover data from subadmin request withdraw and deposite

// email features here
router.get("/getingSubAdminEmail", getingSubAdminEmaildata); // geting email from database send to subAdmin
router.put("/updateSubAdminEmail", updateSubAdminEmail); // updateEmail from the subAdmin 

// live chat features add here
router.get('/webhook', getingWebHook); // geting webhook here 
router.post("/webhook", postWebHook); // post the webhook here 

// ===================== role validation ===========================
router.put('/passwordForgotuser', passwordForgotuser); // update the users and admin password 
router.get('/userValidation', adminUserValidation); // isRoleExite inside the database ( check )

// ====================== bkash route ===============================
router.post("/bkash-payment-create",bkashPaymentAuth, PaymentController.createPayment);
router.get("/bkash-callback-url?", PaymentController.handleCallback);
router.post("/bkash-payment-refund", paymentControler.refundPayment);

export { router };