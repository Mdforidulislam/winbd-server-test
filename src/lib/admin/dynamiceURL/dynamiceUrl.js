import {DynamicallyUrl} from "../../../models/dynamiceURL.js";

const craateDynamicallyUrlAdmin = async (urlInfo) => {
    try {
        if (
            !urlInfo || 
            !urlInfo.redirectUrl || 
            !/^https:\/\//.test(urlInfo.redirectUrl) || 
            !urlInfo.redirectUrl || 
            !/^https:\/\//.test(urlInfo.redirectUrl)
        ) {
            return { message: "Please provide a valid HTTPS URL for both redirectUrl and changeLink" };
        }

        // Define options for findOneAndUpdate
        const options = {
            new: true,               // Return the updated document
            upsert: true,            // Create a new document if it doesn't exist
            setDefaultsOnInsert: true // Apply default values if a new document is created
        };

        // Attempt to find and update the document
        let updateAndInsertDynavalu = await DynamicallyUrl.findOneAndUpdate(
            { uniqueId: urlInfo.uniqueId },  // Filter to find the document by uniqueId
            { $set: { redirectUrl: urlInfo.redirectUrl } }, // Update with the new redirectUrl
            options // Options for upsert
        );

        // If no document is found, insert a new one
        if (!updateAndInsertDynavalu) {
            updateAndInsertDynavalu = await DynamicallyUrl.create({
                uniqueId: urlInfo.uniqueId,
                redirectUrl: urlInfo.redirectUrl
            });
        }

        // Return success message
        return {
            message: "URL has been successfully created or updated",
            data: updateAndInsertDynavalu
        };

    } catch (error) {
        // Return error message
        return { error: "An error occurred while creating or updating the URL", details: error.message };
    }
};

// geting url
const getingURlDaynamicaly = async (req, res) => {
    try { 
        const geginUrl = await DynamicallyUrl.find();

        if (geginUrl.length > 0) {
            return {
                message: "succesfully geting data",
                data: geginUrl
            }
        }

    } catch (error) {
        return error;
    }
};

export { craateDynamicallyUrlAdmin, getingURlDaynamicaly };
