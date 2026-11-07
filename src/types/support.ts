import type { Paginated } from "./api";

export const SUPPORT_REASONS = [
  "ORDER_ISSUE",
  "PAYMENT",
  "DELIVERY",
  "RETURN_REFUND",
  "PRODUCT_QUALITY",
  "ACCOUNT",
  "OTHER",
] as const;
export type SupportReason = (typeof SUPPORT_REASONS)[number];

export type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

/** Same limits as the backend. */
export const SUPPORT_LIMITS = { descriptionMin: 20, textMax: 2000, maxActive: 5 } as const;

export type SupportMessage = {
  id: string;
  from: "CUSTOMER" | "SUPPORT";
  body: string;
  createdAt: string;
};

export type SupportTicketSummary = {
  id: string;
  ticketNumber: number;
  reason: SupportReason;
  status: SupportStatus;
  description: string;
  lastMessageAt: string;
  createdAt: string;
  /** null = no replies yet */
  lastReplyFrom: "CUSTOMER" | "SUPPORT" | null;
};

export type SupportTicket = SupportTicketSummary & {
  closedAt: string | null;
  messages: SupportMessage[];
};

export type SupportTicketPage = Paginated<SupportTicketSummary>;

export type NewSupportTicket = { reason: SupportReason; description: string };

/** "SUP-1042" */
export const ticketLabel = (n: number) => `SUP-${n}`;
