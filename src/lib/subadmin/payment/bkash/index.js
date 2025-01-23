import Bkash from "../../../../models/bkashCC.js";


const bkashMarcentAdd = async (marchentinfo) => {
    try {
        console.log(marchentinfo)
        const response = await Bkash.create(marchentinfo);
        return response;
    } catch (error) {
        if(error.code === 11000) {
            return {
                message: "Merchant already exists",
            }
        }
        console.error("Error in bkashMarcentAdd:", error);
        throw new Error("Failed to add merchant to the database");
    }
};

const bashMarcentGetDB = async (marchent_Id) => {
    try {
        // Fetch merchant details from the database
        const response = await Bkash.findOne({ marchent_Id });
        
        if (!response) {
            console.log(`No merchant found for ID: ${marchent_Id}`);
            return null;
        }

        console.log(response)

       return response;
    } catch (error) {
        console.error("Error in bashMarcentGetDB:", error);
        throw new Error("Failed to retrieve merchant from the database");
    }
};

const UpdateMarcentInfoDB = async ( marchentinfo ) => {
    try{
        const response = await Bkash.findOneAndUpdate({ marchent_Id: marchentinfo.marchent_Id }, marchentinfo, { new: true });
        return response;
    }catch(error){
        console.error("Error in UpdateMarcentInfoDB:", error);
        throw new Error("Failed to update merchant information in the database");
    }
}

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

export { bkashMarcentAdd, bashMarcentGetDB, bkashConnectUserDB , UpdateMarcentInfoDB };
