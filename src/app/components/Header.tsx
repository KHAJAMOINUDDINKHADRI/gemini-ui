"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="mx-auto w-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg flex items-center justify-between px-6 py-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-extrabold text-2xl text-blue-700 dark:text-blue-300 tracking-tight flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="32"
              height="32"
              viewBox="0 0 256 256"
              xmlSpace="preserve"
            >
              <g
                style={{
                  stroke: "none",
                  strokeWidth: 0,
                  strokeDasharray: "none",
                  strokeLinecap: "butt",
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 10,
                  fill: "none",
                  fillRule: "nonzero",
                  opacity: 1,
                }}
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <linearGradient
                  id="SVGID_1"
                  gradientUnits="userSpaceOnUse"
                  x1="60.0525"
                  y1="33.3396"
                  x2="34.8444"
                  y2="52.867"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "rgb(145,104,192)", stopOpacity: 1 }}
                  />
                  <stop
                    offset="34.300000000000004%"
                    style={{ stopColor: "rgb(86,132,209)", stopOpacity: 1 }}
                  />
                  <stop
                    offset="67.2%"
                    style={{ stopColor: "rgb(27,161,227)", stopOpacity: 1 }}
                  />
                </linearGradient>
                <path
                  d="M 90 45.09 C 65.838 46.573 46.573 65.838 45.09 90 h -0.18 C 43.43 65.837 24.163 46.57 0 45.09 v -0.18 C 24.163 43.43 43.43 24.163 44.91 0 h 0.18 C 46.573 24.162 65.838 43.427 90 44.91 V 45.09 z"
                  style={{
                    stroke: "none",
                    strokeWidth: 1,
                    strokeDasharray: "none",
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 10,
                    fill: "url(#SVGID_1)",
                    fillRule: "nonzero",
                    opacity: 1,
                  }}
                  transform=" matrix(1 0 0 1 0 0) "
                  strokeLinecap="round"
                />
              </g>
            </svg>
            Gemini{" "}
            <span className="font-light text-base text-gray-500 dark:text-gray-400">
              Clone
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
