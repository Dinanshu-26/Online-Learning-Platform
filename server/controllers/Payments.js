const { instance } = require("../config/razorpayFile");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;

    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide course IDs",
      });
    }

    let totalAmount = 0;

    // Convert userId to ObjectId once
    const uid = new mongoose.Types.ObjectId(userId);

    for (const courseId of courses) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check if user already enrolled
      const isEnrolled = course.studentsEnrolled.some((id) =>
        id.equals(uid)
      );

      if (isEnrolled) {
        return res.status(400).json({
          success: false,
          message: `Already enrolled in: ${course.courseName}`,
        });
      }

      // Add course price to total
      totalAmount += course.price;
    }

    // Razorpay order options
    const options = {
      amount: totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    // Create order
    const paymentResponse = await instance.orders.create(options);
    console.log("Razorpay Order Created:", paymentResponse);

    return res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
      error: error.message,
    });
  }
};

// the frontend must send courses again in the body of the verify payment API call:
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature || req.headers["x-razorpay-signature"];
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    })
  }

  try {
    for (const courseId of courses) {
      // 1. Find the course and enroll the student
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } }, // ✅ fixed spelling
        { new: true }
      )

      if (!enrolledCourse) {
        throw new Error("Course not found: " + courseId)
      }

      console.log("Updated course: ", enrolledCourse.courseName)

      // 2. Create course progress tracker
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })

      // 3. Update user record
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent.email)

      // 4. Send email
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )
    }

    // ✅ respond only once after all courses processed
    return res.status(200).json({
      success: true,
      message: "Student enrolled in selected courses",
    })

  } catch (error) {
    console.log("Enrollment error: ", error.message)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.enrollStudent = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide course IDs",
      });
    }

    for (const courseId of courses) {
      // 1. Add student to course
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found: " + courseId,
        });
      }

      // 2. Create course progress
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // 3. Update user
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // 4. Send email
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.log("Enrollment error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}