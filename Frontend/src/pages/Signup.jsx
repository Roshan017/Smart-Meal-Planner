import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "../lib/validation";
import { signupuser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Loader from "../components/Shared/Loader";

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(SignupValidation),
  });

  const [loading, setLoading] = useState(false);

  const { checkAuthUser } = useAuth();
  const navigate = useNavigate();

 const onSubmit = async (data) => {
  try {
    setLoading(true);
    const res = await signupuser(data);
    if (!res) throw new Error("Signup failed");

    const isAuthed = await checkAuthUser();
    if (isAuthed) {
      reset();
      navigate("/dashboard");
    } else {
      alert("Authentication check failed.");
    }
  } catch (err) {
    alert(err.message); // ✅ Show the actual message
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="flex h-screen bg-[#000000] text-white">
      {/* Left - Signup Form */}
      <div className="w-full md:w-[50%] flex justify-center items-center">
        <div className="w-[90%] sm:w-[400px] bg-[#09090A] p-8 rounded-lg shadow-lg">
          <h1 className="h3-bold text-center mb-6">Create New Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-white">Username</label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className="shad-input"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="shad-form_message">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-white">Email</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="shad-input"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="shad-form_message">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-white">Password</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="shad-input"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="shad-form_message">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="shad-button_primary px-4 py-2 rounded-lg"
            >
              {loading ? (<div className="flex-center gap-2"><Loader /></div>) : ("Sign Up")}
            </button>
          </form>

          <p className="text-center text-sm text-[#5C5C7B] mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#877EFF] hover:underline">Sign In</a>
          </p>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden md:block w-[50%]">
        <img
          src="/assets/login-illustration.png"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default Signup;
