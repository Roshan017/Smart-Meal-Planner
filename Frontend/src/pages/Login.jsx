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
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
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

  return (
    <section className="relative flex h-screen fc-bg-primary text-white overflow-hidden">
  {/* Fullscreen Background Image (hidden on mobile) */}

     <div className={`absolute top-18 left-29 z-30 flex items-center gap-2 ${isMobile ? "bg-gray-50 p-1 h-100% rounded-2xl" : ""}`}>
    <img
      src="/images/Title.png" // replace with your actual file
      alt="ForkCast Logo"
      className="h-20 md:h-10 w-100%"
    />
  </div>
  
    <img
      src="/images/BG.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
 

  {/* Glass Blur Overlay */}
  {!isMobile && <div className="bg-blurred z-10" />}

  {/* Main Content */}
  <div className="relative z-20 flex w-full h-full">
    {/* Left Placeholder (no image now, as background is global) */}
    <div className="hidden md:flex flex-col w-[45%] items-center justify-center h-full">
  <h1 className="tagline"> <ShinyText text={`"Tell me what you eat, and I will tell you what you are."`}/></h1>
  <p className="mt-4 text-sm md:text-base text-gray-100 font-light italic tracking-wide author">
    — Jean Anthelme Brillat-Savarin
  </p>
</div>

    {/* Right - Login Form */}
    <div className="w-full md:w-[55%] flex justify-center items-center px-6 text-white">
      <div className="w-full max-w-[480px] flex flex-col gap-2.5 fc-bg-card p-10 sm:p-12">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Welcome Back!
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="email" className="fc-form-label">Email</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="fc-input"
              placeholder="Enter your email"
            />
            {errors.email && <p className="fc-form-error">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="fc-form-label">Password</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="fc-input"
              placeholder="Enter your password"
            />
            {errors.password && <p className="fc-form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="fc-button-primary">
            {loading ? (
              <div className="flex-center gap-2"><Loader /></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-white text-sm fc-text-muted mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="fc-link">Sign Up</a>
        </p>
      </div>
    </div>
  </div>
</section>

  );
};

export default Login;
