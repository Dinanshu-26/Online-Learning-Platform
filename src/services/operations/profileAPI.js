import toast from "react-hot-toast";
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"
import { apiconnector } from "../apisconnector";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints;

export const getUserEnrolledCourses = async (token) => {
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const res = await apiconnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null, {
            Authorization: `Bearer ${token}`,
        }
        );

        if (!res?.data?.success) {
            throw new Error(res.data.message)
        }

        result = res.data.data;
    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId);
    return result;
}