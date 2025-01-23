import { bashMarcentGetDB, bkashConnectUserDB, bkashMarcentAdd, UpdateMarcentInfoDB } from "../../../../lib/subadmin/payment/bkash/index.js";


// Route Handlers
const bkadhPaymentAPI = async (req, res) => {
    try {
        const { marchentinfo } = req.body;
     

        if (!marchentinfo) {
            return res.status(400).json({
                message: "Invalid request. 'bkashInfo' is required",
                status: 400,
            });
        }

        const result = await bkashMarcentAdd(marchentinfo);
        res.status(200).json({
            message: 'Merchant added successfully',
            status: 200,
            data: result,
        });
    } catch (error) {
        console.error("Error in bkadhPaymentAPI:", error);
        res.status(500).json({
            message: "An error occurred while adding the merchant",
            error: error.message,
        });
    }
};

const bkashMarcentGetAPI = async (req, res) => {
    try {
        const { marchent_Id } = req.query;
    

        if (!marchent_Id) {
            return res.status(400).json({
                message: "Invalid request. 'marchent_id' is required",
                status: 400,
            });
        }

        const result = await bashMarcentGetDB(marchent_Id);
        if (!result) {
            return res.status(404).json({
                message: "Merchant not found",
                status: 404,
            });
        }

        res.status(200).json({
            message: "Merchant information retrieved successfully",
            status: 200,
            data: result,
        });
    } catch (error) {
        console.error("Error in bkashMarcentGetAPI:", error);
        res.status(500).json({
            message: "An error occurred while retrieving merchant information",
            error: error.message,
        });
    }
};

const updateMerchentAPI = async (req, res) => {
    try {
        const { marchentinfo } = req.body;
        

        const response = await UpdateMarcentInfoDB(marchentinfo);

        res.status(200).json({
            message: 'Merchant information updated successfully',
            status: 200,
            data: response,
        });
    } catch (error) {
        console.error("Error in updateMerchentAPI:", error);
        res.status(500).json({
            message: "An error occurred while updating merchant information",
            error: error.message,
        });
    }
};



const bkashConnectUserAPI = async (req, res) => {
    try {
        const { marchent_id } = req.query;
        if (!marchent_id) {
            return res.status(400).json({
                message: "Invalid request. 'marchent_id' is required",
                status: 400,
            });
        }

        const result = await bkashConnectUserDB(marchent_id);
        if (!result) {
            return res.status(404).json({
                message: "Merchant not found",
                status: 404,
            });
        }

        res.status(200).json({
            message: 'Merchant connection information retrieved successfully',
            status: 200,
            data: result,
        });
    } catch (error) {
        console.error("Error in bkashConnectUserAPI:", error);
        res.status(500).json({
            message: "An error occurred while retrieving connection information",
            error: error.message,
        });
    }
};

export { bkadhPaymentAPI, bkashMarcentGetAPI, bkashConnectUserAPI ,updateMerchentAPI};