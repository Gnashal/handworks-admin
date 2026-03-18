"use client";

import { useEffect, useState } from "react";

type BusinessSettingsType = {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  taxRate: number;
};

export default function BusinessSettings() {
  const [data, setData] = useState<BusinessSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/settings/business");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!data) return;

    setData({
      ...data,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);

    await fetch("/api/settings/business", {
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

      <div>
        <label className="block text-sm font-medium mb-1">
          Business Name
        </label>
        <input
          name="businessName"
          value={data.businessName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Contact Email
        </label>
        <input
          name="contactEmail"
          value={data.contactEmail}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Contact Phone
        </label>
        <input
          name="contactPhone"
          value={data.contactPhone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Address
        </label>
        <input
          name="address"
          value={data.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Currency
        </label>
        <input
          name="currency"
          value={data.currency}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tax Rate (%)
        </label>
        <input
          type="number"
          name="taxRate"
          value={data.taxRate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

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