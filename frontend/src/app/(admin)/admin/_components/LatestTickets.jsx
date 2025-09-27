"use client";

import { useQuery } from "@tanstack/react-query";
import Loading from "@/ui/Loading";
import Empty from "@/ui/Empty";
import { getAllTickets } from "@/services/supportService";
import SupportTable from "../support/_components/SupportTable";
import { useLatestTickets } from "@/hooks/useSupports";

function LatestTickets() {
  const { data, isLoading, error } = useLatestTickets();

  const { tickets } = data || {};

  if (isLoading) return <Loading />;
  if (!tickets?.length) return <Empty resourceName="تیکتی" />;

  return <SupportTable tickets={tickets} />;
}

export default LatestTickets;
