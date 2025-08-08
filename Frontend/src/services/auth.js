import api from "./api";

export const loginuser = async (cred) => {
  try {
    const res = await api.post("/auth/signin", cred);
    console.log("User logged in successfully");

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

export const signupuser = async (cred) => {
  try {
    const res = await api.post("/auth/signup", cred);
    console.log("User signed up successfully");
    const { access_token } = res.data;

    if (access_token) {
      localStorage.setItem("token", access_token); // ✅ Save token
    }

    return res.data;
  } catch (e) {
    if (e.response && e.response.status === 400) {
      throw new Error(e.response.data.detail || "User already exists");
    }
    console.error("Error signing up user:", e);
    throw new Error("Something went wrong during signup");
  }
};

export const getCurrentUserApi = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const UpdateUser = async (cred) => {
  try {
    const res = api.post("/details", cred);
    console.log("Profile Updated");
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
