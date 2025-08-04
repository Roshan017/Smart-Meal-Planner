import React from "react";

const ProfileCard = ({ icon, label, value, valueClassName = "" }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-lg font-semibold text-gray-800 ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
