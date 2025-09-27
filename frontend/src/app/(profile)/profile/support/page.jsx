"use client";

import { useState } from "react";
import { useSupportActions } from "@/hooks/useSupports";
import TicketTable from "./_components/TicketTable";
import { AddNewTicket } from "./_components/SupportButtons";
import { toPersianDigits } from "@/utils/numberFormatter";
import {
  ChatBubbleLeftRightIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import {
  calculateUserUnreadCount,
  getTicketsWithAdminMessages,
  getTicketsWithUserMessages
} from "@/utils/ticketUtils";

function Support() {
  const [activeTab, setActiveTab] = useState("received");
  const { userTickets, isLoadingUserTickets } = useSupportActions();

  // Use utility functions to separate tickets
  const sentTickets = getTicketsWithUserMessages(userTickets) || [];
  const receivedTickets = getTicketsWithAdminMessages(userTickets) || [];

  // Use utility function to count unread messages
  const unreadCount = calculateUserUnreadCount(userTickets);

  return (
    <div className="min-h-screen bg-secondary-100 py-6">
      <div className="">
        <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-8 lg:mb-14">
          <h1 className="font-extrabold text-xl md:text-2xl order-1 flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            پنل پشتیبانی
          </h1>
          <div className="order-2 md:order-3">
            <AddNewTicket />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-secondary-0 rounded-lg shadow-sm border border-secondary-200 p-4 mb-6">
          <nav className="flex flex-col md:flex-row gap-3 md:gap-8">
            <button
              onClick={() => setActiveTab("received")}
              className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === "received"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              <InboxIcon className="w-4 h-4" />
              پاسخ‌های دریافتی ({toPersianDigits(receivedTickets.length)})
              {unreadCount > 0 && (
                <span className="badge badge--error text-xs">
                  {toPersianDigits(unreadCount)} جدید
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === "sent"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              تیکت‌های ارسالی ({toPersianDigits(sentTickets.length)})
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className=" ">
          {activeTab === "sent" ? (
            <TicketTable
              userTickets={sentTickets}
              isLoading={isLoadingUserTickets}
              isReceived={false}
            />
          ) : (
            <TicketTable
              userTickets={receivedTickets}
              isLoading={isLoadingUserTickets}
              isReceived={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Support;