const PromotionOffers = require("../../../models/promotion");
const Transactions = require("../../../models/transactions");

const promotionEffersShow = async (userName) => {
    try { 
        // Check if the user is new
        const findUsersIsNeworOld = await Transactions.find({ userName: userName });

        // Fetch all promotion offers
        const promotionOffers = await PromotionOffers.find();

        // Initialize arrays for offers
        const newUserOffers = [];
        const allUserOffers = [];

        // Determine if user is new or old
        const isNewUser = findUsersIsNeworOld.length === 0;

        promotionOffers.forEach((offer) => {
            if (isNewUser && offer.newUser ) {
                // New users see new user offers that are not one-time only
                newUserOffers.push({
                    title: offer.title,
                    description: offer.description,
                    fixtAmount: offer.fixedAmount,
                    percentTage: offer.percentage
                });

            } else if (!isNewUser && offer.allUser) {
                // All users can see all user offers
                if (offer.oneTime) {
                    const hasReceivedOffer = findUsersIsNeworOld.some(transaction => 
                        transaction.offers.some(o => o.title === offer.title)
                    );
                    if (!hasReceivedOffer) {
                        // Add one-time offer if the user hasn't received it yet
                        allUserOffers.push({
                            title: offer.title,
                            description: offer.description,
                            fixtAmount: offer.fixedAmount,
                            percentTage: offer.percentage
                        });
                    }
                } else if (offer.allTime) {
                    // Add all-time offers
                    allUserOffers.push({
                        title: offer.title,
                        description: offer.description
                    });
                }
            }
        });

        // Combine and return offers based on user type
        if (isNewUser) {
            return newUserOffers;
        } else {
            return allUserOffers;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { promotionEffersShow };
