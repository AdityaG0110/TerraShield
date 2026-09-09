export type RiskCategory = "safe" | "watch" | "red_zone" | "critical";

export interface FactorContribution {
  factor: string;
  raw_value: number;
  normalized: number;
  weight: number;
  points: number;
  description?: string;
}

export interface SettlementListItem {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  households: number;
  land_area_km2: number;
  risk_category: RiskCategory;
  risk_score: number;
  critical_factors: string[];
  created_at: string;
}

export interface HazardData {
  id: string;
  rainfall_mm: number;
  slope_degrees: number;
  elevation_m: number;
  population_density: number;
  recorded_at: string;
}

export interface HistoricalIncident {
  id: string;
  hazard_type: "flood" | "landslide" | "cyclone" | "earthquake";
  severity: number;
  incident_date: string;
}

export interface RiskAssessmentSummary {
  id: string;
  risk_score: number;
  risk_category: RiskCategory;
  factor_breakdown: FactorContribution[];
  assessed_at: string;
}

export interface SettlementDetail {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  households: number;
  land_area_km2: number;
  created_at: string;
  latest_hazard?: HazardData;
  latest_risk?: RiskAssessmentSummary;
  historical_incidents: HistoricalIncident[];
  explanation?: string;
}

export interface CandidateSite {
  id?: string;
  candidate_name: string;
  candidate_latitude: number;
  candidate_longitude: number;
  distance_km: number;
  capacity_score: number;
  distance_score: number;
  accessibility_score: number;
  recommendation_score: number;
  status: "proposed" | "approved" | "in_progress" | "completed";
  created_at?: string;
}

export interface RecommendationResponse {
  source_settlement_id: string;
  source_settlement_name: string;
  source_district: string;
  source_population: number;
  source_risk_score: number;
  source_risk_category: RiskCategory;
  candidates: CandidateSite[];
}

export interface PriorityQueueItem {
  settlement_id: string;
  name: string;
  district: string;
  priority_rank: number;
  risk_score: number;
  risk_category: RiskCategory;
  population: number;
  relocation_status: string;
}

export interface DistrictRiskStat {
  district: string;
  total_settlements: number;
  red_zones: number;
  critical_zones: number;
  population_at_risk: number;
  average_risk_score: number;
}

export interface DashboardData {
  total_settlements: number;
  population_at_risk: number;
  red_zones: number;
  critical_zones: number;
  safe_zones: number;
  watch_zones: number;
  active_district: string;
  relocation_priority_queue: PriorityQueueItem[];
  district_summaries: DistrictRiskStat[];
  risk_category_distribution: Record<string, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "dm" | "dmo" | "state_authority" | "relief_team" | "admin";
  role_label: string;
  jurisdiction_district?: string | null;
  jurisdiction_state: string;
  permissions: string[];
}
