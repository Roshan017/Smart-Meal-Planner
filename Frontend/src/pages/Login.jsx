import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninValidation } from "../lib/validation";
import { loginuser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Loader from "../components/Shared/Loader";
import ShinyText from "../components/ui/ShinyText";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SigninValidation),
  });

  const [loading, setLoading] = useState(false);
  const { checkAuthUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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

      {/* Curved Form Section with SVG */}
      <div className="mt-auto relative">
        {/* SVG wave top */}

        {/* White form container */}
        <div className="relative bg-white pt-20 px-8 pb-10 flex flex-col gap-5 rounded-t-3xl">
          <h1 className="text-2xl font-bold font-mono text-black">
            Welcome back.
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="bg-black text-white py-3 rounded mt-2"
            >
              {loading ? <Loader /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-black font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  ) : (
    // --- Desktop Layout (your old design) ---
    <section className="relative flex h-screen fc-bg-primary text-white overflow-hidden">
      <div
        className={`absolute top-15 z-30 flex justify-center items-center
        w-65 gap-2 border-[3px] border-[#ffffff]/41 h-35 bg-[#000000]/20 rounded-tl-[23px] rounded-tr-[15px] rounded-br-[103px] rounded-bl-[0px] left-25`}
      >
        <img
          src="/images/Title.png"
          alt="ForkCast Logo"
          className="h-auto md:h-16 w-auto relative right-2.5 bottom-1"
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
              text={`"Tell me what you eat, and I will tell you what you are."`}
            />
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-100 font-light italic tracking-wide author">
            — Jean Anthelme Brillat-Savarin
          </p>
        </div>

        <div className="w-full md:w-[55%] flex justify-center items-center px-6 text-white">
          <div className="w-full max-w-[480px] flex flex-col gap-2.5 fc-bg-card p-10 sm:p-12">
            <h1 className="text-3xl font-bold text-center mb-6 text-black">
              Welcome Back!
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1 text-white">
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
                {loading ? <Loader /> : "Login"}
              </button>
            </form>
            <p className="text-center text-white text-sm fc-text-muted mt-6">
              Don’t have an account?{" "}
              <a href="/signup" className="fc-link">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
