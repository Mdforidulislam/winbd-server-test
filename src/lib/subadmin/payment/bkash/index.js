import Bkash from "../../../../models/bkashCC.js";


const bkashMarcentAdd = async (marchentinfo) => {
    try {
        console.log("Adding merchant info:", marchentinfo);
        const response = await Bkash.create(marchentinfo);
        return response;
    } catch (error) {
        console.error("Error in bkashMarcentAdd:", error);
        throw new Error("Failed to add merchant to the database");
    }
};

const bashMarcentGetDB = async (marchent_id) => {
    try {
        const response = await Bkash.findOne({ marchent_id });
        if (!response) {
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error in bashMarcentGetDB:", error);
        throw new Error("Failed to retrieve merchant from the database");
    }
};

const bkashConnectUserDB = async (marchent_id) => {
    try {
        const response = await Bkash.findOne({ marchent_id });
        if (!response) {
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error in bkashConnectUserDB:", error);
        throw new Error("Failed to retrieve connection information from the database");
    }
};

export { bkashMarcentAdd, bashMarcentGetDB, bkashConnectUserDB };
