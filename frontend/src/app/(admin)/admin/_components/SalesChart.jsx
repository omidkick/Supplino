"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { usePaymentActions } from "@/hooks/usePayments";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import { ChartBarIcon, TrendingUpIcon } from "@heroicons/react/24/outline";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart({ payments }) {
  // Filter only COMPLETED payments
  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED"
  );

  // Group COMPLETED payments by day
  const groupPaymentsByDay = () => {
    const dailySales = {};

    completedPayments.forEach((payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString("fa-IR");

      if (!dailySales[date]) {
        dailySales[date] = 0;
      }

      dailySales[date] += payment.amount;
    });

    return dailySales;
  };

  const dailySales = groupPaymentsByDay();

  // Get last 7 days for display
  const dates = Object.keys(dailySales).sort().slice(-7);
  const salesData = dates.map((date) => dailySales[date]);

  // Enhanced gradient colors with more sophisticated color mapping
  const generateGradientColors = (data) => {
    const maxSale = Math.max(...data);
    const minSale = Math.min(...data);

    return data.map((value) => {
      const ratio =
        maxSale > minSale ? (value - minSale) / (maxSale - minSale) : 0.5;

      // More sophisticated color mapping using primary colors
      if (ratio < 0.15) return "rgba(146, 167, 255, 0.3)";
      if (ratio < 0.35) return "rgba(128, 153, 255, 0.5)";
      if (ratio < 0.55) return "rgba(110, 138, 255, 0.7)";
      if (ratio < 0.75) return "rgba(92, 124, 255, 0.85)";
      return "rgba(74, 109, 255, 1)";
    });
  };

  const backgroundColors = generateGradientColors(salesData);

  // Chart data configuration
  const data = {
    labels: dates,
    datasets: [
      {
        label: "پرداخت‌های تکمیل شده",
        data: salesData,
        backgroundColor: backgroundColors,
        borderColor: "rgba(74, 109, 255, 0.8)",
        borderWidth: 0,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
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
        displayColors: false,
        callbacks: {
          title: function (context) {
            return `تاریخ: ${context[0].label}`;
          },
          label: function (context) {
            const value = context.raw;
            return `مبلغ: ${formatPrice(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
          color: "rgba(107, 114, 128, 0.2)",
        },
        border: {
          display: true,
          color: "rgba(107, 114, 128, 0.3)",
        },
        ticks: {
          font: {
            family: 'var(--font-iranYekan), "Segoe UI", system-ui, sans-serif',
            size: 12,
            weight: "500",
          },
          color: "rgba(107, 114, 128, 1)",
          maxRotation: 0,
          padding: 10,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
          color: "rgba(107, 114, 128, 0.2)",
        },
        border: {
          display: true,
          color: "rgba(107, 114, 128, 0.3)",
        },
        ticks: {
          font: {
            family: 'var(--font-iranYekan), "Segoe UI", system-ui, sans-serif',
            size: 12,
            weight: "500",
          },
          color: "rgba(107, 114, 128, 1)",
          padding: 15,
          callback: function (value) {
            return formatPrice(value);
          },
        },
      },
    },
  };

  // Calculate total completed sales and growth metrics
  const totalCompletedSales = completedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const averageDailySales =
    salesData.length > 0 ? totalCompletedSales / salesData.length : 0;
  const todaySales = salesData[salesData.length - 1] || 0;
  const growthRate =
    salesData.length > 1
      ? ((todaySales - salesData[salesData.length - 2]) /
          (salesData[salesData.length - 2] || 1)) *
        100
      : 0;

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 md:mb-6">
        <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2">
          <ChartBarIcon className="w-6 md:w-7 h-6 md:h-7 text-primary-900" />
          آمار پرداخت‌ها
        </h2>

        {/* Growth Indicator */}
        <div className="flex items-center gap-2 bg-secondary-50 px-3 py-2 rounded-xl">
          <svg
            className={`w-4 h-4 ${
              growthRate >= 0 ? "text-green-600" : "text-red-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                growthRate >= 0
                  ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              }
            />
          </svg>
          <span
            className={`text-sm font-semibold ${
              growthRate >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {toPersianDigits(Math.abs(growthRate).toFixed(1))}%
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary-50 backdrop-blur-sm p-4 rounded-xl border border-secondary-100">
          <div className="text-xs text-secondary-500 mb-1">کل فروش</div>
          <div className="text-lg font-bold text-secondary-800">
            {formatPrice(totalCompletedSales)}
          </div>
        </div>
        <div className="bg-secondary-50 backdrop-blur-sm p-4 rounded-xl border border-secondary-100">
          <div className="text-xs text-secondary-500 mb-1">میانگین روزانه</div>
          <div className="text-lg font-bold text-secondary-800">
            {formatPrice(averageDailySales)}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-72 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-50/30 to-transparent rounded-xl pointer-events-none"></div>
        <Bar data={data} options={options} />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-secondary-100 px-4">
        <div className="flex items-center justify-between text-xs text-secondary-500">
          <span>آخرین بروزرسانی: الان</span>
          <span>{salesData.length} روز گذشته</span>
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
