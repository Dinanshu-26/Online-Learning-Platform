const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const categorysDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categorysDetails);
        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
            data: categorysDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.showAllCategories = async (req, res) => {
    try {
        // console.log("INSIDE SHOW ALL CATEGORIES");
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);

        // Get courses for the selected category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    { path: "ratingAndReviews" },
                    { path: "instructor", select: "firstName lastName email" }
                ],
            })
            .exec();

        // Handle the case when the category is not found
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category",
            });
        }

        // Get other categories (except the selected one)
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        });

        let differentCategory = null;
        if (categoriesExceptSelected.length > 0) {
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }

            const randomCategoryId =
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id;

            differentCategory = await Category.findById(randomCategoryId)
                .populate({
                    path: "courses",
                    match: { status: "Published" },
                    populate: { path: "instructor", select: "firstName lastName email" },
                })
                .exec();
        }

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: { path: "instructor", select: "firstName lastName email" },
            })
            .exec();

        const allCourses = allCategories.flatMap((category) => category.courses);

        const mostSellingCourses = allCourses
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
