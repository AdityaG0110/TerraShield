import {
  DashboardData,
  SettlementListItem,
  SettlementDetail,
  RecommendationResponse,
  UserProfile,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api/v1";

export async function fetchDashboard(district?: string): Promise<DashboardData> {
  const url = district && district !== "All Districts"
    ? `${API_BASE}/dashboard?district=${encodeURIComponent(district)}`
    : `${API_BASE}/dashboard`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}

export async function fetchSettlements(params?: {
  district?: string;
  risk_category?: string;
  search?: string;
}): Promise<{ count: number; results: SettlementListItem[] }> {
  const query = new URLSearchParams();
  if (params?.district && params.district !== "All") query.append("district", params.district);
  if (params?.risk_category && params.risk_category !== "All") query.append("risk_category", params.risk_category);
  if (params?.search) query.append("search", params.search);

  const res = await fetch(`${API_BASE}/settlements?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch settlements");
  return res.json();
}

export async function fetchSettlementDetail(id: string): Promise<SettlementDetail> {
  const res = await fetch(`${API_BASE}/settlements/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch settlement detail");
  return res.json();
}

export async function recomputeSettlementRisk(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/risk/${id}/recompute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to recompute risk score");
  return res.json();
}

export async function recomputeAllRisks(): Promise<any> {
  const res = await fetch(`${API_BASE}/risk/recompute-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to recompute all risk scores");
  return res.json();
}

export async function fetchRecommendations(settlementId: string): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommendations/${settlementId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch relocation recommendations");
  return res.json();
}

export async function updateRecommendationStatus(id: string, status: string): Promise<any> {
  const res = await fetch(`${API_BASE}/recommendations/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update recommendation status");
  return res.json();
}

export async function fetchAvailableRoles(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/auth/roles`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

export async function mockLogin(email: string): Promise<{ success: boolean; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password" }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
