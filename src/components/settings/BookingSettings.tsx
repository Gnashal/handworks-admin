"use client";

import { useEffect, useState } from "react";

type BookingSettingsType = {
  defaultStatus: string;
  allowDoubleBooking: boolean;
  minimumNoticeHours: number;
  requireDeposit: boolean;
  depositPercentage: number;
};

export default function BookingSettings() {
  const [data, setData] = useState<BookingSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings/bookings");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    await fetch("/api/settings/bookings", {
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

      {/* Default Status */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Default Booking Status
        </label>

        <select
          name="defaultStatus"
          value={data.defaultStatus}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      {/* Double Booking */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="allowDoubleBooking"
          checked={data.allowDoubleBooking}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">
          Allow Double Booking
        </label>
      </div>

      {/* Minimum Notice */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Minimum Booking Notice (hours)
        </label>

        <input
          type="number"
          name="minimumNoticeHours"
          value={data.minimumNoticeHours}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Require Deposit */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="requireDeposit"
          checked={data.requireDeposit}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">
          Require Deposit
        </label>
      </div>

      {/* Deposit % */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Deposit Percentage (%)
        </label>

        <input
          type="number"
          name="depositPercentage"
          value={data.depositPercentage}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Save Button */}
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