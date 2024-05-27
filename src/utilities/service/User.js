import axiosHandler from "../../interceptor/axiosInterceptor";

// Exporting signIn function
export const userAdd = async (userData) => {
  try {
    // Make a POST request to the server using axios
    const response = await axiosHandler.post("/user/add", userData);
    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there's an error, throw it to be caught by the caller
    throw error;
  }
};

// Exporting updateUser function
export const updateUser = async (userId, updatedUserData) => {
  try {
    // Make a PUT request to the server using axios
    const response = await axiosHandler.put(
      `/user/edit-user/${userId}`,
      updatedUserData
    );
    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there's an error, throw it to be caught by the caller
    throw error;
  }
};

// Exporting getUser function
export const getUser = async () => {
  try {
    // Make a GET request to the server using axios
    const response = await axiosHandler.get(`/user/details`);
    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there's an error, throw it to be caught by the caller
    throw error;
  }
};

// Exporting deleteUser function
export const deleteUser = async (userId) => {
  try {
    // Make a DELETE request to the server using axios
    const response = await axiosHandler.delete(`/user/delete/${userId}`);
    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there's an error, throw it to be caught by the caller
    throw error;
  }
};
