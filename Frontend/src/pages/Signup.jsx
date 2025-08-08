import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "../lib/validation";
import { signupuser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Loader from "../components/Shared/Loader";
import ShinyText from "../components/ui/ShinyText";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignupValidation),
  });

  const [loading, setLoading] = useState(false);
  const { checkAuthUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return isMobile ? (
    <div className="relative h-screen w-full flex flex-col">
      {/* Background */}
      <img
        src="/images/BG.png"
        alt="Background"
        className="absolute inset-0 w-full h-1/2 object-cover"
      />

      {/* Logo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 p-2 rounded-full">
        <img
          src="/images/Title.png"
          alt="ForkCast Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Curved SVG Form Container */}
      <div className="mt-auto relative">
        <div className="relative bg-white pt-10 px-7 pb-10 flex flex-col gap-8 rounded-t-3xl">
          <h1 className="text-2xl font-semibold font-mono text-black text-center ">
            Welcome!
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="border border-gray-300 rounded px-4 py-3 bg-white focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="border border-gray-300 rounded px-4 py-3 bg-white focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="border border-gray-300 rounded px-4 py-3 bg-white focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="bg-black text-white py-3 rounded mt-2"
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-black font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  ) : (
    // --- Desktop Layout (your old design) ---
    <section className="relative flex h-screen fc-bg-primary text-white overflow-hidden">
      <div className="absolute top-18 left-29 z-30 flex items-center gap-2">
        <img
          src="/images/Title.png"
          alt="ForkCast Logo"
          className="h-20 md:h-10 w-100%"
        />
      </div>

      <img
        src="/images/BG.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {!isMobile && <div className="bg-blurred z-10" />}

      <div className="relative z-20 flex w-full h-full">
        <div className="hidden md:flex flex-col w-[45%] items-center justify-center h-full">
          <h1 className="tagline">
            <ShinyText
              text={`“Take care of your body. It’s the only place you have to live.”`}
            />
          </h1>
          <p className="mt-4 text-3xl md:text-base text-gray-100 font-light italic tracking-wide author">
            — Jim Rohn
          </p>
        </div>

        <div className="w-full md:w-[55%] flex justify-center items-center px-6">
          <div className="w-full max-w-[480px] flex flex-col gap-2.5 fc-bg-card p-10 sm:p-12">
            <h1 className="text-3xl font-bold  text-center mb-6 text-black">
              Get Started Now
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="fc-form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className="fc-input"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="fc-form-error">{errors.username.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="fc-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="fc-input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="fc-form-error">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="fc-form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="fc-input"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="fc-form-error">{errors.password.message}</p>
                )}
              </div>
              <button type="submit" className="fc-button-primary">
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </form>
            <p className="text-center text-sm fc-text-muted mt-6 text-white">
              Already have an account?{" "}
              <a href="/login" className="fc-link">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
