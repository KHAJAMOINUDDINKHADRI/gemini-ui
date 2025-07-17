"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits"),
});

type FormData = z.infer<typeof schema>;

type Country = {
  name: { common: string };
  idd: { root: string; suffixes?: string[] };
  cca2: string;
  flags: { svg: string };
};

type Props = {
  onSuccess: (phone: string, country: string) => void;
};

export default function PhoneInputForm({ onSuccess }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags")
      .then((res) => res.json())
      .then((data) => {
        setCountries(
          data.filter(
            (c: Country) =>
              c.idd && c.idd.root && c.idd.suffixes && c.idd.suffixes.length > 0
          )
        );
        setLoading(false);
      });
  }, []);

  const onSubmit = (data: FormData) => {
    onSuccess(data.phone, data.country);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Login / Signup
      </h2>
      <label className="block text-gray-900 dark:text-white">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Country
        </span>
        <select
          {...register("country")}
          className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          disabled={loading}
        >
          <option value="">Select country</option>
          {countries.map((c) =>
            c.idd.suffixes?.map((suffix) => {
              const dialCode = `${c.idd.root}${suffix}`;
              return (
                <option key={c.cca2 + suffix} value={dialCode}>
                  {c.name.common} ({dialCode})
                </option>
              );
            })
          )}
        </select>
        {errors.country && (
          <span className="text-red-500 text-xs">{errors.country.message}</span>
        )}
      </label>
      <label className="block text-gray-900 dark:text-white">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Phone Number
        </span>
        <input
          {...register("phone")}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter phone number"
          className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          onInput={(e) => {
            // @ts-ignore
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        {errors.phone && (
          <span className="text-red-500 text-xs">{errors.phone.message}</span>
        )}
      </label>
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Loading countries..." : "Send OTP"}
      </button>
    </form>
  );
}
