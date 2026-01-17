import { createContext, useContext, useState } from 'react';
import { BurnZoneCalculation } from '../models/Calculation';

interface CalculatorContextType {
    zones: BurnZoneCalculation[];
    setZone: (zone: BurnZoneCalculation) => void;
    reset: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
    const [zones, setZones] = useState<BurnZoneCalculation[]>([]);

    const setZone = (zone: BurnZoneCalculation) => {
        setZones(prev => {
            const filtered = prev.filter(z => z.zoneId !== zone.zoneId);
            return [...filtered, zone];
        });
    };

    const reset = () => setZones([]);

    return (
        <CalculatorContext.Provider value={{ zones, setZone, reset }}>
            {children}
        </CalculatorContext.Provider>
    );
}

export function useCalculator() {
    const ctx = useContext(CalculatorContext);
    if (!ctx) {
        throw new Error('useCalculator должен использоваться внутри CalculatorProvider');
    }
    return ctx;
}
