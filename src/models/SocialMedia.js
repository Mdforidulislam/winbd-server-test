const mongoose = require("mongoose");

const socialMediaPlatformSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => /^https?:\/\/.+/.test(value),
            message: props => `${props.value} is not a valid URL.`
        }
    }
});

const socialMediaLinkSchema = new mongoose.Schema({
    role: {
        type: String,
        required: false,
    },
    authorId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    socialMediaLinks : {
        whatApp: {
            type: socialMediaPlatformSchema,
            required: true
        },
        facebook: {
            type: socialMediaPlatformSchema,
            required: true
        },
        teligram: {
            type: socialMediaPlatformSchema,
            required: true
        }
       }
});

const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);

module.exports = SocialMediaLink;
