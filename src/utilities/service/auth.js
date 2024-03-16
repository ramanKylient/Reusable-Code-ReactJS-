import axios from "axios";

// Exporting signIn function
export const signIn = async (user) => {
  try {
    // Make a POST request to the server using axios
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/auth/sign-in`,
      user
    );
    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there's an error, throw it to be caught by the caller
    throw error;
  }
};
