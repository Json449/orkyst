import { useEffect, useState } from "react";

export default function AddEventModal({
  isOpen,
  onSave,
  onClose,
  isEdit = false,
  state = { title: "", type: "", audienceFocus: "", theme: "" },
}) {
  useEffect(() => {
    if (isEdit) {
      setFormData(state);
    }
  }, [isEdit]);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    audienceFocus: "",
    theme: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear individual field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      console.log("sssss", formData, value);
      if (!value.trim()) newErrors[key] = "This field is required.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEdit ? "Edit" : "Add"} Calendar Event
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Launch Post on Instagram"
              className="text-gray-600 w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Event Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="text-gray-600 w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select type</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="blog">Blog</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Audience Focus */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Audience Focus
            </label>
            <input
              name="audienceFocus"
              value={formData.audienceFocus}
              onChange={handleChange}
              type="text"
              placeholder="e.g., South African Youth"
              className="text-gray-600 w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.audienceFocus && (
              <p className="text-red-500 text-xs mt-1">
                {errors.audienceFocus}
              </p>
            )}
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Theme
            </label>
            <input
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Clean Water Awareness Week"
              className="text-gray-600 w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.theme && (
              <p className="text-red-500 text-xs mt-1">{errors.theme}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-primary text-white transition"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
