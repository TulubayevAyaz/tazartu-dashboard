export const ECONOMICS_KPI = {
  totalEffect5y: 18_400_000_000,
  capex: 42_600_000_000,
  npv: 9_200_000_000,
  irr: 21.4,
  arpuGrowthPct: 12.8,
  paybackYears: 4.2,
};

// накопленная OPEX-экономия vs CAPEX (точка окупаемости)
export const BREAKEVEN_CURVE = [
  { year: 2024, opexSavingsCum: 1.1, capexCum: 12.4 },
  { year: 2025, opexSavingsCum: 4.6, capexCum: 24.8 },
  { year: 2026, opexSavingsCum: 10.2, capexCum: 34.1 },
  { year: 2027, opexSavingsCum: 19.5, capexCum: 40.2 },
  { year: 2028, opexSavingsCum: 31.8, capexCum: 42.6 },
  { year: 2029, opexSavingsCum: 46.3, capexCum: 42.6 },
  { year: 2030, opexSavingsCum: 61.0, capexCum: 42.6 },
]; // млрд ₸

export const OPEX_STRUCTURE = [
  { name: "ТО DSLAM", value: 4200 },
  { name: "Электропитание", value: 2800 },
  { name: "Аварийные выезды", value: 1900 },
  { name: "ФОТ (высвобождение)", value: 1380 },
];

export const OPEX_BY_YEAR = [
  { year: 2023, dslam: 4800, power: 3100, emergency: 2100, payroll: 1100 },
  { year: 2024, dslam: 4400, power: 2950, emergency: 2000, payroll: 1180 },
  { year: 2025, dslam: 3600, power: 2700, emergency: 1750, payroll: 1250 },
  { year: 2026, dslam: 2900, power: 2400, emergency: 1500, payroll: 1310 },
  { year: 2027, dslam: 1800, power: 2000, emergency: 1150, payroll: 1360 },
  { year: 2028, dslam: 900, power: 1500, emergency: 800, payroll: 1400 },
]; // млн ₸

export const FCF_FORECAST = [
  { year: 2024, fcf: -8.2 },
  { year: 2025, fcf: -6.1 },
  { year: 2026, fcf: -1.4 },
  { year: 2027, fcf: 5.8 },
  { year: 2028, fcf: 12.9 },
]; // млрд ₸
