const SocialMediaLink = require("../../../models/SocialMedia");



// isnert the socail link here 

const insertSocialMediaContactUsers = async (socialInfo) => {
    try {
        // Check if the input object is null or undefined
        if (!socialInfo || typeof socialInfo !== 'object') {
            return { message: "Invalid input: socialInfo object is required." };
        }

        // Destructure the input object
        const {role, authorId, socialMediaLinks } = socialInfo;

        // Validate the presence of required fields
        if (!authorId || !socialMediaLinks || Object.keys(socialMediaLinks).length === 0) {
            return { message: "Invalid input: 'authorId' and at least one social media platform are required." };
        }

        // Validate each social media platform's link
        for (const platform in socialMediaLinks) {
            const platformData = socialMediaLinks[platform];
            const link = platformData.link;
            if (!link || !/^https?:\/\/.+/.test(link)) {
                return { message: `Invalid URL for ${platform}: Link URL must be valid.` };
            }
        }

        // Create a new document using the SocialMediaLink model
      const newSocialMediaLink = new SocialMediaLink({
            role,
            authorId,
            socialMediaLinks
        });

        // Save the document to the database
        const savedDocument = await newSocialMediaLink.save();

        // Return the saved document or a success message
        return { message: "Social media contact user inserted successfully.", data: savedDocument };
    } catch (error) {
        // Handle any unexpected errors
        return { message: "An error occurred during insertion.", error };
    }
};



// geting socialMedia link here

const getSocialMediaLink = async (authorId) => {
    try {

      if (!authorId) {
            return { message: "Author ID is required for validation." };
          }
        
      const getSubAdminSocial = await SocialMediaLink.findOne({ authorId }).select('socialMediaLinks imgLink').lean();
  
      if (getSubAdminSocial) {
        return {
          message: "Successfully retrieved data",
          data: getSubAdminSocial,
        };
      } else {
        return { message: "Failed to fetch data" };
      }
    } catch (error) {
      console.error(error);
      return { message: "An error occurred while fetching data", error };
    }
  };
  


module.exports = { insertSocialMediaContactUsers ,getSocialMediaLink};
