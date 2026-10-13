import React from 'react';
import { OrderStatus, DonationStatus } from '../types';
import { CheckCircle2, Clock, Truck, ShieldCheck, Box, PackageCheck, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | DonationStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = status.toLowerCase();

  switch (norm) {
    case 'confirmed_distribution':
    case 'confirmed':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Verified Impact
        </span>
      );

    case 'delivered':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          <PackageCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
          Delivered to NGO
        </span>
      );

    case 'dispatched':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
          <Truck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
          In Transit
        </span>
      );

    case 'in_preparation':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <Box className="w-3.5 h-3.5 mr-1 text-amber-600" />
          In Preparation
        </span>
      );

    case 'accepted':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" />
          Supplier Accepted
        </span>
      );

    case 'placed':
    case 'open':
    case 'pending_allocation':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
          {norm === 'placed' ? 'Order Placed' : (norm === 'open' ? 'Active Need' : 'Pending Allocation')}
        </span>
      );

    case 'allocated':
    case 'procured':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" />
          Allocated to Cause
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          <AlertCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
          {status}
        </span>
      );
  }
};
