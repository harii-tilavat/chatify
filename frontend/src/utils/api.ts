import { toast } from "react-toastify";

export const handleApiError = (error: any, showToast = true) => {
    // Extract the error message from the response or use a default message
    const message =
        error.response?.data.message || error.message || "An unknown error occurred.";

    // Optionally log the error for debugging purposes
    console.error("API Error:", message);
    if (showToast) {
        toast.error(message);
    }
    // Throw a new error with the message
    throw new Error(message);
};