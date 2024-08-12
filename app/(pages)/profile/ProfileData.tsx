import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { FaUserAlt, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { HiCheckBadge } from "react-icons/hi2";

interface profileDataPropType {
    totalUploads: number
}


export default function ProfileData({totalUploads}:profileDataPropType) {
  const { user } = useAuth();

  return (
    <div className="p-6 shadow-xl rounded-lg bg-white mt-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-2 bg-amber-600 rounded-full" />
        <h3 className="text-3xl font-semibold">User Profile</h3>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Image
          src={user?.photoURL || "/default-avatar.png"}
          height={100}
          width={100}
          className="rounded-full border-2 border-gray-200"
          alt="User profile image"
        />
        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            {user?.displayName || "N/A"}
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="text-lg border border-amber-600  text-gray-600 mt-2 p-2 rounded-xl">
              <span className="flex items-center gap-3 text-xl font-bold">
                {" "}
                <FaEnvelope /> Email
              </span>
              <span>{user?.email || "N/A"}</span>
            </div>

            {/* second box */}
            {user?.metadata?.creationTime && (
              <div className="text-lg border border-amber-600  text-gray-600 mt-2 p-2 rounded-xl">
                <span className="flex items-center gap-3 text-xl font-bold">
                  <FaCalendarAlt />
                  Account Created:{" "}
                </span>
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </div>
            )}
            {/* third box */}
            <div className="text-lg border border-amber-600  text-gray-600 mt-2 p-2 rounded-xl">
             <span className="flex items-center gap-3 text-xl font-bold"> <HiCheckBadge/>  Email Verification</span>
              <span>{user?.email || "N/A"}</span>
            </div>
            {/* fourth box */}
            <div className="text-lg border border-amber-600  text-gray-600 mt-2 p-2 rounded-xl flex flex-col items-center">
             <span className="flex items-center gap-3 text-xl font-bold"> <FaUpload/> Total Uploads</span>
              <span className="etxt-center">{totalUploads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
