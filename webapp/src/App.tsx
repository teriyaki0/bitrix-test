import React, { useState, useCallback, useEffect } from "react";
import { DeviceSearch } from "./components/DeviceSearch";
import { ProductSearch } from "./components/ProductSearch";
import { SummaryBlock } from "./components/SummaryBlock";
import { Button } from "./components/Button";
import { useBitrixApi } from "./hooks/useBitrix";
import { useTheme } from "./hooks/useTheme";
import type { Product, SelectedProduct, DealRequest } from "./types";

export const App: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Product | null>(null);
  const [parts, setParts] = useState<SelectedProduct[]>([]);
  const [services, setServices] = useState<SelectedProduct[]>([]);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { createDeal, loading, error, setError } = useBitrixApi();
  const { isDark, toggleTheme } = useTheme();

  const calculateTotal = useCallback(() => {
    const partsTotal = parts.reduce((sum, part) => sum + (part.price || 0) * part.quantity, 0);
    const servicesTotal = services.reduce((sum, service) => sum + (service.price || 0) * service.quantity, 0);
    return partsTotal + servicesTotal;
  }, [parts, services]);

  const total = calculateTotal();
  const currency = parts[0]?.currency || services[0]?.currency || "KZT";

  useEffect(() => {
    setParts([]);
    setServices([]);
    setSubmitStatus("idle");
    setError(null);
  }, [selectedDevice, setError]);

  const handleAddPart = useCallback((part: SelectedProduct) => {
    setParts((prev) => [...prev, part]);
  }, []);

  const handleAddService = useCallback((service: SelectedProduct) => {
    setServices((prev) => [...prev, service]);
  }, []);

  const handleRemovePart = useCallback((partId: number) => {
    setParts((prev) => prev.filter((part) => part.id !== partId));
  }, []);

  const handleRemoveService = useCallback((serviceId: number) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
  }, []);

  const handleUpdatePartQuantity = useCallback((partId: number, quantity: number) => {
    setParts((prev) => prev.map((part) => (part.id === partId ? { ...part, quantity } : part)));
  }, []);

  const handleUpdateServiceQuantity = useCallback((serviceId: number, quantity: number) => {
    setServices((prev) => prev.map((service) => (service.id === serviceId ? { ...service, quantity } : service)));
  }, []);

  const handleCreateDeal = useCallback(async () => {
    if (!selectedDevice) return;

    const dealData: DealRequest = {
      device: {
        productId: selectedDevice.id,
        quantity: 1,
      },
      parts: parts.map((part) => ({
        productId: part.id,
        quantity: part.quantity,
      })),
      services: services.map((service) => ({
        productId: service.id,
        quantity: service.quantity,
      })),
    };

    const result = await createDeal(dealData);

    if (result?.ok) {
      setSubmitStatus("success");
      setTimeout(() => {
        setSelectedDevice(null);
        setParts([]);
        setServices([]);
        setSubmitStatus("idle");
      }, 3000);
    } else {
      setSubmitStatus("error");
    }
  }, [selectedDevice, parts, services, createDeal]);

  const isConfirmDisabled = !selectedDevice || loading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gamechanger</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                       hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? "Светлая" : "Темная"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus === "success" && (
          <div
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                       rounded-lg text-green-800 dark:text-green-200"
          >
            Deal created successfully!
          </div>
        )}

        {error && (
          <div
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                       rounded-lg text-red-800 dark:text-red-200"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <DeviceSearch onDeviceSelect={setSelectedDevice} selectedDevice={selectedDevice} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <ProductSearch type="parts" selectedProducts={parts} onAddProduct={handleAddPart} onRemoveProduct={handleRemovePart} onUpdateQuantity={handleUpdatePartQuantity} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <ProductSearch
                  type="services"
                  selectedProducts={services}
                  onAddProduct={handleAddService}
                  onRemoveProduct={handleRemoveService}
                  onUpdateQuantity={handleUpdateServiceQuantity}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <SummaryBlock device={selectedDevice} parts={parts} services={services} total={total} currency={currency} />

            <div className="sticky top-8">
              <Button onClick={handleCreateDeal} disabled={isConfirmDisabled} loading={loading} variant="primary">
                Confirm Order
              </Button>

              {isConfirmDisabled && !selectedDevice && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Please select a device to continue</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
