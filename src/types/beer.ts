export interface Beer {
    id: string;
    name: string;
    style: string;
    originalGravity: number;  // Specific gravity before fermentation (OG)
    finalGravity: number;     // Specific gravity after fermentation (FG)
    abv: number;              // Calculated from OG and FG
    brewDate: Date;
    completionDate?: Date;    // Date when the beer status changed to Ready
    description?: string;
    division: 'Otterdal Bryggeri' | 'Johans Pub';
    batchSize: number;
    status: 'Planning' | 'Brewing' | 'Fermenting' | 'Conditioning' | 'Ready';
    notes: BeerNote[];
    ingredients: {
        malts: MaltIngredient[];
        hops: HopIngredient[];
    };
}

export interface MaltIngredient {
    id: string;
    name?: string; // Making name optional
    amount: number; // in kg
    batchNumber?: string;
    supplier?: string;
}

export interface HopIngredient {
    id: string;
    name?: string; // Making name optional
    amount: number; // in grams
    alphaAcid?: number; // percentage
    timing?: number; // minutes from end of boil (0 for dry hop)
    batchNumber?: string;
    supplier?: string;
}

export interface BeerNote {
    id: string;
    date: Date;
    text: string;
}

export type Division = 'Otterdal Bryggeri' | 'Johans Pub';

// Helper function to calculate ABV from OG and FG
export function calculateABV(og: number, fg: number): number {
    return ((og - fg) * 131.25);
}

// Helper function to convert Firestore timestamp to Date
export function convertTimestamps<T>(data: T): T {
    if (data === null || data === undefined || typeof data !== 'object') {
        return data;
    }

    const result = { ...data };
    for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'object') {
            if ('toDate' in value && typeof value.toDate === 'function') {
                (result as any)[key] = value.toDate();
            } else {
                (result as any)[key] = convertTimestamps(value);
            }
        }
    }
    return result as T;
}