/**
 * VHL Global Industries — Product Catalogue Data
 * Category-wise product listings for modal display and PDF generation.
 */

const VHL_PRODUCTS = {
  "Solvents & Intermediates": {
    description: "High-purity solvents and chemical intermediates for industrial and laboratory applications.",
    products: [
      { name: "Acetone", cas: "67-64-1", purity: "99.5%+", packaging: "170 kg drum / Flexi tank", uses: "Pharmaceuticals, Paints, Adhesives" },
      { name: "Methanol", cas: "67-56-1", purity: "99.9%+", packaging: "170 kg drum / Flexi tank", uses: "Fuel, Resins, Antifreeze" },
      { name: "Ethanol (IDA)", cas: "64-17-5", purity: "98–99%", packaging: "250 kg drum", uses: "Pharmaceuticals, Sanitizers, Beverages" },
      { name: "Isopropyl Alcohol (IPA)", cas: "67-63-0", purity: "99.5%+", packaging: "170 kg drum", uses: "Cleaning, Pharmaceuticals, Cosmetics" },
      { name: "Ethyl Acetate", cas: "141-78-6", purity: "99.5%+", packaging: "170 kg drum / Flexi tank", uses: "Paints, Adhesives, Food Flavoring" },
      { name: "Butyl Acetate", cas: "123-86-4", purity: "99%+", packaging: "170 kg drum", uses: "Coatings, Lacquers, Inks" },
      { name: "Toluene", cas: "108-88-3", purity: "99.5%+", packaging: "170 kg drum / Flexi tank", uses: "Paints, Adhesives, Rubber" },
      { name: "Xylene (Mixed)", cas: "1330-20-7", purity: "98%+", packaging: "170 kg drum / Flexi tank", uses: "Paints, Coatings, Printing Inks" },
      { name: "MEK (Methyl Ethyl Ketone)", cas: "78-93-3", purity: "99.5%+", packaging: "170 kg drum", uses: "Adhesives, Coatings, Magnetic Tapes" },
      { name: "MIBK (Methyl Isobutyl Ketone)", cas: "108-10-1", purity: "99%+", packaging: "170 kg drum", uses: "Paints, Lacquers, Metal Extractants" },
      { name: "n-Heptane", cas: "142-82-5", purity: "98%+", packaging: "170 kg drum", uses: "Laboratory, Adhesives, Cements" },
      { name: "n-Hexane", cas: "110-54-3", purity: "60% / 95%", packaging: "170 kg drum / Flexi tank", uses: "Oil Extraction, Adhesives, Cements" },
      { name: "DMF (Dimethylformamide)", cas: "68-12-2", purity: "99.5%+", packaging: "180 kg drum", uses: "Pharmaceuticals, Synthetic Leathers" },
      { name: "DMSO (Dimethyl Sulfoxide)", cas: "67-68-5", purity: "99.9%+", packaging: "250 kg drum", uses: "Pharma, Veterinary, Electronics" },
      { name: "Glycol Ether (Propylene Glycol Monomethyl Ether)", cas: "107-98-2", purity: "99%+", packaging: "170 kg drum", uses: "Coatings, Cleaners, Inks" }
    ]
  },
  "Inorganic Chemicals": {
    description: "Wide range of inorganic chemicals and mineral-based compounds for diverse industrial applications.",
    products: [
      { name: "Sodium Hydroxide (Caustic Soda)", cas: "1310-73-2", purity: "98–99%", packaging: "50 kg bag / Flakes", uses: "Soap, Paper, Textiles, Water Treatment" },
      { name: "Potassium Hydroxide (Caustic Potash)", cas: "1310-58-3", purity: "90–95%", packaging: "25 kg bag / Flakes", uses: "Batteries, Soap, Agriculture" },
      { name: "Sodium Carbonate (Soda Ash)", cas: "497-19-8", purity: "99%+", packaging: "50 kg bag", uses: "Glass, Detergents, Chemicals" },
      { name: "Sodium Bicarbonate", cas: "144-55-8", purity: "99%+", packaging: "25 kg bag", uses: "Food, Pharma, Fire Extinguishers" },
      { name: "Ammonium Chloride", cas: "12125-02-9", purity: "99%+", packaging: "50 kg bag", uses: "Fertilizers, Batteries, Galvanizing" },
      { name: "Zinc Oxide", cas: "1314-13-2", purity: "99%+", packaging: "25 kg bag", uses: "Rubber, Paints, Cosmetics, Pharma" },
      { name: "Zinc Sulphate", cas: "7733-02-0", purity: "98%+", packaging: "50 kg bag", uses: "Fertilizers, Animal Feed, Rayon" },
      { name: "Ferrous Sulphate", cas: "7720-78-7", purity: "98%+", packaging: "50 kg bag", uses: "Water Treatment, Fertilizers, Inks" },
      { name: "Ferric Chloride", cas: "7705-08-0", purity: "96%+", packaging: "50 kg bag / 1000 L IBC", uses: "Water Treatment, PCB Manufacturing" },
      { name: "Aluminium Sulphate", cas: "10043-01-3", purity: "17% Al₂O₃", packaging: "50 kg bag / Lump", uses: "Water Treatment, Paper, Textiles" },
      { name: "Magnesium Sulphate (Epsom Salt)", cas: "7487-88-9", purity: "99%+", packaging: "50 kg bag", uses: "Agriculture, Pharma, Food" },
      { name: "Sodium Sulphate (Anhydrous)", cas: "7757-82-6", purity: "99%+", packaging: "50 kg bag", uses: "Glass, Detergents, Paper" },
      { name: "Potassium Permanganate", cas: "7722-64-7", purity: "99%+", packaging: "25 kg drum", uses: "Water Treatment, Chemical Synthesis" },
      { name: "Sodium Metabisulphite", cas: "7681-57-4", purity: "97%+", packaging: "50 kg bag", uses: "Food Preservation, Water Treatment" },
      { name: "Boric Acid", cas: "10043-35-3", purity: "99.5%+", packaging: "25 kg bag", uses: "Glass, Ceramics, Pharmaceuticals" }
    ]
  },
  "Specialty Chemicals": {
    description: "Performance-driven specialty chemicals for high-value industrial and commercial applications.",
    products: [
      { name: "Hydrogen Peroxide", cas: "7722-84-1", purity: "35% / 50%", packaging: "50 kg HDPE carboy", uses: "Bleaching, Disinfection, Electronics" },
      { name: "Glycerine (Glycerol)", cas: "56-81-5", purity: "99.5%+ (USP)", packaging: "250 kg drum", uses: "Pharma, Cosmetics, Food" },
      { name: "Propylene Glycol", cas: "57-55-6", purity: "USP/Industrial", packaging: "225 kg drum", uses: "Pharma, Food, Antifreeze" },
      { name: "Ethylene Glycol", cas: "107-21-1", purity: "99%+", packaging: "225 kg drum / Flexi tank", uses: "Antifreeze, Polyester Fibers" },
      { name: "Sorbitol Solution", cas: "50-70-4", purity: "70% solution", packaging: "1250 kg IBC", uses: "Food, Pharma, Cosmetics" },
      { name: "Sodium Lauryl Sulphate (SLS)", cas: "151-21-3", purity: "90–95%", packaging: "25 kg bag", uses: "Detergents, Shampoos, Toothpaste" },
      { name: "LABSA (Linear Alkyl Benzene Sulphonic Acid)", cas: "27176-87-0", purity: "96%+", packaging: "250 kg drum", uses: "Detergent Manufacturing" },
      { name: "Caustic Lye (50% Solution)", cas: "1310-73-2", purity: "50% w/w", packaging: "1200 kg IBC", uses: "Pulp, Paper, Water Treatment" },
      { name: "Sodium Silicate (Water Glass)", cas: "1344-09-8", purity: "Various ratios", packaging: "250 kg drum", uses: "Adhesives, Cement, Detergents" },
      { name: "Activated Carbon (Powder/Granular)", cas: "7440-44-0", purity: "95%+", packaging: "25 kg bag", uses: "Water Purification, Air Treatment" },
      { name: "Calcium Carbonate (Precipitated)", cas: "471-34-1", purity: "99%+", packaging: "50 kg bag", uses: "Plastics, Rubber, Paints, Paper" },
      { name: "Titanium Dioxide (Rutile/Anatase)", cas: "13463-67-7", purity: "98%+", packaging: "25 kg bag", uses: "Paints, Plastics, Paper" },
      { name: "Carboxymethyl Cellulose (CMC)", cas: "9004-32-4", purity: "Various grades", packaging: "25 kg bag", uses: "Food, Oil Drilling, Textiles" },
      { name: "Polyacrylamide (PAM)", cas: "9003-05-8", purity: "Various grades", packaging: "25 kg bag", uses: "Water Treatment, Papermaking" }
    ]
  },
  "Industrial Chemicals": {
    description: "Bulk industrial chemicals supporting manufacturing, processing and production industries.",
    products: [
      { name: "Sulphuric Acid (Technical)", cas: "7664-93-9", purity: "98%", packaging: "35 kg carboy / Tanker", uses: "Fertilizers, Lead Batteries, Chemicals" },
      { name: "Nitric Acid", cas: "7697-37-2", purity: "68% / 98%", packaging: "35 kg carboy", uses: "Explosives, Fertilizers, Dyes" },
      { name: "Phosphoric Acid (Technical)", cas: "7664-38-2", purity: "85%", packaging: "35 kg HDPE carboy", uses: "Fertilizers, Food Processing, Rust Removal" },
      { name: "Acetic Acid (Glacial)", cas: "64-19-7", purity: "99.5%+", packaging: "30 kg HDPE carboy / Drum", uses: "Vinegar, PET Plastic, Pharma" },
      { name: "Formic Acid", cas: "64-18-6", purity: "85% / 90%", packaging: "30 kg carboy", uses: "Leather, Textile, Rubber" },
      { name: "Caustic Soda Flakes", cas: "1310-73-2", purity: "98–99%", packaging: "25 kg bag", uses: "Soap, Textiles, Paper" },
      { name: "Soda Ash (Dense/Light)", cas: "497-19-8", purity: "99%+", packaging: "50 kg bag / Big Bag", uses: "Glass, Chemicals, Soap" },
      { name: "Sodium Tripolyphosphate (STPP)", cas: "7758-29-4", purity: "94%+", packaging: "25 kg bag", uses: "Detergents, Food, Ceramics" },
      { name: "Bleaching Powder (Calcium Hypochlorite)", cas: "7778-54-3", purity: "30–35% available Cl₂", packaging: "50 kg drum", uses: "Disinfection, Water Treatment" },
      { name: "Liquid Chlorine", cas: "7782-50-5", purity: "99.5%", packaging: "Cylinder (900 kg) / Tonner", uses: "Water Treatment, PVC, Chemicals" },
      { name: "Carbon Disulphide", cas: "75-15-0", purity: "99%", packaging: "250 kg drum", uses: "Rayon, Rubber, Cellophane" },
      { name: "Styrene Monomer", cas: "100-42-5", purity: "99.5%+", packaging: "170 kg drum / Flexi tank", uses: "Plastics, Rubber, Resins" },
      { name: "Methylene Chloride (DCM)", cas: "75-09-2", purity: "99.5%+", packaging: "270 kg drum", uses: "Paint Stripping, Pharma, Foam" },
      { name: "Chloroform", cas: "67-66-3", purity: "99%+", packaging: "270 kg drum", uses: "Pharma, Refrigerants, Dyes" },
      { name: "Carbon Tetrachloride", cas: "56-23-5", purity: "99%+", packaging: "270 kg drum", uses: "Fire Extinguishers, Refrigerants" }
    ]
  },
  "Acids & Alkalis": {
    description: "High-purity acids and alkalis for chemical synthesis, water treatment and industrial processing.",
    products: [
      { name: "Hydrochloric Acid (HCl)", cas: "7647-01-0", purity: "30–35%", packaging: "35 kg HDPE carboy / Tanker", uses: "Steel Pickling, pH Control, Chemicals" },
      { name: "Sulphuric Acid (H₂SO₄)", cas: "7664-93-9", purity: "98%", packaging: "35 kg carboy / Tanker", uses: "Batteries, Fertilizers, Chemicals" },
      { name: "Nitric Acid (HNO₃)", cas: "7697-37-2", purity: "68%", packaging: "35 kg carboy", uses: "Fertilizers, Explosives, Metallurgy" },
      { name: "Phosphoric Acid (H₃PO₄)", cas: "7664-38-2", purity: "85%", packaging: "35 kg HDPE carboy", uses: "Food Processing, Rust Removal, Fertilizers" },
      { name: "Acetic Acid (CH₃COOH)", cas: "64-19-7", purity: "99.5%+ Glacial", packaging: "30 kg carboy", uses: "Chemical Synthesis, Food, Pharma" },
      { name: "Formic Acid (HCOOH)", cas: "64-18-6", purity: "85%", packaging: "30 kg carboy", uses: "Leather, Rubber, Textiles" },
      { name: "Lactic Acid", cas: "50-21-5", purity: "80–88%", packaging: "25 kg carboy", uses: "Food, Pharmaceuticals, Biodegradables" },
      { name: "Citric Acid (Anhydrous)", cas: "77-92-9", purity: "99.5%+", packaging: "25 kg bag", uses: "Food, Beverages, Pharmaceuticals" },
      { name: "Oxalic Acid", cas: "144-62-7", purity: "99%+", packaging: "25 kg bag", uses: "Textile, Leather, Rust Removal" },
      { name: "Tartaric Acid", cas: "87-69-4", purity: "99%+", packaging: "25 kg bag", uses: "Food, Pharma, Cosmetics" },
      { name: "Sodium Hydroxide (NaOH)", cas: "1310-73-2", purity: "98–99% Flakes", packaging: "25 kg bag", uses: "Pulp, Soap, Water Treatment" },
      { name: "Potassium Hydroxide (KOH)", cas: "1310-58-3", purity: "90%+", packaging: "25 kg bag", uses: "Soap, Batteries, Agriculture" },
      { name: "Ammonium Hydroxide", cas: "1336-21-6", purity: "25–30% solution", packaging: "30 kg carboy", uses: "Fertilizers, Cleaning, Pharma" },
      { name: "Calcium Hydroxide (Slaked Lime)", cas: "1305-62-0", purity: "90–95%", packaging: "25 kg bag", uses: "Water Treatment, Construction, Sugar" },
      { name: "Sodium Hypochlorite", cas: "7681-52-9", purity: "12–14% available Cl₂", packaging: "30 kg HDPE carboy", uses: "Disinfection, Bleaching, Water Treatment" }
    ]
  },
  "Other Chemicals": {
    description: "Agro chemicals, food-grade additives and miscellaneous specialty products for varied applications.",
    products: [
      { name: "Urea (Technical/Agricultural)", cas: "57-13-6", purity: "46% N", packaging: "50 kg bag / Big Bag", uses: "Fertilizers, Plastics, Animal Feed" },
      { name: "Diammonium Phosphate (DAP)", cas: "7783-28-0", purity: "18:46:00", packaging: "50 kg bag", uses: "Fertilizer, Fire Retardant" },
      { name: "Mono Ammonium Phosphate (MAP)", cas: "7722-76-1", purity: "11:52:00", packaging: "50 kg bag", uses: "Fertilizer, Fire Retardant" },
      { name: "Potassium Nitrate", cas: "7757-79-1", purity: "99%+", packaging: "50 kg bag", uses: "Fertilizers, Food, Fireworks" },
      { name: "Zinc Sulphate (Agro grade)", cas: "7733-02-0", purity: "33%+", packaging: "50 kg bag", uses: "Micronutrient Fertilizer" },
      { name: "Ferrous Sulphate (Agro grade)", cas: "7720-78-7", purity: "19%+", packaging: "50 kg bag", uses: "Iron Deficiency, Water Treatment" },
      { name: "Copper Sulphate", cas: "7758-98-7", purity: "98%+", packaging: "50 kg bag", uses: "Fungicide, Algae Control, Electroplating" },
      { name: "Manganese Sulphate", cas: "7785-87-7", purity: "31%+ Mn", packaging: "50 kg bag", uses: "Animal Feed, Fertilizer, Batteries" },
      { name: "Sodium Benzoate", cas: "532-32-1", purity: "99%+", packaging: "25 kg bag", uses: "Food Preservative, Pharma" },
      { name: "Potassium Sorbate", cas: "24634-61-5", purity: "99%+", packaging: "25 kg bag", uses: "Food Preservative, Beverages" },
      { name: "Ascorbic Acid (Vitamin C)", cas: "50-81-7", purity: "99%+", packaging: "25 kg bag", uses: "Food, Pharmaceutical, Cosmetics" },
      { name: "Calcium Chloride", cas: "10043-52-4", purity: "74% / 94–97%", packaging: "25 kg bag", uses: "De-icing, Dust Control, Food" },
      { name: "Liquid Paraffin", cas: "8012-95-1", purity: "Various grades", packaging: "170 kg drum", uses: "Pharma, Cosmetics, Rubber" },
      { name: "Castor Oil", cas: "8001-79-4", purity: "First Pressing", packaging: "200 kg drum", uses: "Lubricants, Soap, Pharma, Cosmetics" },
      { name: "White Oil (Food/Tech grade)", cas: "8042-47-5", purity: "Various", packaging: "170 kg drum", uses: "Food Processing, Pharma, Plastics" }
    ]
  }
};
