import { useEffect, useState } from "react";
import { getCurrentUserApi } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Activity,
  Scale,
  Ruler,
  Target,
  Mars,
  Venus,
  Hash,
  ArrowBigLeft,
} from "lucide-react";

import ProfileCard from "../components/ui/ProfileCard";

const Profile = () => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserApi();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center px-4 sm:px-6 py-10 justify-center relative">
      {/* Top-left Dashboard Button */}
      <button
        className=" hidden absolute top-6 left-6 md:flex items-center gap-2 text-green-700 hover:text-green-900 smooth-spacing"
        onClick={() => nav("/dashboard")}
      >
        <ArrowBigLeft className="w-6 h-6" />
        DashBoard
      </button>
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border border-green-100 rounded-3xl max-w-6xl w-full p-6 sm:p-8">
        {/* Responsive layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Profile Summary */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 w-full lg:w-1/3">
            {/* Large Rectangular Profile Image */}
            <div className="w-full h-64 sm:h-80 bg-green-100 shadow overflow-hidden rounded-3xl">
              {user.image_url ? (
                <img
                  src={user.image_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-green-600" />
                </div>
              )}
            </div>

            {/* Username and Edit Button */}
            <div className="flex flex-col items-center lg:items-start w-full mt-4 gap-2">
              <div className="flex items-center justify-center lg:justify-start w-full gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-green-700 break-words">
                  {user.username}
                </h1>
                <button
                  className="cursor-pointer"
                  onClick={() => nav("/editprofile")}
                >
                  <img
                    src="./icons/edit.svg"
                    alt="Edit"
                    className="w-8 h-8"
                    style={{
                      filter:
                        "invert(32%) sepia(76%) saturate(400%) hue-rotate(85deg) brightness(92%) contrast(92%)",
                    }}
                  />
                </button>
              </div>
              <p className="text-gray-500 text-sm bg-green-100/80 px-4 py-1 rounded-4xl">
                {user.email}
              </p>
            </div>
          </div>

          {/* Right Side - Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-2/3">
            <ProfileCard
              icon={<Hash className="w-6 h-6 text-green-600" />}
              label="Age"
              value={user.age}
            />
            <ProfileCard
              icon={
                user.gender === "male" ? (
                  <Mars className="w-6 h-6 text-green-600" />
                ) : (
                  <Venus className="w-6 h-6 text-green-600" />
                )
              }
              label="Gender"
              valueClassName="capitalize"
              value={user.gender}
            />
            <ProfileCard
              icon={<Activity className="w-6 h-6 text-green-600" />}
              label="Activity Level"
              value={user.activity_level}
              valueClassName="capitalize"
            />
            <ProfileCard
              icon={<Target className="w-6 h-6 text-green-600" />}
              label="Goal"
              value={user.goal}
            />
            <ProfileCard
              icon={<Scale className="w-6 h-6 text-green-600" />}
              label="Weight"
              value={`${user.weight_kg} kg`}
            />
            <ProfileCard
              icon={<Ruler className="w-6 h-6 text-green-600" />}
              label="Height"
              value={`${user.height_cm} cm`}
            />
            <ProfileCard
              icon={<Mail className="w-6 h-6 text-green-600" />}
              label="Diet"
              valueClassName="capitalize"
              value={user.diet === "Whole30" ? "Non-veg" : "Veg"}
            />
            <ProfileCard
              icon={<Target className="w-6 h-6 text-green-600" />}
              label="Calorie Target"
              value={`${user.calorie_target} kcal`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center text-gray-400 text-sm">
          Member since{" "}
          {new Date(user.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
