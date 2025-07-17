"use client";
import { useState } from "react";
import PhoneInputForm from "@/components/auth/PhoneInputForm";
import OtpInputForm from "@/components/auth/OtpInputForm";

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded shadow">
        {step === "phone" ? (
          <PhoneInputForm
            onSuccess={(phone, country) => {
              setPhone(phone);
              setCountry(country);
              setStep("otp");
            }}
          />
        ) : (
          <OtpInputForm
            phone={phone}
            country={country}
            onBack={() => setStep("phone")}
          />
        )}
      </div>
    </div>
  );
}
