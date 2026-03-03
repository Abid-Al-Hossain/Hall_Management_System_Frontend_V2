import React, { useState } from "react";
import { User, Bell, AlertCircle, Key, CheckCircle } from "lucide-react";
import { useMockData } from "../../context/MockDataContext";

const SettingsSub: React.FC = () => {
  const { currentUser, updateUserProfile } = useMockData();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || "Manager");
  const [phone, setPhone] = useState("+880 1234-567890");
  const [designation, setDesignation] = useState("Senior Hall Manager");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    // Trigger Profile Update if we are on the profile tab
    if (activeTab === "profile") {
      updateUserProfile({
        name,
        phone: phone,
        designation: designation,
      } as any);
    }

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-xl shadow-lg transition-all font-semibold ${
            isSaved
              ? "bg-green-500 shadow-green-100"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          } ${isSaving ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle size={20} />
          )}
          {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 shrink-0 h-fit">
          <nav className="space-y-2">
            {[
              { id: "profile", label: "Profile Information", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              {
                id: "security",
                label: "Security & Privacy",
                icon: AlertCircle,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {activeTab === "profile" && (
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your personal information and contact details.
                </p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                  {currentUser?.name?.charAt(0) || "M"}
                </div>
                <div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={currentUser?.email || "manager@test.com"}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Notification Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Control when and how you receive administrative alerts.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "New Complaints",
                    desc: "Get notified when a student submits a new maintenance or security complaint.",
                    defaultChecked: true,
                  },
                  {
                    title: "Payment Confirmations",
                    desc: "Receive an alert when a large hall fee payment is cleared.",
                    defaultChecked: true,
                  },
                  {
                    title: "Weekly Reports",
                    desc: "Receive automated weekly summaries of occupancy and revenue.",
                    defaultChecked: false,
                  },
                  {
                    title: "System Updates",
                    desc: "Notifications about planned maintenance for the management portal.",
                    defaultChecked: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="pr-4">
                      <p className="font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        defaultChecked={item.defaultChecked}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Security Settings
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your password and platform security.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <button className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  <Key size={16} />
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSub;
