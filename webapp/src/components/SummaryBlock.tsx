import React from "react";
import type { Product, SelectedProduct } from "../types";

interface SummaryBlockProps {
  device: Product | null;
  parts: SelectedProduct[];
  services: SelectedProduct[];
  total: number;
  currency: string;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ device, parts, services, total, currency }) => {
  const calculateItemTotal = (items: SelectedProduct[]) => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const partsTotal = calculateItemTotal(parts);
  const servicesTotal = calculateItemTotal(services);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

      <div className="space-y-4">
        {device && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{device.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Device</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">1 × —</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">No price</div>
            </div>
          </div>
        )}

        {parts.map((part) => (
          <div key={part.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{part.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Part × {part.quantity}</div>
            </div>
            <div className="text-right font-medium text-gray-900 dark:text-white">
              {part.price * part.quantity} {part.currency}
            </div>
          </div>
        ))}

        {services.map((service) => (
          <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{service.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Service × {service.quantity}</div>
            </div>
            <div className="text-right font-medium text-gray-900 dark:text-white">
              {service.price * service.quantity} {service.currency}
            </div>
          </div>
        ))}

        <div className="space-y-2 pt-4">
          {partsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Parts Total:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {partsTotal} {currency}
              </span>
            </div>
          )}

          {servicesTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Services Total:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {servicesTotal} {currency}
              </span>
            </div>
          )}

          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-600 pt-4">
            <span className="text-gray-900 dark:text-white">Total:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {total} {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
