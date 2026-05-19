export type ConfidenceLevel = "high" | "medium" | "low";

export type FieldLocation = {
  lat: number;
  lon: number;
  state: string;
  county: string;
  acres: number;
  boundaryGeoJson?: GeoJSON.FeatureCollection;
};

export type SoilContext = {
  mapUnitKey?: string;
  mapUnitName?: string;
  soilSeries?: string;
  texture?: string;
  slope?: string;
  drainageClass?: string;
  hydrologicGroup?: string;
  availableWaterCapacity?: string;
  organicMatterEstimate?: number;
  source: "USDA_NRCS_SSURGO";
  confidence: ConfidenceLevel;
};

export type CropBenchmark = {
  countyCornYieldBuAc: number;
  stateCornYieldBuAc: number;
  countyCornAcres?: number;
  source: "USDA_NASS";
};

export type WeatherContext = {
  recentRainfallIn?: number;
  droughtRisk: "low" | "moderate" | "elevated";
  forecastSummary: string;
  stationName?: string;
  source: "NWS" | "NOAA";
};

export type FertilizerPrices = {
  nitrogenDefaultPerLb: number;
  phosphateDefaultPerLb?: number;
  potashDefaultPerLb?: number;
  regionLabel: string;
  source: string;
};

export type FieldProfile = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  acres: number;
  county: string;
  state: string;
  boundary?: GeoJSON.FeatureCollection;
  soil?: SoilContext;
  cropBenchmark?: CropBenchmark;
  weather?: WeatherContext;
  fertilizerPrices?: FertilizerPrices;
};

export type SoilTest = {
  ph?: number;
  organicMatterPct?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  cec?: number;
  nitrateN?: number;
  labDate?: string;
};

export type FarmerInput = {
  rotation: "corn_after_soybean" | "corn_after_corn";
  cornPricePerBu: number;
  nitrogenProduct: "anhydrous" | "uan28" | "uan32" | "urea";
  nitrogenPricePerTon?: number;
  nitrogenPricePerLb?: number;
  currentNRate: number;
  currentP2O5Rate: number;
  currentK2ORate: number;
  yieldGoal?: number;
  soilTest?: SoilTest;
};

export type RecommendationZone = {
  zone: string;
  acres: number;
  nRate: number;
  p2o5Rate: number;
  k2oRate: number;
  confidence: ConfidenceLevel;
  reason: string;
  geometry?: GeoJSON.Polygon;
};

export type ConfidenceBreakdown = {
  soilTestScore: number;
  soilDataScore: number;
  peerMatchScore: number;
  weatherScore: number;
  conservativeReductionScore: number;
  total: number;
};

export type Recommendation = {
  nRate: number;
  p2o5Rate: number;
  k2oRate: number;
  savingsPerAcre: number;
  totalSavings: number;
  confidenceScore: number;
  confidenceLabel: ConfidenceLevel;
  confidenceBreakdown: ConfidenceBreakdown;
  explanation: string[];
  zones: RecommendationZone[];
};

export type PeerField = {
  id: string;
  distanceMiles: number;
  lat: number;
  lon: number;
  soilTexture: string;
  drainageClass: string;
  organicMatterPct: number;
  rotation: FarmerInput["rotation"];
  yieldBenchmarkBuAc: number;
  nReductionLbAc: number;
  yieldChangeBuAc: number;
  savingsPerAcre: number;
  yieldResultLabel: string;
};

export type PeerMatchResult = {
  peers: Array<PeerField & { similarityScore: number }>;
  averageNReduction: number;
  averageYieldChange: number;
  averageSavings: number;
  confidence: ConfidenceLevel;
  count: number;
};

export type WizardStep =
  | "field"
  | "context"
  | "input"
  | "results"
  | "peers"
  | "export";

export type AppState = {
  field?: FieldProfile;
  farmerInput?: FarmerInput;
  recommendation?: Recommendation;
  peerMatch?: PeerMatchResult;
  profileLoading?: boolean;
};
