"use client";

import { useEffect, useState } from "react";

type EmployeeSettingsType = {
  allowEmployeeLogin: boolean;
  defaultRole: string;
  autoAssignBookings: boolean;
  maxBookingsPerDay: number;
  enablePerformanceTracking: boolean;
};

export default function EmployeeSettings() {
  const [data, setData] = useState<EmployeeSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings/employees");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!data) return;

    const { name, value, type } = e.target;

    setData({
      ...data,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);

    await fetch("/api/settings/employees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div className="space-y-6 max-w-xl">

      {/* Allow Login */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="allowEmployeeLogin"
          checked={data.allowEmployeeLogin}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">
          Allow Employee Login
        </label>
      </div>

      {/* Default Role */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Default Employee Role
        </label>

        <select
          name="defaultRole"
          value={data.defaultRole}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {/* Auto Assign */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="autoAssignBookings"
          checked={data.autoAssignBookings}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">
          Automatically Assign Bookings
        </label>
      </div>

      {/* Max bookings */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Max Bookings Per Employee Per Day
        </label>

        <input
          type="number"
          name="maxBookingsPerDay"
          value={data.maxBookingsPerDay}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Performance tracking */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="enablePerformanceTracking"
          checked={data.enablePerformanceTracking}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">
          Enable Employee Performance Tracking
        </label>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}