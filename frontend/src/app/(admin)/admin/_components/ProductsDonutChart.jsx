"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function ProductsDonutChart({ products }) {
  // Sort products by saleCount and take top 5-6
  const topProducts = [...products]
    .sort((a, b) => b.saleCount - a.saleCount)
    .slice(0, 6);

  // Calculate total sales for percentage calculation
  const totalSales = topProducts.reduce(
    (sum, product) => sum + product.saleCount,
    0
  );

  // Generate colors based on the same scheme as SalesChart
  const backgroundColors = [
    "rgba(74, 109, 255, 1)", // Primary blue (highest sales)
    "rgba(92, 124, 255, 0.85)",
    "rgba(110, 138, 255, 0.7)",
    "rgba(128, 153, 255, 0.5)",
    "rgba(146, 167, 255, 0.3)",
    "rgba(164, 182, 255, 0.2)", // Lightest blue (lowest sales)
  ];

  // Chart data configuration
  const data = {
    labels: topProducts.map((product) => product.title),
    datasets: [
      {
        data: topProducts.map((product) => product.saleCount),
        backgroundColor: backgroundColors,
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        rtl: true,
        labels: {
          font: {
            family: 'var(--font-iranYekan), "Segoe UI", system-ui, sans-serif',
            size: 12,
          },
          color: "rgba(107, 114, 128, 1)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        rtl: true,
        backgroundColor: "rgba(55, 65, 81, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          family: 'var(--font-iranYekan), "Segoe UI", system-ui, sans-serif',
          size: 14,
          weight: "600",
        },
        bodyFont: {
          family: 'var(--font-iranYekan), "Segoe UI", system-ui, sans-serif',
          size: 13,
          weight: "500",
        },
        borderColor: "rgba(74, 109, 255, 0.3)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = ((value / totalSales) * 100).toFixed(1);
            return `${context.label}: ${toPersianDigits(
              value
            )} فروش (${toPersianDigits(percentage)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="shadow-lg shadow-secondary-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2">
          <svg
            className="w-6 md:w-7 h-6 md:h-7 text-primary-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
          پرفروش‌ترین محصولات
        </h2>
      </div>

      {/* Chart Container */}
      <div className="h-72 relative">
        <Doughnut data={data} options={options} />

        {/* Center text for donut chart */}
        <div className="absolute top-[28%] right-[38%] md:inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-secondary-500">مجموع فروش</span>
          <span className="text-xl font-bold text-secondary-800">
            {toPersianDigits(totalSales)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className=" mt-4 pt-4 border-t border-secondary-100">
        <div className="flex items-center justify-between text-xs text-secondary-500">
          <span>بر اساس تعداد فروش</span>
          <span>{topProducts.length} محصول برتر</span>
        </div>
      </div>
    </div>
  );
}

export default ProductsDonutChart;
