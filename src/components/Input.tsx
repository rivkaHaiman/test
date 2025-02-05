import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return <input {...props} className={`p-1 border rounded ${props.className || ""}`} />;
};

export default Input;
