import { SettingsFormProps } from "@/interfaces/settings";
import React from "react";



const SettingsForm: React.FC<SettingsFormProps> = ({ formData, isChanged, handleChange, handleSubmit, error }) => {
  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        {error && <div className="alert alert-danger">{error}</div>}
        {["image", "username", "bio", "email", "password"].map((field) => (
          <fieldset key={field} className="form-group">
            {field === "bio" ? (
              <textarea
                className="form-control form-control-lg"
                rows={8}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Short bio about you"
              />
            ) : (
              <input
                className="form-control form-control-lg"
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={
                  field === "password"
                    ? "New Password (leave blank if not changing)"
                    : `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`
                }
              />
            )}
          </fieldset>
        ))}

      <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={!isChanged}>
        Update Settings
      </button>
      </fieldset>
    </form>
  );
};

export default SettingsForm;
