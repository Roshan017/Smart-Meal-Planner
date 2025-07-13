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
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
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

  return (
    <section className="relative flex h-screen fc-bg-primary text-white overflow-hidden">
      {/* Background image only on non-mobile */}
      
        <img
          src="/images/BG.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      

      {/* Blur overlay */}
      {!isMobile && <div className="bg-blurred z-10" />}

      {/* Form content */}
      <div className="relative z-20 flex w-full h-full">
        {/* Left placeholder */}
        <div className="hidden md:flex flex-col w-[45%] items-center justify-center h-full">
  <h1 className="tagline"> <ShinyText text={`“Take care of your body. It’s the only place you have to live.”`}/></h1>
  <p className="mt-4 text-3xl md:text-base text-gray-100 font-light italic tracking-wide author">
    — Jim Rohn
  </p>
</div>
        

        {/* Right - Signup Form */}
        <div className="w-full md:w-[55%] flex justify-center items-center px-6">
          <div className="w-full max-w-[480px] flex flex-col gap-2.5 fc-bg-card p-10 sm:p-12">
            <h1 className="text-3xl font-bold  text-center mb-6 text-black">
              Get Started Now
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="fc-form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className="fc-input"
                  placeholder="Enter your username"
                />
                {errors.username && <p className="fc-form-error">{errors.username.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
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
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="text-center text-sm fc-text-muted mt-6">
              Already have an account?{" "}
              <a href="/login" className="fc-link">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
