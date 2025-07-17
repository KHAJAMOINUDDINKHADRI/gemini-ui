"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  phone: string;
  country: string;
  onBack: () => void;
};

export default function OtpInputForm({ phone, country, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Simulate sending OTP on mount
  useState(() => {
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (data.otp === "123456") {
        // Simulate successful login
        window.localStorage.setItem("auth", JSON.stringify({ phone, country }));
        window.location.href = "/dashboard";
      } else {
        setError("Invalid OTP. Try 123456 for demo.");
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {sent ? `OTP sent to ${country} ${phone}` : "Sending OTP..."}
      </p>
      <label className="block text-gray-900 dark:text-white">
        <span className="text-sm font-medium">OTP</span>
        <input
          {...register("otp")}
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white tracking-widest text-center text-lg"
          disabled={loading || !sent}
        />
        {errors.otp && (
          <span className="text-red-500 text-xs">{errors.otp.message}</span>
        )}
      </label>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading || !sent}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </form>
  );
}
