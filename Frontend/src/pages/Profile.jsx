import { useEffect, useState } from "react";
import { getCurrentUserApi } from "../services/auth";
import { User, Mail, Activity, Scale, Ruler, Target } from "lucide-react";
import { Mars, Venus, Hash } from "lucide-react";

import ProfileCard from "../components/ui/ProfileCard";

const Profile = () => {
  const [user, setUser] = useState(null);

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
  console.log(user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center px-6 py-12">
      {/* Card Container */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border border-green-100 rounded-3xl max-w-2xl w-full p-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center shadow">
            <User className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 tracking-tight">
            {user.username}
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
            value={user.diet}
          />
          <ProfileCard
            icon={<Target className="w-6 h-6 text-green-600" />}
            label="Calorie Target"
            value={`${user.calorie_target} kcal`}
          />
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-gray-400 text-sm">
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
