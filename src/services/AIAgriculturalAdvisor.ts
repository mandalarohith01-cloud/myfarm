// AI Agricultural Advisor Service
import AIService from './AIService';

export interface FarmerProfile {
  // Basic Details
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  
  // Farm Details
  farmName: string;
  farmerType: string;
  experience: string;
  education: string;
  farmSize: string;
  state: string;
  district: string;
  village: string;
  pincode: string;
  
  // Soil Information
  soilType: string;
  soilPH?: string;
  soilMoisture?: string;
  soilFertility?: string;
  irrigationType: string;
  waterSource: string;
  farmingMethod: string;
  season: string;
  
  // Financial Information
  annualIncome: string;
  landOwnership: string;
  hasInsurance: boolean;
  hasLoan: boolean;
  bankAccount?: string;
}

export interface SoilTestResults {
  ph: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: string;
  soilType: string;
  moisture: string;
  texture: string;
  electricalConductivity?: number;
  micronutrients?: {
    zinc?: string;
    iron?: string;
    manganese?: string;
    boron?: string;
  };
  deficiencies: string[];
  recommendations: string[];
}

export interface CropRecommendation {
  id: string;
  name: string;
  variety: string;
  suitability: number; // 0-100 percentage
  reason: string;
  expectedYield: string;
  sowingDate: string;
  harvestDate: string;
  benefits: string[];
  profitability: {
    score: number; // 1-10
    estimatedRevenue: string;
    estimatedCost: string;
    netProfit: string;
  };
  resourceRequirements: {
    waterRequirement: string;
    fertilizers: string[];
    pesticides: string[];
    laborDays: number;
    equipment: string[];
  };
  careInstructions: {
    soilPreparation: string[];
    sowing: string[];
    irrigation: string[];
    fertilization: string[];
    pestManagement: string[];
    harvesting: string[];
  };
  marketDemand: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  seasonalTiming: string;
}

export interface SoilImprovementSuggestion {
  issue: string;
  solution: string;
  priority: 'high' | 'medium' | 'low';
  cost: string;
  timeframe: string;
  expectedImprovement: string;
}

export interface AIAdvisorResponse {
  soilAnalysis: SoilTestResults;
  soilImprovements: SoilImprovementSuggestion[];
  cropRecommendations: CropRecommendation[];
  overallAssessment: {
    soilHealth: 'excellent' | 'good' | 'fair' | 'poor';
    farmingPotential: 'high' | 'medium' | 'low';
    primaryChallenges: string[];
    keyOpportunities: string[];
  };
  nextSteps: string[];
}

class AIAgriculturalAdvisor {
  private static instance: AIAgriculturalAdvisor;

  private constructor() {}

  static getInstance(): AIAgriculturalAdvisor {
    if (!AIAgriculturalAdvisor.instance) {
      AIAgriculturalAdvisor.instance = new AIAgriculturalAdvisor();
    }
    return AIAgriculturalAdvisor.instance;
  }

  // Main analysis function
  async analyzeAndRecommend(
    farmerProfile: FarmerProfile,
    soilTestDocument?: File | string
  ): Promise<AIAdvisorResponse> {
    try {
      // Step 1: Analyze soil test document if provided
      let soilAnalysis: SoilTestResults;
      
      if (soilTestDocument) {
        soilAnalysis = await this.analyzeSoilTestDocument(soilTestDocument);
      } else {
        // Use farmer's provided soil information as fallback
        soilAnalysis = this.createSoilAnalysisFromProfile(farmerProfile);
      }

      // Step 2: Generate soil improvement suggestions
      const soilImprovements = this.generateSoilImprovements(soilAnalysis);

      // Step 3: Generate crop recommendations
      const cropRecommendations = await this.generateCropRecommendations(
        farmerProfile,
        soilAnalysis
      );

      // Step 4: Create overall assessment
      const overallAssessment = this.createOverallAssessment(
        farmerProfile,
        soilAnalysis,
        cropRecommendations
      );

      // Step 5: Generate next steps
      const nextSteps = this.generateNextSteps(
        farmerProfile,
        soilAnalysis,
        cropRecommendations
      );

      return {
        soilAnalysis,
        soilImprovements,
        cropRecommendations,
        overallAssessment,
        nextSteps
      };
    } catch (error) {
      console.error('AI Agricultural Advisor error:', error);
      throw new Error('Failed to analyze farmer data and provide recommendations');
    }
  }

  // Analyze uploaded soil test document
  private async analyzeSoilTestDocument(document: File | string): Promise<SoilTestResults> {
    try {
      let documentData: string;
      
      if (document instanceof File) {
        // Convert file to base64 for analysis
        documentData = await this.fileToBase64(document);
      } else {
        documentData = document;
      }

      // Use AI service to analyze the document
      const aiResult = await AIService.analyzePlantImage(documentData, 'en');
      
      // Parse AI response and extract soil parameters
      return this.parseSoilAnalysisFromAI(aiResult);
    } catch (error) {
      console.error('Soil document analysis error:', error);
      // Return mock analysis as fallback
      return this.getMockSoilAnalysis();
    }
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Parse AI response to extract soil data
  private parseSoilAnalysisFromAI(aiResult: any): SoilTestResults {
    // This would parse actual AI response, for now return enhanced mock data
    return {
      ph: 6.8 + (Math.random() - 0.5) * 1.0, // 6.3 - 7.3 range
      nitrogen: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      phosphorus: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      potassium: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      organicMatter: `${(1.5 + Math.random() * 2).toFixed(1)}%`,
      soilType: ['Loamy', 'Clay', 'Sandy', 'Black Cotton'][Math.floor(Math.random() * 4)],
      moisture: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      texture: ['Fine', 'Medium', 'Coarse'][Math.floor(Math.random() * 3)],
      electricalConductivity: 0.2 + Math.random() * 0.6,
      micronutrients: {
        zinc: ['Deficient', 'Adequate', 'High'][Math.floor(Math.random() * 3)],
        iron: ['Deficient', 'Adequate', 'High'][Math.floor(Math.random() * 3)],
        manganese: ['Deficient', 'Adequate', 'High'][Math.floor(Math.random() * 3)],
        boron: ['Deficient', 'Adequate', 'High'][Math.floor(Math.random() * 3)]
      },
      deficiencies: this.generateDeficiencies(),
      recommendations: this.generateSoilRecommendations()
    };
  }

  // Create soil analysis from farmer profile
  private createSoilAnalysisFromProfile(profile: FarmerProfile): SoilTestResults {
    return {
      ph: profile.soilPH ? parseFloat(profile.soilPH) : 6.5,
      nitrogen: 'Medium',
      phosphorus: 'Medium',
      potassium: 'Medium',
      organicMatter: '2.0%',
      soilType: profile.soilType || 'Loamy',
      moisture: profile.soilMoisture || 'Medium',
      texture: 'Medium',
      deficiencies: ['Organic matter could be improved'],
      recommendations: ['Regular soil testing recommended', 'Add organic compost']
    };
  }

  // Generate soil improvement suggestions
  private generateSoilImprovements(soilAnalysis: SoilTestResults): SoilImprovementSuggestion[] {
    const improvements: SoilImprovementSuggestion[] = [];

    // pH correction
    if (soilAnalysis.ph < 6.0) {
      improvements.push({
        issue: 'Soil is too acidic (pH < 6.0)',
        solution: 'Apply agricultural lime at 500-1000 kg/acre',
        priority: 'high',
        cost: '₹3,000-5,000',
        timeframe: '2-3 months',
        expectedImprovement: 'pH will increase to optimal 6.5-7.0 range'
      });
    } else if (soilAnalysis.ph > 8.0) {
      improvements.push({
        issue: 'Soil is too alkaline (pH > 8.0)',
        solution: 'Apply gypsum or sulfur at 200-400 kg/acre',
        priority: 'high',
        cost: '₹2,000-4,000',
        timeframe: '3-4 months',
        expectedImprovement: 'pH will decrease to optimal range'
      });
    }

    // Nutrient deficiencies
    if (soilAnalysis.nitrogen === 'Low') {
      improvements.push({
        issue: 'Low nitrogen content',
        solution: 'Apply urea or organic compost, consider green manuring',
        priority: 'high',
        cost: '₹2,500-4,000',
        timeframe: '1-2 months',
        expectedImprovement: 'Improved plant growth and leaf development'
      });
    }

    if (soilAnalysis.phosphorus === 'Low') {
      improvements.push({
        issue: 'Low phosphorus content',
        solution: 'Apply DAP or single super phosphate',
        priority: 'medium',
        cost: '₹1,500-3,000',
        timeframe: '2-3 months',
        expectedImprovement: 'Better root development and flowering'
      });
    }

    if (soilAnalysis.potassium === 'Low') {
      improvements.push({
        issue: 'Low potassium content',
        solution: 'Apply muriate of potash or wood ash',
        priority: 'medium',
        cost: '₹1,000-2,500',
        timeframe: '1-2 months',
        expectedImprovement: 'Enhanced disease resistance and fruit quality'
      });
    }

    // Organic matter
    if (parseFloat(soilAnalysis.organicMatter) < 2.0) {
      improvements.push({
        issue: 'Low organic matter content',
        solution: 'Add vermicompost, farmyard manure, or crop residues',
        priority: 'medium',
        cost: '₹3,000-6,000',
        timeframe: '3-6 months',
        expectedImprovement: 'Improved soil structure and water retention'
      });
    }

    return improvements;
  }

  // Generate crop recommendations
  private async generateCropRecommendations(
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults
  ): Promise<CropRecommendation[]> {
    const recommendations: CropRecommendation[] = [];
    
    // Get base crop data
    const cropDatabase = this.getCropDatabase();
    
    // Filter and score crops based on conditions
    for (const crop of cropDatabase) {
      const suitability = this.calculateCropSuitability(crop, profile, soilAnalysis);
      
      if (suitability >= 60) { // Only recommend crops with 60%+ suitability
        const recommendation: CropRecommendation = {
          ...crop,
          suitability,
          reason: this.generateRecommendationReason(crop, profile, soilAnalysis, suitability),
          profitability: this.calculateProfitability(crop, profile),
          resourceRequirements: this.calculateResourceRequirements(crop, profile),
          careInstructions: this.generateCareInstructions(crop, soilAnalysis)
        };
        
        recommendations.push(recommendation);
      }
    }

    // Sort by suitability and return top 5
    return recommendations
      .sort((a, b) => b.suitability - a.suitability)
      .slice(0, 5);
  }

  // Calculate crop suitability score
  private calculateCropSuitability(
    crop: any,
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults
  ): number {
    let score = 70; // Base score

    // Soil pH compatibility
    const phOptimal = crop.optimalPH;
    const phDiff = Math.abs(soilAnalysis.ph - phOptimal);
    if (phDiff <= 0.5) score += 15;
    else if (phDiff <= 1.0) score += 10;
    else if (phDiff <= 1.5) score += 5;
    else score -= 10;

    // Soil type compatibility
    if (crop.suitableSoilTypes.includes(soilAnalysis.soilType)) {
      score += 10;
    }

    // Climate/location compatibility
    if (crop.suitableStates.includes(profile.state)) {
      score += 10;
    }

    // Season compatibility
    if (crop.seasons.includes(profile.season.toLowerCase())) {
      score += 10;
    }

    // Farm size compatibility
    const farmSize = parseFloat(profile.farmSize);
    if (farmSize >= crop.minFarmSize && farmSize <= crop.maxFarmSize) {
      score += 5;
    }

    // Experience level
    const experience = parseInt(profile.experience);
    if (experience >= crop.minExperience) {
      score += 5;
    } else {
      score -= 5;
    }

    // Water requirement vs irrigation type
    if (crop.waterRequirement === 'low' && profile.irrigationType.includes('Drip')) {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  // Generate recommendation reason
  private generateRecommendationReason(
    crop: any,
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults,
    suitability: number
  ): string {
    const reasons = [];

    if (Math.abs(soilAnalysis.ph - crop.optimalPH) <= 0.5) {
      reasons.push('optimal soil pH match');
    }

    if (crop.suitableSoilTypes.includes(soilAnalysis.soilType)) {
      reasons.push('excellent soil type compatibility');
    }

    if (crop.suitableStates.includes(profile.state)) {
      reasons.push('well-suited for your region');
    }

    if (suitability >= 90) {
      reasons.push('exceptional growing conditions');
    } else if (suitability >= 80) {
      reasons.push('very good growing potential');
    }

    return `Recommended due to ${reasons.join(', ')}.`;
  }

  // Calculate profitability
  private calculateProfitability(crop: any, profile: FarmerProfile): any {
    const farmSize = parseFloat(profile.farmSize);
    const baseRevenue = crop.basePrice * crop.averageYield * farmSize;
    const baseCost = crop.cultivationCost * farmSize;
    const netProfit = baseRevenue - baseCost;

    return {
      score: Math.min(10, Math.max(1, Math.round((netProfit / baseCost) * 5))),
      estimatedRevenue: `₹${Math.round(baseRevenue).toLocaleString()}`,
      estimatedCost: `₹${Math.round(baseCost).toLocaleString()}`,
      netProfit: `₹${Math.round(netProfit).toLocaleString()}`
    };
  }

  // Calculate resource requirements
  private calculateResourceRequirements(crop: any, profile: FarmerProfile): any {
    const farmSize = parseFloat(profile.farmSize);
    
    return {
      waterRequirement: crop.waterRequirement,
      fertilizers: crop.fertilizers,
      pesticides: crop.pesticides,
      laborDays: Math.round(crop.laborDaysPerAcre * farmSize),
      equipment: crop.equipment
    };
  }

  // Generate care instructions
  private generateCareInstructions(crop: any, soilAnalysis: SoilTestResults): any {
    return {
      soilPreparation: crop.careInstructions.soilPreparation,
      sowing: crop.careInstructions.sowing,
      irrigation: crop.careInstructions.irrigation,
      fertilization: this.customizeFertilization(crop.careInstructions.fertilization, soilAnalysis),
      pestManagement: crop.careInstructions.pestManagement,
      harvesting: crop.careInstructions.harvesting
    };
  }

  // Customize fertilization based on soil analysis
  private customizeFertilization(baseFertilization: string[], soilAnalysis: SoilTestResults): string[] {
    const customized = [...baseFertilization];

    if (soilAnalysis.nitrogen === 'Low') {
      customized.push('Apply additional nitrogen fertilizer due to soil deficiency');
    }
    if (soilAnalysis.phosphorus === 'Low') {
      customized.push('Increase phosphorus application for better root development');
    }
    if (soilAnalysis.potassium === 'Low') {
      customized.push('Add potassium fertilizer for improved disease resistance');
    }

    return customized;
  }

  // Create overall assessment
  private createOverallAssessment(
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults,
    recommendations: CropRecommendation[]
  ): any {
    const avgSuitability = recommendations.reduce((sum, rec) => sum + rec.suitability, 0) / recommendations.length;
    
    let soilHealth: 'excellent' | 'good' | 'fair' | 'poor';
    if (soilAnalysis.ph >= 6.0 && soilAnalysis.ph <= 7.5 && 
        soilAnalysis.nitrogen !== 'Low' && soilAnalysis.phosphorus !== 'Low') {
      soilHealth = 'excellent';
    } else if (soilAnalysis.ph >= 5.5 && soilAnalysis.ph <= 8.0) {
      soilHealth = 'good';
    } else if (soilAnalysis.ph >= 5.0 && soilAnalysis.ph <= 8.5) {
      soilHealth = 'fair';
    } else {
      soilHealth = 'poor';
    }

    const farmingPotential = avgSuitability >= 85 ? 'high' : avgSuitability >= 70 ? 'medium' : 'low';

    return {
      soilHealth,
      farmingPotential,
      primaryChallenges: this.identifyChallenges(profile, soilAnalysis),
      keyOpportunities: this.identifyOpportunities(profile, soilAnalysis, recommendations)
    };
  }

  // Generate next steps
  private generateNextSteps(
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults,
    recommendations: CropRecommendation[]
  ): string[] {
    const steps = [];

    steps.push('Review and select your preferred crops from the recommendations');
    steps.push('Implement soil improvement measures if needed');
    steps.push('Prepare your field according to crop requirements');
    steps.push('Source quality seeds/seedlings from certified dealers');
    steps.push('Set up irrigation system based on crop water needs');
    steps.push('Create a fertilization schedule based on soil analysis');
    steps.push('Monitor crops regularly and follow care instructions');

    return steps;
  }

  // Helper methods
  private generateDeficiencies(): string[] {
    const possible = [
      'Organic matter below optimal level',
      'Micronutrient zinc deficiency detected',
      'Soil compaction in some areas',
      'Drainage could be improved'
    ];
    return possible.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateSoilRecommendations(): string[] {
    return [
      'Apply organic compost to improve soil structure',
      'Consider crop rotation to maintain soil health',
      'Regular soil testing every 2-3 years recommended',
      'Maintain proper drainage to prevent waterlogging'
    ];
  }

  private identifyChallenges(profile: FarmerProfile, soilAnalysis: SoilTestResults): string[] {
    const challenges = [];
    
    if (soilAnalysis.ph < 6.0 || soilAnalysis.ph > 8.0) {
      challenges.push('Soil pH needs correction');
    }
    if (soilAnalysis.nitrogen === 'Low') {
      challenges.push('Low soil nitrogen content');
    }
    if (parseInt(profile.experience) < 5) {
      challenges.push('Limited farming experience');
    }
    
    return challenges;
  }

  private identifyOpportunities(
    profile: FarmerProfile,
    soilAnalysis: SoilTestResults,
    recommendations: CropRecommendation[]
  ): string[] {
    const opportunities = [];
    
    if (recommendations.some(r => r.profitability.score >= 8)) {
      opportunities.push('High-profit crops suitable for your conditions');
    }
    if (profile.irrigationType.includes('Drip')) {
      opportunities.push('Efficient irrigation system enables diverse crop options');
    }
    if (parseFloat(profile.farmSize) > 2) {
      opportunities.push('Farm size allows for crop diversification');
    }
    
    return opportunities;
  }

  private getMockSoilAnalysis(): SoilTestResults {
    return {
      ph: 6.8,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Low',
      organicMatter: '2.5%',
      soilType: 'Loamy',
      moisture: 'Medium',
      texture: 'Medium',
      deficiencies: ['Potassium deficiency', 'Organic matter could be improved'],
      recommendations: [
        'Apply potassium fertilizer before planting',
        'Add organic compost to improve soil structure',
        'Consider crop rotation for soil health'
      ]
    };
  }

  // Crop database with detailed information
  private getCropDatabase(): any[] {
    return [
      {
        id: 'paddy-1',
        name: 'Paddy',
        variety: 'BPT 5204 (Sona Masuri)',
        expectedYield: '45-50 quintals/acre',
        sowingDate: 'June 15 - July 15',
        harvestDate: 'October - November',
        benefits: ['High market demand', 'Government MSP support', 'Suitable for monsoon'],
        optimalPH: 6.5,
        suitableSoilTypes: ['Clay', 'Loamy', 'Black Cotton'],
        suitableStates: ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka'],
        seasons: ['kharif', 'monsoon'],
        minFarmSize: 0.5,
        maxFarmSize: 50,
        minExperience: 0,
        waterRequirement: 'high',
        marketDemand: 'high' as const,
        riskLevel: 'low' as const,
        seasonalTiming: 'Kharif season (June-November)',
        basePrice: 2700,
        averageYield: 47.5,
        cultivationCost: 35000,
        fertilizers: ['Urea', 'DAP', 'Potash'],
        pesticides: ['Carbofuran', 'Chlorpyrifos'],
        equipment: ['Transplanter', 'Harvester'],
        laborDaysPerAcre: 45,
        careInstructions: {
          soilPreparation: ['Deep plowing', 'Puddling', 'Leveling'],
          sowing: ['Transplant 21-day seedlings', '20cm x 15cm spacing'],
          irrigation: ['Maintain 2-3cm water level', 'Drain before harvest'],
          fertilization: ['Basal: 60kg N, 60kg P, 40kg K per acre'],
          pestManagement: ['Monitor for stem borer', 'Apply need-based pesticides'],
          harvesting: ['Harvest at 80% maturity', 'Proper drying essential']
        }
      },
      {
        id: 'tomato-1',
        name: 'Tomato',
        variety: 'Arka Rakshak',
        expectedYield: '400-500 quintals/acre',
        sowingDate: 'Year round (protected cultivation)',
        harvestDate: '70-90 days after transplanting',
        benefits: ['High profitability', 'Year-round cultivation', 'Value addition potential'],
        optimalPH: 6.0,
        suitableSoilTypes: ['Loamy', 'Sandy'],
        suitableStates: ['Karnataka', 'Maharashtra', 'Himachal Pradesh'],
        seasons: ['rabi', 'kharif', 'zaid'],
        minFarmSize: 0.25,
        maxFarmSize: 10,
        minExperience: 2,
        waterRequirement: 'medium',
        marketDemand: 'high' as const,
        riskLevel: 'medium' as const,
        seasonalTiming: 'Year round with protection',
        basePrice: 45,
        averageYield: 450,
        cultivationCost: 80000,
        fertilizers: ['NPK 19:19:19', 'Calcium nitrate'],
        pesticides: ['Mancozeb', 'Imidacloprid'],
        equipment: ['Drip irrigation', 'Stakes'],
        laborDaysPerAcre: 60,
        careInstructions: {
          soilPreparation: ['Raised beds', 'Organic matter addition'],
          sowing: ['Nursery raising', 'Transplant at 4-5 leaf stage'],
          irrigation: ['Drip irrigation preferred', 'Avoid water stress'],
          fertilization: ['Weekly fertigation', 'Calcium for fruit quality'],
          pestManagement: ['IPM approach', 'Regular monitoring'],
          harvesting: ['Harvest at breaker stage', 'Handle carefully']
        }
      },
      {
        id: 'wheat-1',
        name: 'Wheat',
        variety: 'HD 2967',
        expectedYield: '35-40 quintals/acre',
        sowingDate: 'November 15 - December 15',
        harvestDate: 'March - April',
        benefits: ['Stable market', 'MSP available', 'Low water requirement'],
        optimalPH: 6.5,
        suitableSoilTypes: ['Loamy', 'Clay'],
        suitableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
        seasons: ['rabi', 'winter'],
        minFarmSize: 1,
        maxFarmSize: 100,
        minExperience: 1,
        waterRequirement: 'medium',
        marketDemand: 'high' as const,
        riskLevel: 'low' as const,
        seasonalTiming: 'Rabi season (November-April)',
        basePrice: 2100,
        averageYield: 37.5,
        cultivationCost: 25000,
        fertilizers: ['Urea', 'DAP', 'Potash'],
        pesticides: ['2,4-D', 'Metsulfuron'],
        equipment: ['Seed drill', 'Combine harvester'],
        laborDaysPerAcre: 25,
        careInstructions: {
          soilPreparation: ['Deep plowing', 'Fine tilth preparation'],
          sowing: ['Line sowing preferred', '100kg seed per acre'],
          irrigation: ['Crown root initiation', 'Tillering', 'Flowering'],
          fertilization: ['Basal: 60kg N, 60kg P, 40kg K per acre'],
          pestManagement: ['Weed control critical', 'Aphid monitoring'],
          harvesting: ['Harvest at physiological maturity', 'Avoid shattering']
        }
      },
      {
        id: 'onion-1',
        name: 'Onion',
        variety: 'Pusa Red',
        expectedYield: '200-250 quintals/acre',
        sowingDate: 'October - November',
        harvestDate: 'February - March',
        benefits: ['Good storage life', 'Stable market', 'Export potential'],
        optimalPH: 6.8,
        suitableSoilTypes: ['Loamy', 'Sandy'],
        suitableStates: ['Maharashtra', 'Gujarat', 'Karnataka', 'Rajasthan'],
        seasons: ['rabi'],
        minFarmSize: 0.5,
        maxFarmSize: 20,
        minExperience: 3,
        waterRequirement: 'medium',
        marketDemand: 'medium' as const,
        riskLevel: 'medium' as const,
        seasonalTiming: 'Rabi season (October-March)',
        basePrice: 35,
        averageYield: 225,
        cultivationCost: 45000,
        fertilizers: ['NPK', 'Sulphur'],
        pesticides: ['Mancozeb', 'Thiamethoxam'],
        equipment: ['Transplanter', 'Harvester'],
        laborDaysPerAcre: 50,
        careInstructions: {
          soilPreparation: ['Fine seed bed', 'Good drainage'],
          sowing: ['Transplant 45-day seedlings', '15cm x 10cm spacing'],
          irrigation: ['Light frequent irrigation', 'Stop 15 days before harvest'],
          fertilization: ['Split application of nitrogen'],
          pestManagement: ['Thrips control', 'Purple blotch prevention'],
          harvesting: ['Harvest when tops fall', 'Proper curing essential']
        }
      },
      {
        id: 'cotton-1',
        name: 'Cotton',
        variety: 'Bt Cotton',
        expectedYield: '15-20 quintals/acre',
        sowingDate: 'May - June',
        harvestDate: 'October - December',
        benefits: ['High value crop', 'Industrial demand', 'Bt technology'],
        optimalPH: 7.0,
        suitableSoilTypes: ['Black Cotton', 'Loamy'],
        suitableStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Karnataka'],
        seasons: ['kharif'],
        minFarmSize: 2,
        maxFarmSize: 50,
        minExperience: 5,
        waterRequirement: 'medium',
        marketDemand: 'high' as const,
        riskLevel: 'high' as const,
        seasonalTiming: 'Kharif season (May-December)',
        basePrice: 6000,
        averageYield: 17.5,
        cultivationCost: 55000,
        fertilizers: ['Urea', 'DAP', 'Potash'],
        pesticides: ['Emamectin benzoate', 'Imidacloprid'],
        equipment: ['Cotton picker', 'Sprayer'],
        laborDaysPerAcre: 70,
        careInstructions: {
          soilPreparation: ['Deep plowing', 'Ridge and furrow'],
          sowing: ['Delinted seed', '90cm x 45cm spacing'],
          irrigation: ['Critical at flowering', 'Avoid water stress'],
          fertilization: ['Split nitrogen application'],
          pestManagement: ['Bollworm monitoring', 'Resistance management'],
          harvesting: ['Multiple pickings', 'Morning harvest preferred']
        }
      }
    ];
  }
}

export default AIAgriculturalAdvisor.getInstance();