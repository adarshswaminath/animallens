import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { FaEnvelope, FaCalendarAlt, FaUpload } from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

interface ProfileDataPropType {
  totalUploads: number;
}

export default function ProfileData({ totalUploads }: ProfileDataPropType) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <Image
            src={user?.photoURL || "/default-avatar.png"}
            height={120}
            width={120}
            className="rounded-full border-4 border-amber-500"
            alt="User profile image"
          />
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
            <HiCheckBadge className="text-white text-xl" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.displayName || "N/A"}
          </h2>
          <p className="text-gray-600 mb-4">{user?.email || "N/A"}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileCard
              icon={<FaEnvelope className="text-amber-500" />}
              title="Email"
              value={user?.email || "N/A"}
            />
            <ProfileCard
              icon={<FaCalendarAlt className="text-amber-500" />}
              title="Account Created"
              value={user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            />
            <ProfileCard
              icon={<HiCheckBadge className="text-amber-500" />}
              title="Email Verification"
              value={user?.emailVerified ? "Verified" : "Not Verified"}
            />
            <ProfileCard
              icon={<FaUpload className="text-amber-500" />}
              title="Total Uploads"
              value={totalUploads.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function ProfileCard({ icon, title, value }: ProfileCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}