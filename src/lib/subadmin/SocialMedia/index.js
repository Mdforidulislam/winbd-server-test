import { SocialMediaLink } from "../../../models/SocialMedia.js";


// isnert the socail link here 
const insertSocialMediaContactUsers = async (socialInfo) => {
  try {
    if (!socialInfo || typeof socialInfo !== 'object') {
      return { message: "Invalid input: socialInfo object is required." };
    }

    const { role, authorId, socialMediaLinks } = socialInfo;

    if (!authorId || !socialMediaLinks || Object.keys(socialMediaLinks).length === 0) {
      return { message: "Invalid input: 'authorId' and at least one social media platform are required." };
    }

    const updatedDocument = await SocialMediaLink.findOneAndUpdate(
      { authorId }, // Query to match the document
      { role, authorId, socialMediaLinks }, // Data to update
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );

    return { message: 'Operation successful', data: updatedDocument };
  } catch (error) {
    console.error("Error during insertion:", error);
    return { message: "An error occurred during insertion.", error };
  }
};

// geting socialMedia link here
const getSocialMediaLink = async (authorId) => {
  try {
      
    console.log(authorId);

    if (!authorId) {
            return { message: "Author ID is required for validation." };
    }
    const getSubAdminSocial = await SocialMediaLink.findOne({ authorId }, { _id: 0, socialMediaLinks: 1 }).lean();
    
      if (getSubAdminSocial) {
              const { socialMediaLinks } = getSubAdminSocial;
              const sanitizedSocialMediaLinks = {};
          
              // Iterate over socialMediaLinks and remove _id from each platform
              for (const platform in socialMediaLinks) {
                  sanitizedSocialMediaLinks[platform] = { link: socialMediaLinks[platform].link };
              }
          
              const responseData = {
                  message: "Successfully retrieved data",
                  data: { socialMediaLinks: sanitizedSocialMediaLinks }
            };
            return responseData;
       
      } else {
        return { message: "Failed to fetch data" };
      }
    } catch (error) {
      console.error(error);
      return { message: "An error occurred while fetching data", error };
    }
  };

export { insertSocialMediaContactUsers, getSocialMediaLink };
