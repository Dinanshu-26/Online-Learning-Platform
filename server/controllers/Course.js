const Category = require("../models/Category");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.createCourse = async (req, res) => {
    try {
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            status,
            tag: _tag,
            category,
        } = req.body;

        const thumbnail = req.files.thumbnailImage;

        let tag = _tag;
        if (typeof _tag === "string") {
            try {
                tag = JSON.parse(_tag);
            } catch {
                // fallback: treat as comma-separated string
                tag = _tag.split(',').map(item => item.trim());
            }
        }


        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            })
        }

        const userId = req.user.id;
        // const instructorDetails = await User.findById(userId, {
        //     accountType: "Instructor",
        // });

        if (!status || status === undefined) {
            status = "Draft"
        }

        const instructorDetails = await User.findOne({
            _id: userId,
            accountType: "instructor"
        });


        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            })
        }

        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )
        // console.log(thumbnailImage);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            status,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id,
            },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )

        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });


    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
                tag: true,
                status: true
            }
        )
            .populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        })
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                },
            })
            .exec()

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //     return res.status(403).json({
        //         success: false,
        //         message: `Accessing a draft course is forbidden`,
        //     });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required",
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const updates = req.body;

        // --- Handle thumbnail update ---
        if (req.files && req.files.thumbnailImage) {
            console.log("Updating thumbnail...");
            const thumbnail = req.files.thumbnailImage;
            const uploadedThumbnail = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            course.thumbnail = uploadedThumbnail.secure_url;
        }

        // --- Allowed fields to update ---
        const allowedFields = [
            "courseName",
            "courseDescription",
            "whatYouWillLearn",
            "price",
            "tag",
            "status",
            "category"
        ];

        // --- Apply updates safely ---
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                if (key === "tag") {
                    try {
                        course[key] = JSON.parse(updates[key]);
                    } catch {
                        course[key] = updates[key];
                    }
                } else {
                    course[key] = updates[key];
                }
            }
        }

        await course.save();

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            });

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
