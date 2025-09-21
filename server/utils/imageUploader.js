const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        console.log("Uploading file:", file);
        const options = { folder };

        if (height) options.height = height;
        if (quality) options.quality = quality;
        options.resource_type = "auto";

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.log("Cloudinary upload error:", error.message);
        throw new Error("Error while uploading image to Cloudinary");
    }
};
