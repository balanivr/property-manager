export const USER_TYPES = {
    ADMIN: 'admin',
    AGENT: 'agent',
};

export const DATABASE_REFS = {
    admin: 'admin',
    agent: 'agents'
};

export const PREFIXES = [
    'Mr',
    'Ms',
    'Mrs',
];

export const ACTIVE_STATES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

export const STATUS_TYPES = {
    // ACTIVE: 'active',
    // INACTIVE: 'inactive',
    DELETED: 'deleted',
    PENDING: 'pending',
    DRAFT: 'draft',
    NEEDS_CORRECTION: 'needs_correction',
    APPROVED: 'approved'
};

const apartmentFeatures = [
    'Air Conditioning',
    'Balcony',
    'Cable Ready',
    'Dishwasher',
    'Elevator',
    'Gas Range',
    'Hardwood Flooring',
    'Stainless Steel Appliances',
    'Washer & Dryer In Unit',
    'Garbage Disposal',
    'Refrigerator',
    'Special Features',
    'Furnished Available',
    'Pets',
    'Short Term Available',
    'Corporate Billing Available',
    'Sublets Allowed',
    'View',
    'Tile Flooring',
    'Carpet Flooring',
];

const buildingCommunityFeatures = [
    'Accepts Credit Card Payments',
    'Accepts Electronic Payments',
    'Business Center',
    'Covered Parking',
    'Emergency Maintenance',
    'Extra Storage',
    'Fitness Center',
    'Full Concierge Service',
    'Garage',
    'Green Community',
    'High Speed Internet Access',
    'Hot Tub',
    'Individual Leases',
    'Laundry Facility',
    'Pet Park',
    'Public Transportation',
    'Swimming Pool',
    'Wireless Internet Access',
    'Conference Room',
    'Controlled Access',
    'Door Attendant',
    'Media Center',
    'On Site Maintenance',
    'On Site Management',
    'Recreation Room',
    'Corporate',
    'Coffee Shop',
    'Grocery',
];

const commercialFeatures = [
    '24 Hour Security',
    'High Speed Elevators',
    'Business Lounge',
    'Car Parking',
    'Retail Shops',
    'Food Court',
    'Conference Room',
    'Key Card Ready',
    'Furnished',
    'Incl. Water & Electricity',
    'Central A/C',
    'Secure Barrier System',
    'Prayer Room',
    'CCTV Coverage',
];

const villaFeatures = [
    'Dining Hall',
    'Garage',
    'Pantry',
    'Maid Room',
    'Pool',
    'Backyard',
    'Open Parking',
    'Store Room',
    'Networked',
    'Laundry Room',
    'Balcony',
    'Terrace Access',
    'Central A/C Heating',
    'Pvt. Entrance to Villa',
    'Pvt. Beach Access',
    'Pvt. Garden',
    'Barbeque Pit',
    'Fireplace',
    'Jacuzzi',
    'Gym Room',
    'Study Room',
];

const villaCommunityFeatures = [
    'Community Hall',
    'Recreational Center',
    'Club House',
    'Gym',
    'Spa',
    'Common Pool',
    'Beach Access',
    'Children\'s Park',
    'Cycling Lane',
];

const commercialSuitability = [
    'Showroom',
    'Beauty Salon',
    'Nursery',
    'Medical Clinic',
    'Spa'
];

// Feature groups
const commercialFeatureGroup = {
    features: {
        type: 'Features',
        items: commercialFeatures
    },
    commercialSuitability: {
        type: 'Commercial Suitability',
        items: commercialSuitability
    }
};

const apartmentFeatureGroup = {
    features: {
        type: 'Apartment Features',
        items: apartmentFeatures
    },
    buildingCommunityFeatures: {
        type: 'Building/Community Features',
        items: buildingCommunityFeatures
    }
};

const villaFeatureGroup = {
    features: {
        type: 'Villa Features',
        items: villaFeatures
    },
    villaCommunityFeatures: {
        type: 'Community Features',
        items: villaCommunityFeatures
    }
};

export const PROPERTY_TYPES = {
    'commercial': {
        displayName: 'Commercial',
        value: 'commercial',

        types: {
            'office': {
                displayName: 'Office',
                value: 'office',
                features: commercialFeatureGroup
            },
            'shop': {
                displayName: 'Shop',
                value: 'shop',
                features: commercialFeatureGroup
            },
            'showroom': {
                displayName: 'Showroom',
                value: 'showroom',
                features: commercialFeatureGroup
            },
            'commercial_villa': {
                displayName: 'Commercial Villa',
                value: 'commercial_villa',
                features: commercialFeatureGroup
            },
            'bulk_units': {
                displayName: 'Bulk Units',
                value: 'bulk_units',
                features: commercialFeatureGroup
            },
            'commercial_plot': {
                displayName: 'Commercial Plot',
                value: 'commercial_plot',
                features: commercialFeatureGroup
            },
            'other_commercial_type': {
                displayName: 'Other Commercial Type',
                value: 'other_commercial_type',
                features: commercialFeatureGroup
            },
        },
    },


    'industrial': {
        displayName: 'Industrial',
        value: 'industrial',

        types: {
            'workshop': {
                displayName: 'Workshop',
                value: 'workshop',
                features: commercialFeatureGroup,
            },
            'shed': {
                displayName: 'Shed',
                value: 'shed',
                features: commercialFeatureGroup,
            },
            'warehouse': {
                displayName: 'Warehouse',
                value: 'warehouse',
                features: commercialFeatureGroup,
            },
            'factory': {
                displayName: 'Factory',
                value: 'factory',
                features: commercialFeatureGroup,
            },
            'industrial_land': {
                displayName: 'Industrial Land',
                value: 'industrial_land',
                features: commercialFeatureGroup,
            },
            'mixed_used_land': {
                displayName: 'Mixed Used Land',
                value: 'mixed_used_land',
                features: commercialFeatureGroup,
            },
            'bulk_units': {
                displayName: 'Bulk Units',
                value: 'bulk_units',
                features: commercialFeatureGroup,
            }
        }
    },


    'residential': {
        displayName: 'Residential',
        value: 'residential',

        types: {
            'apartment': {
                displayName: 'Apartment',
                value: 'apartment',
                features: apartmentFeatureGroup,
                categories: {
                    'simplex': {
                        displayName: 'Simplex',
                        value: 'simplex',
                    },
                    'duplex': {
                        displayName: 'Duplex',
                        value: 'duplex',
                    },
                    'penthouse': {
                        displayName: 'Penthouse',
                        value: 'penthouse',
                    },
                    'studio': {
                        displayName: 'Studio',
                        value: 'studio',
                    },
                    'garden_apartment': {
                        displayName: 'Garden Apartment',
                        value: 'garden_apartment',
                    },
                    'loft': {
                        displayName: 'Loft',
                        value: 'loft',
                    },
                    'bulk_units': {
                        displayName: 'Bulk Units',
                        value: 'bulk_units',
                    }
                }
            },
            'villa': {
                displayName: 'Villa',
                value: 'villa',
                features: villaFeatureGroup,

                categories: {
                    'independent': {
                        displayName: 'Independent',
                        value: 'independent',
                    },
                    'town_house': {
                        displayName: 'Town-House',
                        value: 'town_house',
                    },
                    'row_house': {
                        displayName: 'Row-House',
                        value: 'row_house',
                    },
                    'villa_compound_community': {
                        displayName: 'Villa Compound/Community',
                        value: 'villa_compound_community',
                    },
                    'partial_bungalow': {
                        displayName: 'Partial Bungalow',
                        value: 'partial_bungalow',
                    },
                    'bulk_units': {
                        displayName: 'Bulk Units',
                        value: 'bulk_units',
                    }
                }
            },
            /*'community': {
                displayName: 'Community',
                value: 'community',
                features: apartmentFeatureGroup
            },*/
        }
    }
};

export const ADDRESS_TYPES = [
    'Residential',
    'Head Office',
    'Branch Office',
    'Postal'
];

export const REGIONS = {
    'uae': {
        displayName: 'UAE',
        value: 'uae',
        enabled: true
    },
    'hkg': {
        displayName: 'Hong Kong',
        value: 'hkg',
        enabled: false
    }
};

export const CITIES = {
    'AE-AZ': {
        displayName: 'Abu Dhabi',
        value: 'AE-AZ',
        enabled: true
    },
    'AE-AJ': {
        displayName: 'Ajman',
        value: 'AE-AJ',
        enabled: true
    },
    'AE-FU': {
        displayName: 'Fujairah',
        value: 'AE-FU',
        enabled: true
    },
    'AE-SH': {
        displayName: 'Sharjah',
        value: 'AE-SH',
        enabled: true
    },
    'AE-DU': {
        displayName: 'Dubai',
        value: 'AE-DU',
        enabled: true
    },
    'AE-RK': {
        displayName: 'Ras Al Khaimah',
        value: 'AE-RK',
        enabled: true
    },
    'AE-UQ': {
        displayName: 'Umm Al Quwain',
        value: 'AE-UQ',
        enabled: true
    },
    'YE-SN': {
        displayName: 'Sanaa',
        value: 'YE-SN',
        enabled: true
    },
    'QA-DA': {
        displayName: 'Doha',
        value: 'QA-DA',
        enabled: true
    },
    'HK-HH': {
        displayName: 'Hung Hom',
        value: 'HK-HH',
        enabled: true
    },
};

export const COUNTRIES = {
    'ARE': {
        displayName: 'United Arab Emirates',
        value: 'ARE',
        enabled: true
    },
    'OMN': {
        displayName: 'The Sultanate Of Oman',
        value: 'OMN',
        enabled: false
    },
    'KWT': {
        displayName: 'Kuwait',
        value: 'KWT',
        enabled: false
    },
    'BHR': {
        displayName: 'Bahrain',
        value: 'BHR',
        enabled: false
    },
    'QAT': {
        displayName: 'The State Of Qatar',
        value: 'QAT',
        enabled: false
    },
    'SAU': {
        displayName: 'The Kingdom Of Saudi Arabia',
        value: 'SAU',
        enabled: false
    },
    'YEM': {
        displayName: 'The Republic Of Yemen',
        value: 'YEM',
        enabled: false
    },
    'HKG': {
        displayName: 'Hong Kong',
        value: 'HKG',
        enabled: false
    }
};

export const BUILDINGORCOMMUNITY = [
    'Building',
    'Community'
];

export const PROPERTY_USAGE = [
    'Residential',
    'Commercial',
    'Industrial'
];

export const BUILDINGCOMMUNITYFEATURES = buildingCommunityFeatures
export const PROPERTYFEATURES = apartmentFeatures

export const USERTYPES = [
    "Team Member",
    "Admin"
];
export const PHONETYPES = [
    "Land Line",
    "Mobile",
    "Fax",
    "Email",
    "Office - Direct",
    "Office - Switchboard"
];
export const EMAILTYPES = [
    "Home",
    "Work",
    "Proxy"
];