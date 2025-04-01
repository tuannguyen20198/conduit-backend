import React from "react";
import { useSettings } from "@/hook/useSettings";
import Settings from "./Settings";

const SettingsPage: React.FC = () => {
  const { formData, error, isChanged, handleChange, handleSubmit } = useSettings();

  if (!formData) return <p>Loading user data...</p>;

  return (
    <Settings
    formData={{ ...formData, password: formData.password || "" }} // Đảm bảo `password` luôn là string
    isChanged={isChanged}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    error={error}
    />
  )

};

export default SettingsPage;
