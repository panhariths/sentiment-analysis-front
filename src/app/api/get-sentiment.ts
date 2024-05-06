"use server";

import { API_URL } from "@/constants/api";
import { fetchRequest } from "@/lib/fetch-wrapper";

export interface GetSentimentResponse {
  sentiments: number[];
}

export interface GetSentimentBody {
  text: string;
}

export async function getSentiment(requestBody: GetSentimentBody) {
  const url = `${API_URL}/sentiment`;

  return fetchRequest<GetSentimentResponse>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
}
