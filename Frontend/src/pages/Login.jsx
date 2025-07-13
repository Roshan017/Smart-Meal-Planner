/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SigninValidation } from "../lib/validation";
import { loginuser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Loader from "../components/Shared/Loader";

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(SigninValidation),
  });

  const [loading, setLoading] = useState(false);

  const { checkAuthUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginuser(data);
      if (!res) throw new Error("Login failed");

      const isAuthed = await checkAuthUser();
      if (isAuthed) {
        reset();
        navigate("/dashboard");
      } else {
        alert("Authentication check failed.");
      }
    } catch (err) {
      alert("Login failed. Please check credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-screen bg-[#000000] text-white">
  {/* Left - Login Form */}
  <div className="w-full md:w-[50%] flex justify-center items-center">
    <div className="w-[90%] sm:w-[400px] bg-[#09090A] p-8 rounded-lg shadow-lg">
      <h1 className="h3-bold text-center mb-6">Login to your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

          <button
            type="submit"
            className="shad-button_primary px-4 py-2 rounded-lg "
          >
            {
              loading ? (<div className="flex-center gap-2"><Loader /></div>) : ("Login")
            }
          </button>
              </form>

              <p className="text-center text-sm text-[#5C5C7B] mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#877EFF] hover:underline">Sign Up</a>
              </p>
            </div>
          </div>

          {/* Right - Image */}
  <div className="hidden md:block w-[50%]">
    <img
      src="/assets/login-illustration.png" // Change to your actual image path
      alt="Login Illustration"
      className="w-full h-full object-cover"
    />
  </div>
</section>

  );
};

export default Login;
