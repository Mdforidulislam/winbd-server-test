const PromotionOffers = require("../../../models/promotion");

// Convert data
const transformPromotionData = (input) => {
    return {
        title: input.title,
        description: input.description || '',
        amount: input.amount,
        turnover: input.turnover || '',
        percentage: input.percentage || null,
        fixedAmount: input.fixedAmount || null,
        allUser: input.userType === 'allUser',
        newUser: input.userType === 'newUser',
        allTime: input.timeType === 'allTime',
        oneTime: input.timeType === 'oneTime'
    };
};


// Insert the promotion data
const insertPromotionOffers = async (promotionInfo) => {
    try {
        if (!promotionInfo || !Object.values(promotionInfo).some(item => item)) {
            return { message: "Please provide correct data for insertion" };
        }

        // Transform the data
        const transformedData = transformPromotionData(promotionInfo);
        console.log("Transformed data:", transformedData); // Log transformed data

        // Check if the promotion with the same title already exists
        const existingData = await PromotionOffers.findOne({ title: transformedData.title });
        if (existingData) {
            return { message: "The promotion is already in the database" };
        }

        // Insert the transformed promotion data
        const newPromotion = new PromotionOffers(transformedData);
        await newPromotion.save();
        return { message: "Successfully inserted promotion data" };

    } catch (error) {
        console.error("Error during insertion:", error); // Log error details
        return { error: "An error occurred while inserting promotion data", details: error.message };
    }
}

// geting promotion offerlist

const getingPromotionOfferList = async () => {
    try { 
        const getingPromotionList = await PromotionOffers.find().lean();
        if (getingPromotionList) {
            return {message: "successfully geting promotion list" ,getingPromotionList}
        }
        } catch (error) {
            return error;
    }
};

// update promotion value here

const updatePromotionValue = async (findById,updateInfo) => {
    try {
        // Validate the input data
        if (!updateInfo) {
            return { message: "Please provide correct data" };
        }

        // Find the promotion by ID and update it
        const updatedPromotion = await PromotionOffers.findByIdAndUpdate(
            findById,
            { $set: updateInfo },
            { new: true, runValidators: true }
        );

        if (!updatedPromotion) {
            return { message: "Promotion not found or update failed" };
        }

        return { message: "Successfully updated promotion", data: updatedPromotion };

    } catch (error) {
        console.error(error);
        return { error: "An error occurred while updating promotion", details: error.message };
    }
};


//  deleted the promotion offer list

const deletePromotionOffers = async (id) => {
    try {
        // Validate the input ID
        if (!id) {
            return { message: "Please provide a valid ID" };
        }

        // Find and delete the promotion by ID
        const deletedPromotion = await PromotionOffers.findByIdAndDelete(id);

        if (!deletedPromotion) {
            return { message: "Promotion not found or deletion failed" };
        }

        return { message: "Successfully deleted promotion", data: deletedPromotion };

    } catch (error) {
        console.error(error);
        return { error: "An error occurred while deleting promotion", details: error.message };
    }
};



module.exports = { insertPromotionOffers , getingPromotionOfferList , updatePromotionValue , deletePromotionOffers };
