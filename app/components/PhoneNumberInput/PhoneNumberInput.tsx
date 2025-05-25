"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneNumberInput = () => {
  const [phone, setPhone] = useState("");

  return (
    <div>
      <label className="block text-lg font-medium">Phone Number</label>
      <PhoneInput
        country={"us"} // Default country
        value={phone}
        onChange={setPhone}
        inputStyle={{
          width: "100%",
          height: "40px",
          fontSize: "16px",
        }}
      />
      <p className="mt-2 text-sm text-gray-500">Selected: {phone}</p>
    </div>
  );
};

export default PhoneNumberInput;
