import api from "./api";

export const loginuser = async (cred) => {
  try {
    const res = await api.post('/auth/signin', cred);
    console.log("User logged in successfully:", res.data);

    const { access_token } = res.data;
    if (access_token) {
      localStorage.setItem("token", access_token); // ✅ Save token
    }

    return res.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const getCurrentUserApi = async () => {
  const token = localStorage.getItem("token"); // ✅ Get token
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const res = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token in header
      },
    });
    console.log("Current user data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
