import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: {
      city: "",
      district: "",
      state: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        const user = data?.user || data;
        setProfile(user);
        setForm({
          name: user.name || "",
          phone: user.phone || "",
          location: {
            city: user.location?.city || "",
            district: user.location?.district || "",
            state: user.location?.state || "",
          },
        });
      } catch (err) {
        const message =
          err.response?.data?.message || t("Failed to load profile");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatRole = (role) => {
    if (!role) return "";
    const map = {
      farmer: t("Farmer"),
      buyer: t("Buyer"),
      expert: t("Agriculture Expert"),
      admin: t("Admin"),
    };
    return map[role] || role;
  };

  const formatAddress = (location = {}) => {
    const parts = [location.district, location.city, location.state].filter(
      Boolean
    );
    return parts.join(", ") || "Not provided";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      location: {
        city: profile.location?.city || "",
        district: profile.location?.district || "",
        state: profile.location?.state || "",
      },
    });
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error(t("Name and phone are required"));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        location: {
          city: form.location.city,
          district: form.location.district,
          state: form.location.state,
        },
      };

      const { data } = await api.put("/users/me", payload);
      const updated = data?.user || data;
      setProfile(updated);
      setForm({
        name: updated.name || "",
        phone: updated.phone || "",
        location: {
          city: updated.location?.city || "",
          district: updated.location?.district || "",
          state: updated.location?.state || "",
        },
      });
      setEditing(false);
      toast.success(t("Profile updated"));
    } catch (err) {
      const message =
        err.response?.data?.message || t("Failed to update profile");
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="profile-card animate-pulse">
          <div className="h-4 bg-glass-light rounded w-24 mb-4"></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={idx === 4 ? "sm:col-span-2" : ""}>
                <div className="h-4 bg-glass-light rounded w-20 mb-3"></div>
                <div className="h-11 bg-glass-light rounded"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="profile-card text-red-500">
          <p className="font-semibold">{error}</p>
        </div>
      );
    }

    if (!profile) return null;

    return (
      <div className="profile-card neon-card animate-slideUp">
        <div className="flex items-center gap-3 mb-6">
          <div className="profile-avatar icon-glow">
            <FaUser className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {profile.name || "User"}
            </h2>
            <p className="text-sm text-text-secondary">
              {t("Your account details")}
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label={t("Full Name")}
            icon={<FaUser />}
            value={editing ? form.name : profile.name}
            editable={editing}
            name="name"
            onChange={handleChange}
          />
          <Field
            label={t("Email")}
            icon={<FaEnvelope />}
            value={profile.email}
          />
          <Field
            label={t("Phone")}
            icon={<FaPhone />}
            value={editing ? form.phone : profile.phone}
            editable={editing}
            name="phone"
            onChange={handleChange}
          />
          <Field
            label={t("Role")}
            icon={<FaIdBadge />}
            value={formatRole(profile.role)}
          />
          <Field
            label={t("Address")}
            icon={<FaMapMarkerAlt />}
            value={editing ? form.location : formatAddress(profile.location)}
            fullWidth
            editable={editing}
            name="location"
            onLocationChange={handleLocationChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          {editing ? (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  t("Saving...")
                ) : (
                  <>
                    <FaEdit /> {t("Save Changes")}
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <FaEdit /> {t("Edit Profile")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6 animate-slideUp">
          <p className="text-sm uppercase tracking-wide text-text-secondary font-semibold">
            {t("ACCOUNT")}
          </p>
          <h1 className="text-3xl font-bold text-gradient">
            {t("My Profile")}
          </h1>
          <p className="text-text-secondary mt-1">
            {t("View your Smart AgroConnect account information")}
          </p>
        </div>
        {renderBody()}
      </div>
    </div>
  );
};

const Field = ({
  label,
  icon,
  value,
  fullWidth,
  editable = false,
  name = "",
  onChange = () => {},
  onLocationChange = () => {},
}) => {
  const { t } = useLanguage();
  const locationValue = value || {};

  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="text-xs uppercase text-text-secondary font-semibold tracking-wide flex items-center gap-2 mb-1">
        <span className="text-gradient">{icon}</span>
        {label}
      </label>
      {editable ? (
        name === "location" ? (
          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="text"
              name="city"
              value={locationValue.city || ""}
              onChange={onLocationChange}
              placeholder={t("City")}
              className="input-edit"
            />
            <input
              type="text"
              name="district"
              value={locationValue.district || ""}
              onChange={onLocationChange}
              placeholder={t("District")}
              className="input-edit"
            />
            <input
              type="text"
              name="state"
              value={locationValue.state || ""}
              onChange={onLocationChange}
              placeholder={t("State")}
              className="input-edit"
            />
          </div>
        ) : (
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            className="input-edit"
          />
        )
      ) : (
        <div className="input-readonly">{value || t("Not provided")}</div>
      )}
    </div>
  );
};

export default Profile;
