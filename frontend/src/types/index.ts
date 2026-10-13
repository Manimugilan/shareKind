export type UserRole = 'DONOR' | 'NGO' | 'SUPPLIER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  verified?: boolean;
  avatar?: string;
  location?: string;
}

export type DonationCategory = 'food' | 'groceries' | 'clothing' | 'general';

export type DonationStatus = 'allocated' | 'procured' | 'dispatched' | 'delivered' | 'confirmed' | 'pending_allocation';

export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  amount: number;
  category: DonationCategory;
  ngo_id: string;
  ngo_name: string;
  status: DonationStatus;
  date: string;
  impact: string;
  is_demo: boolean;
  payment_ref?: string;
}

export interface NGONeed {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  category: DonationCategory;
  target_quantity: number;
  fulfilled_quantity: number;
  budget_estimate: number;
  urgency: 'Urgent' | 'High' | 'Medium';
  status: 'open' | 'procured' | 'dispatched' | 'delivered' | 'confirmed_distribution';
  location: string;
  created_at: string;
  is_demo: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: DonationCategory;
  unit_price: number;
  delivery_fee: number;
  available_quantity: number;
  delivery_hours: number;
  reliability_score: number; // 0.0 - 1.0
  verified: boolean;
  service_area: string;
}

export type OrderStatus = 'placed' | 'accepted' | 'in_preparation' | 'dispatched' | 'delivered' | 'confirmed_distribution';

export interface OrderHistoryEvent {
  status: OrderStatus;
  time: string;
  actor: string;
}

export interface ProcurementOrder {
  id: string;
  need_id: string;
  ngo_id: string;
  ngo_name: string;
  supplier_id: string;
  supplier_name: string;
  category: DonationCategory;
  quantity: number;
  unit_price: number;
  delivery_fee: number;
  total_cost: number;
  status: OrderStatus;
  created_at: string;
  history: OrderHistoryEvent[];
  impact_summary: string;
  is_demo?: boolean;
}

export interface AuditLog {
  audit_id: string;
  timestamp: number;
  iso_time: string;
  action: string;
  user_id: string;
  user_role: UserRole;
  resource_id: string;
  details: Record<string, any>;
  is_demo: boolean;
}

export interface SupplierScoreResult {
  supplier_id: string;
  supplier_name: string;
  category: string;
  unit_price: number;
  delivery_fee: number;
  total_procurement_cost: number;
  composite_score: number;
  is_recommended: boolean;
  factor_scores: {
    cost_efficiency: number;
    reliability_trust: number;
    fulfillment_speed: number;
    stock_capacity: number;
  };
  explainability_reasons: string[];
}

export interface AIForecastReport {
  model_type: string;
  training_samples: number;
  historical_30d_volume: Record<string, number>;
  projected_14d_demand: Record<string, number>;
  underserved_alerts: { category: string; urgency_level: string; reason: string }[];
  confidence_interval: string;
}
