// CustomTagsInput.jsx
import { TagsInput as OriginalTagsInput } from "react-tag-input-component"; // or your package
import React from "react";

export default function CustomTagsInput({ id, ...props }) {
  return (
    <OriginalTagsInput
      {...props}
      inputProps={{
        id, // ✅ forward the id
        ...(props.inputProps || {}),
      }}
    />
  );
}
