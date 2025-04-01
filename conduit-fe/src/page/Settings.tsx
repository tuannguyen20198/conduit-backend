import SettingsForm from "@/component/SettingForms";
import { SettingsProps } from "@/interfaces/settings";
import React from "react";



const Settings: React.FC<SettingsProps> = ({ formData, isChanged, handleChange, handleSubmit, error }) => {
  return (
    <div className="settings-page">
      <div className="container page">
        <h1>Your Settings</h1>
        <SettingsForm
          formData={{
            ...formData,
            image: formData.image || "" // Đảm bảo image không bị undefined 
          }}
          isChanged={isChanged}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error={error}
        />
      </div>
    </div>
  );
};

export default Settings;
