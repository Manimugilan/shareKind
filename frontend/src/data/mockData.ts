import { User, Donation, NGONeed, Supplier, ProcurementOrder, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'donor-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'DONOR',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    location: 'Metro Downtown'
  },
  {
    id: 'donor-2',
    name: 'David Chen',
    email: 'dchen@example.com',
    role: 'DONOR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'West District'
  },
  {
    id: 'donor-3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    role: 'DONOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'South District'
  },
  {
    id: 'donor-4',
    name: 'Marcus Washington',
    email: 'marcus.w@example.com',
    role: 'DONOR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'North District'
  },
  {
    id: 'donor-5',
    name: 'Amina Patel',
    email: 'amina.p@example.com',
    role: 'DONOR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'East Suburbs'
  },
  {
    id: 'ngo-1',
    name: 'Hope Haven Shelter',
    email: 'director@hopehaven.org',
    role: 'NGO',
    organizationName: 'Hope Haven Community Shelter',
    verified: true,
    location: 'Metro Downtown',
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'ngo-2',
    name: 'Sunrise Child Foundation',
    email: 'admin@sunrisechild.org',
    role: 'NGO',
    organizationName: 'Sunrise Child Care & Orphanage',
    verified: true,
    location: 'North Suburbs',
    avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'ngo-3',
    name: 'GreenLeaf Elder Care',
    email: 'care@greenleaf.org',
    role: 'NGO',
    organizationName: 'GreenLeaf Senior Residence & Support',
    verified: true,
    location: 'East Valley',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'ngo-4',
    name: 'Grace Community Kitchen',
    email: 'info@gracekitchen.org',
    role: 'NGO',
    organizationName: 'Grace Community Soup Kitchen',
    verified: false, // Pending verification demo
    location: 'South End',
    avatar: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'sup-1',
    name: 'Harvest Caterers & Kitchen',
    email: 'orders@harvestcaterers.com',
    role: 'SUPPLIER',
    organizationName: 'Harvest Commercial Catering Ltd.',
    verified: true,
    location: 'Metro Wide',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'sup-5',
    name: 'Metro Pantry & Provisions',
    email: 'wholesale@metropantry.com',
    role: 'SUPPLIER',
    organizationName: 'Metro Pantry Wholesale Supply',
    verified: true,
    location: 'Metro Wide',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'admin-1',
    name: 'Alexandra Vance (Platform Admin)',
    email: 'admin@sharekind.org',
    role: 'ADMIN',
    organizationName: 'ShareKind Global Operations',
    verified: true,
    location: 'Global Headquarters',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Harvest Caterers & Kitchen', category: 'food', unit_price: 3.20, delivery_fee: 15.00, available_quantity: 400, delivery_hours: 3, reliability_score: 0.98, verified: true, service_area: 'Metro Wide' },
  { id: 'sup-2', name: 'Community Table Diner', category: 'food', unit_price: 3.80, delivery_fee: 10.00, available_quantity: 250, delivery_hours: 2, reliability_score: 0.94, verified: true, service_area: 'Downtown & North' },
  { id: 'sup-3', name: 'City Delights Bulk Food', category: 'food', unit_price: 2.90, delivery_fee: 25.00, available_quantity: 800, delivery_hours: 6, reliability_score: 0.89, verified: true, service_area: 'Metro Wide' },
  { id: 'sup-4', name: 'Speedy Meals Express', category: 'food', unit_price: 4.10, delivery_fee: 8.00, available_quantity: 120, delivery_hours: 1, reliability_score: 0.82, verified: false, service_area: 'Downtown Only' },
  { id: 'sup-5', name: 'Metro Pantry & Provisions', category: 'groceries', unit_price: 22.50, delivery_fee: 20.00, available_quantity: 180, delivery_hours: 12, reliability_score: 0.96, verified: true, service_area: 'Metro Wide' },
  { id: 'sup-6', name: 'Valley Fresh Wholesale', category: 'groceries', unit_price: 20.00, delivery_fee: 35.00, available_quantity: 300, delivery_hours: 24, reliability_score: 0.92, verified: true, service_area: 'All Districts' },
  { id: 'sup-7', name: 'Organic Staples Co-op', category: 'groceries', unit_price: 28.00, delivery_fee: 15.00, available_quantity: 90, delivery_hours: 18, reliability_score: 0.88, verified: true, service_area: 'East & South' },
  { id: 'sup-8', name: 'Warmth & Care Apparel Supply', category: 'clothing', unit_price: 35.00, delivery_fee: 25.00, available_quantity: 150, delivery_hours: 48, reliability_score: 0.97, verified: true, service_area: 'National Logistics' },
  { id: 'sup-9', name: 'Beacon Garments & Linens', category: 'clothing', unit_price: 32.50, delivery_fee: 30.00, available_quantity: 220, delivery_hours: 72, reliability_score: 0.90, verified: true, service_area: 'Metro Wide' },
  { id: 'sup-10', name: 'NorthStar Textile Liquidators', category: 'clothing', unit_price: 26.00, delivery_fee: 45.00, available_quantity: 80, delivery_hours: 96, reliability_score: 0.75, verified: false, service_area: 'North Suburbs' }
];

export const INITIAL_NEEDS: NGONeed[] = [
  { id: 'need-1', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', title: '200 Nutritious Evening Meals for Shelter', category: 'food', target_quantity: 200, fulfilled_quantity: 200, budget_estimate: 750.00, urgency: 'Urgent', status: 'procured', location: 'Metro Downtown', created_at: '2026-10-01T10:00:00Z', is_demo: true },
  { id: 'need-2', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', title: 'Winter Coats and Warm Sets for Children', category: 'clothing', target_quantity: 40, fulfilled_quantity: 40, budget_estimate: 1400.00, urgency: 'High', status: 'delivered', location: 'North Suburbs', created_at: '2026-10-03T11:30:00Z', is_demo: true },
  { id: 'need-3', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', title: '50 Emergency Grocery Staple Kits', category: 'groceries', target_quantity: 50, fulfilled_quantity: 0, budget_estimate: 1100.00, urgency: 'High', status: 'open', location: 'Metro Downtown', created_at: '2026-10-08T09:00:00Z', is_demo: true },
  { id: 'need-4', ngo_id: 'ngo-3', ngo_name: 'GreenLeaf Elder Care', title: '150 Soft Dietary Meals for Elderly Patients', category: 'food', target_quantity: 150, fulfilled_quantity: 0, budget_estimate: 550.00, urgency: 'Medium', status: 'open', location: 'East Valley', created_at: '2026-10-09T14:15:00Z', is_demo: true },
  { id: 'need-5', ngo_id: 'ngo-4', ngo_name: 'Grace Community Kitchen', title: 'Weekend Soup Kitchen - 300 Fresh Meals', category: 'food', target_quantity: 300, fulfilled_quantity: 300, budget_estimate: 1050.00, urgency: 'Urgent', status: 'confirmed_distribution', location: 'South End', created_at: '2026-10-04T08:00:00Z', is_demo: true },
  { id: 'need-6', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', title: '30 Weekly Infant Formula & Food Packs', category: 'groceries', target_quantity: 30, fulfilled_quantity: 0, budget_estimate: 700.00, urgency: 'High', status: 'open', location: 'North Suburbs', created_at: '2026-10-10T16:45:00Z', is_demo: true },
  { id: 'need-7', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', title: '60 Thermal Blankets & Thermal Undergarments', category: 'clothing', target_quantity: 60, fulfilled_quantity: 0, budget_estimate: 1950.00, urgency: 'Medium', status: 'open', location: 'Metro Downtown', created_at: '2026-10-11T12:00:00Z', is_demo: true },
  { id: 'need-8', ngo_id: 'ngo-3', ngo_name: 'GreenLeaf Elder Care', title: '25 Medical Grocery & Nutrition Supplemental Kits', category: 'groceries', target_quantity: 25, fulfilled_quantity: 0, budget_estimate: 600.00, urgency: 'Medium', status: 'open', location: 'East Valley', created_at: '2026-10-11T17:30:00Z', is_demo: true }
];

export const INITIAL_DONATIONS: Donation[] = [
  { id: 'don-1', donor_id: 'donor-1', donor_name: 'Sarah Jenkins', amount: 250.00, category: 'food', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', status: 'allocated', date: '2026-10-02T14:00:00Z', is_demo: true, impact: '71 hot meals funded', payment_ref: 'SIM_PAY_889102' },
  { id: 'don-2', donor_id: 'donor-1', donor_name: 'Sarah Jenkins', amount: 500.00, category: 'clothing', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', status: 'delivered', date: '2026-10-04T10:15:00Z', is_demo: true, impact: '12 winter coat bundles delivered', payment_ref: 'SIM_PAY_889103' },
  { id: 'don-3', donor_id: 'donor-1', donor_name: 'Sarah Jenkins', amount: 500.00, category: 'groceries', ngo_id: 'ngo-3', ngo_name: 'GreenLeaf Elder Care', status: 'allocated', date: '2026-10-08T18:00:00Z', is_demo: true, impact: '20 pantry food baskets funded', payment_ref: 'SIM_PAY_889104' },
  { id: 'don-4', donor_id: 'donor-2', donor_name: 'David Chen', amount: 350.00, category: 'food', ngo_id: 'ngo-4', ngo_name: 'Grace Community Kitchen', status: 'delivered', date: '2026-10-03T09:00:00Z', is_demo: true, impact: '100 hot lunches served to shelter residents', payment_ref: 'SIM_PAY_889105' },
  { id: 'don-5', donor_id: 'donor-2', donor_name: 'David Chen', amount: 490.00, category: 'groceries', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', status: 'allocated', date: '2026-10-09T11:20:00Z', is_demo: true, impact: '19 family emergency rations', payment_ref: 'SIM_PAY_889106' },
  { id: 'don-6', donor_id: 'donor-3', donor_name: 'Elena Rostova', amount: 450.00, category: 'clothing', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', status: 'delivered', date: '2026-10-05T13:40:00Z', is_demo: true, impact: '11 school uniform kits distributed', payment_ref: 'SIM_PAY_889107' },
  { id: 'don-7', donor_id: 'donor-4', donor_name: 'Marcus Washington', amount: 1000.00, category: 'food', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', status: 'allocated', date: '2026-10-06T15:00:00Z', is_demo: true, impact: '285 meals scheduled for shelter soup kitchen', payment_ref: 'SIM_PAY_889108' },
  { id: 'don-8', donor_id: 'donor-4', donor_name: 'Marcus Washington', amount: 600.00, category: 'groceries', ngo_id: 'ngo-3', ngo_name: 'GreenLeaf Elder Care', status: 'procured', date: '2026-10-07T12:00:00Z', is_demo: true, impact: '24 elder wellness nutrition boxes', payment_ref: 'SIM_PAY_889109' },
  { id: 'don-9', donor_id: 'donor-4', donor_name: 'Marcus Washington', amount: 500.00, category: 'clothing', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', status: 'delivered', date: '2026-10-10T09:30:00Z', is_demo: true, impact: '13 thermal blanket packs delivered', payment_ref: 'SIM_PAY_889110' },
  { id: 'don-10', donor_id: 'donor-5', donor_name: 'Amina Patel', amount: 200.00, category: 'food', ngo_id: 'ngo-4', ngo_name: 'Grace Community Kitchen', status: 'delivered', date: '2026-10-04T11:00:00Z', is_demo: true, impact: '57 hot evening meals served', payment_ref: 'SIM_PAY_889111' },
  { id: 'don-11', donor_id: 'donor-5', donor_name: 'Amina Patel', amount: 400.00, category: 'groceries', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', status: 'allocated', date: '2026-10-09T16:10:00Z', is_demo: true, impact: '16 pantry food bundles', payment_ref: 'SIM_PAY_889112' },
  { id: 'don-12', donor_id: 'donor-1', donor_name: 'Sarah Jenkins', amount: 150.00, category: 'food', ngo_id: 'ngo-4', ngo_name: 'Grace Community Kitchen', status: 'allocated', date: '2026-10-11T10:00:00Z', is_demo: true, impact: '42 fresh meals funded', payment_ref: 'SIM_PAY_889113' },
  { id: 'don-13', donor_id: 'donor-2', donor_name: 'David Chen', amount: 120.00, category: 'clothing', ngo_id: 'ngo-2', ngo_name: 'Sunrise Child Foundation', status: 'pending_allocation', date: '2026-10-11T14:30:00Z', is_demo: true, impact: 'Pending allocation to upcoming clothing need', payment_ref: 'SIM_PAY_889114' },
  { id: 'don-14', donor_id: 'donor-3', donor_name: 'Elena Rostova', amount: 300.00, category: 'food', ngo_id: 'ngo-1', ngo_name: 'Hope Haven Shelter', status: 'pending_allocation', date: '2026-10-11T18:00:00Z', is_demo: true, impact: '85 meals awaiting procurement allocation', payment_ref: 'SIM_PAY_889115' },
  { id: 'don-15', donor_id: 'donor-4', donor_name: 'Marcus Washington', amount: 750.00, category: 'groceries', ngo_id: 'ngo-3', ngo_name: 'GreenLeaf Elder Care', status: 'pending_allocation', date: '2026-10-12T08:00:00Z', is_demo: true, impact: '30 elder grocery baskets allocated', payment_ref: 'SIM_PAY_889116' }
];

export const INITIAL_ORDERS: ProcurementOrder[] = [
  {
    id: 'ord-101',
    need_id: 'need-1',
    ngo_id: 'ngo-1',
    ngo_name: 'Hope Haven Shelter',
    supplier_id: 'sup-1',
    supplier_name: 'Harvest Caterers & Kitchen',
    category: 'food',
    quantity: 200,
    unit_price: 3.20,
    delivery_fee: 15.00,
    total_cost: 655.00,
    status: 'in_preparation',
    created_at: '2026-10-09T10:00:00Z',
    history: [
      { status: 'placed', time: '2026-10-09T10:00:00Z', actor: 'Hope Haven Shelter' },
      { status: 'accepted', time: '2026-10-09T10:30:00Z', actor: 'Harvest Caterers & Kitchen' },
      { status: 'in_preparation', time: '2026-10-09T12:00:00Z', actor: 'Harvest Caterers & Kitchen' }
    ],
    impact_summary: '200 hot meals scheduled for shelter distribution tonight.'
  },
  {
    id: 'ord-102',
    need_id: 'need-2',
    ngo_id: 'ngo-2',
    ngo_name: 'Sunrise Child Foundation',
    supplier_id: 'sup-8',
    supplier_name: 'Warmth & Care Apparel Supply',
    category: 'clothing',
    quantity: 40,
    unit_price: 35.00,
    delivery_fee: 25.00,
    total_cost: 1425.00,
    status: 'delivered',
    created_at: '2026-10-05T14:00:00Z',
    history: [
      { status: 'placed', time: '2026-10-05T14:00:00Z', actor: 'Sunrise Child Foundation' },
      { status: 'accepted', time: '2026-10-05T15:00:00Z', actor: 'Warmth & Care Apparel Supply' },
      { status: 'dispatched', time: '2026-10-06T09:00:00Z', actor: 'Warmth & Care Apparel Supply' },
      { status: 'delivered', time: '2026-10-07T16:00:00Z', actor: 'Express Courier' }
    ],
    impact_summary: '40 insulated winter jackets received by foundation coordinators.'
  },
  {
    id: 'ord-103',
    need_id: 'need-5',
    ngo_id: 'ngo-4',
    ngo_name: 'Grace Community Kitchen',
    supplier_id: 'sup-3',
    supplier_name: 'City Delights Bulk Food',
    category: 'food',
    quantity: 300,
    unit_price: 2.90,
    delivery_fee: 25.00,
    total_cost: 895.00,
    status: 'confirmed_distribution',
    created_at: '2026-10-04T09:00:00Z',
    history: [
      { status: 'placed', time: '2026-10-04T09:00:00Z', actor: 'Grace Community Kitchen' },
      { status: 'dispatched', time: '2026-10-04T12:00:00Z', actor: 'City Delights Bulk Food' },
      { status: 'delivered', time: '2026-10-04T15:30:00Z', actor: 'City Delights Bulk Food' },
      { status: 'confirmed_distribution', time: '2026-10-04T18:00:00Z', actor: 'Grace Kitchen (Verified Digital Receipt)' }
    ],
    impact_summary: '300 community residents served hot dinner. Distribution certificate verified.'
  },
  {
    id: 'ord-104',
    need_id: 'need-3',
    ngo_id: 'ngo-1',
    ngo_name: 'Hope Haven Shelter',
    supplier_id: 'sup-5',
    supplier_name: 'Metro Pantry & Provisions',
    category: 'groceries',
    quantity: 50,
    unit_price: 22.50,
    delivery_fee: 20.00,
    total_cost: 1145.00,
    status: 'placed',
    created_at: '2026-10-11T14:00:00Z',
    history: [
      { status: 'placed', time: '2026-10-11T14:00:00Z', actor: 'Hope Haven Shelter' }
    ],
    impact_summary: 'Pending supplier acknowledgement for grocery provisions.'
  },
  {
    id: 'ord-105',
    need_id: 'need-7',
    ngo_id: 'ngo-1',
    ngo_name: 'Hope Haven Shelter',
    supplier_id: 'sup-9',
    supplier_name: 'Beacon Garments & Linens',
    category: 'clothing',
    quantity: 60,
    unit_price: 32.50,
    delivery_fee: 30.00,
    total_cost: 1980.00,
    status: 'dispatched',
    created_at: '2026-10-10T11:00:00Z',
    history: [
      { status: 'placed', time: '2026-10-10T11:00:00Z', actor: 'Hope Haven Shelter' },
      { status: 'accepted', time: '2026-10-10T13:00:00Z', actor: 'Beacon Garments & Linens' },
      { status: 'dispatched', time: '2026-10-11T09:30:00Z', actor: 'Beacon Garments & Linens' }
    ],
    impact_summary: 'En route via carrier. Tracking reference: #TRK-882910.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { audit_id: 'aud-001', timestamp: Date.now() - 86400000 * 3, iso_time: '2026-10-09T10:05:00Z', action: 'ORDER_PLACED', user_id: 'ngo-1', user_role: 'NGO', resource_id: 'ord-101', details: { amount: 655.0, supplier: 'Harvest Caterers' }, is_demo: true },
  { audit_id: 'aud-002', timestamp: Date.now() - 86400000 * 2, iso_time: '2026-10-10T13:10:00Z', action: 'SUPPLIER_VERIFIED', user_id: 'admin-1', user_role: 'ADMIN', resource_id: 'sup-1', details: { verified_by: 'Platform Auditor' }, is_demo: true },
  { audit_id: 'aud-003', timestamp: Date.now() - 86400000 * 1, iso_time: '2026-10-11T09:35:00Z', action: 'ORDER_DISPATCHED', user_id: 'sup-9', user_role: 'SUPPLIER', resource_id: 'ord-105', details: { carrier: 'Logistics Fleet' }, is_demo: true },
  { audit_id: 'aud-004', timestamp: Date.now() - 3600000 * 4, iso_time: '2026-10-12T05:00:00Z', action: 'DISTRIBUTION_CONFIRMED', user_id: 'ngo-4', user_role: 'NGO', resource_id: 'ord-103', details: { beneficiaries: 300, certificate: 'Verified digital proof' }, is_demo: true }
];
