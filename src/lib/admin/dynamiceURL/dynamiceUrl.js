
const DynamicallyUrl = require("../../../models/dynamiceURL");


const craateDynamicallyUrlAdmin = async (urlInfo) => {
    try {
        // Validate the URL
        if (!urlInfo || !urlInfo.previewLink || !/^https:\/\//.test(urlInfo.previewLink) || !urlInfo.changeLink || !/^https:\/\//.test(urlInfo.changeLink)) {
            return { message: "Please provide a valid HTTPS URL for both previewLink and changeLink" };
        }

        // Define options for findOneAndUpdate
        const options = {
            new: true,               // Return the updated document
            upsert: true,            // Create a new document if it doesn't exist
            setDefaultsOnInsert: true // Apply default values if a new document is created
        };

        // Find and update the document, or insert a new one if it doesn't exist
        const updateAndInsertDynavalu = await DynamicallyUrl.findOneAndUpdate(
            { redirectUrl: urlInfo.previewLink }, // Filter to find the document
            { $set: { redirectUrl: urlInfo.changeLink } }, // Update with the new data
            options                                // Options for upsert
        );

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



//  geting url

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

module.exports = { craateDynamicallyUrlAdmin , getingURlDaynamicaly };
