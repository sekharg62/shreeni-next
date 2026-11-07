import { authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { NewSupportTicket, SupportTicket, SupportTicketPage } from "@/types/support";

/** The signed-in customer's support requests. Every call needs the customer token. */
export const supportService = {
  /** Most recent activity first. */
  async list(page = 1, limit = 10): Promise<SupportTicketPage> {
    const { data } = await authApiClient.get<SupportTicketPage>(ENDPOINTS.support.list, { params: { page, limit } });
    return data;
  },

  async get(id: string): Promise<SupportTicket> {
    const { data } = await authApiClient.get<SupportTicket>(ENDPOINTS.support.one(id));
    return data;
  },

  async create(input: NewSupportTicket): Promise<SupportTicket> {
    const { data } = await authApiClient.post<SupportTicket>(ENDPOINTS.support.list, input);
    return data;
  },

  /** Returns the ticket with the new message. */
  async reply(id: string, body: string): Promise<SupportTicket> {
    const { data } = await authApiClient.post<SupportTicket>(ENDPOINTS.support.messages(id), { body });
    return data;
  },

  async close(id: string): Promise<SupportTicket> {
    const { data } = await authApiClient.patch<SupportTicket>(ENDPOINTS.support.close(id));
    return data;
  },
};
