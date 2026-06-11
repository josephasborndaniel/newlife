export interface AdviceData {
  severity: "High" | "Medium" | "Low";
  recommendations: string[];
}

export const adviceMap: Record<string, AdviceData> = {
  "Melanoma Skin Cancer Nevi and Moles": {
    severity: "High",
    recommendations: [
      "Schedule an urgent consultation with a dermatologist or oncologist for a biopsy.",
      "Avoid direct sun exposure and apply broad-spectrum SPF 50+ sunscreen daily.",
      "Perform monthly self-exams to check for new, changing, or atypical moles (following the ABCDE rule).",
      "Wear protective clothing (hats, long sleeves, UV-blocking sunglasses) when outdoors.",
      "Do not scratch, irritate, or attempt self-treatment of the lesion."
    ]
  },
  "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions": {
    severity: "High",
    recommendations: [
      "Consult a dermatologist promptly for confirmation and discussion of removal therapies (cryotherapy, minor surgery, or topical treatments).",
      "Strictly protect your skin from UV radiation using high-SPF sunscreen and UV-protective clothing.",
      "Monitor the area closely for persistent bleeding, crusting, or failure to heal.",
      "Limit outdoor activities during peak UV index hours (10 AM to 4 PM).",
      "Schedule regular professional full-body skin checkups."
    ]
  },
  "Vascular Tumors": {
    severity: "High",
    recommendations: [
      "Consult a physician or dermatologist to confirm the type of vascular growth.",
      "Avoid physical trauma or friction to the area to prevent sudden bleeding.",
      "Document any changes in size, color, or swelling over time.",
      "Do not apply heat, tight dressings, or attempt self-removal."
    ]
  },
  "Eczema Photos": {
    severity: "Medium",
    recommendations: [
      "Apply thick, fragrance-free moisturizers (ceramide creams) within 3 minutes after bathing.",
      "Avoid hot showers; use lukewarm water and gentle, non-soap cleansers.",
      "Identify and avoid triggers such as harsh detergents, synthetic fabrics, or extreme temperatures.",
      "Avoid scratching to prevent secondary bacterial infections; consider cold compresses instead.",
      "Use prescribed topical treatments exactly as directed by your healthcare provider."
    ]
  },
  "Atopic Dermatitis Photos": {
    severity: "Medium",
    recommendations: [
      "Apply thick, fragrance-free moisturizers (ceramide creams) within 3 minutes after bathing.",
      "Avoid hot showers; use lukewarm water and gentle, non-soap cleansers.",
      "Identify and avoid triggers such as harsh detergents, synthetic fabrics, or extreme temperatures.",
      "Avoid scratching to prevent secondary bacterial infections; consider cold compresses instead.",
      "Use prescribed topical treatments exactly as directed by your healthcare provider."
    ]
  },
  "Psoriasis pictures Lichen Planus and related diseases": {
    severity: "Medium",
    recommendations: [
      "Keep skin well-hydrated with rich emollients to reduce scaling and itching.",
      "Take short, lukewarm baths with colloidal oatmeal or Epsom salts to soothe irritation.",
      "Consult a dermatologist regarding topical corticosteroids, vitamin D analogues, or phototherapy.",
      "Manage stress levels through relaxation techniques, as stress is a major flare trigger.",
      "Expose skin to brief periods of natural sunlight, but strictly avoid sunburn."
    ]
  },
  "Lupus and other Connective Tissue diseases": {
    severity: "Medium",
    recommendations: [
      "Consult a rheumatologist or dermatologist for diagnostic confirmation and autoimmune monitoring.",
      "Strictly avoid sun exposure; wear broad-spectrum SPF 50+ sunscreen and UV-protective clothing daily.",
      "Protect your joints and get adequate rest, especially during active flares.",
      "Track and report systemic symptoms (fever, joint pain, fatigue) to your physician.",
      "Follow your prescribed medical treatment plan consistently."
    ]
  },
  "Bullous Disease Photos": {
    severity: "Medium",
    recommendations: [
      "Consult a dermatologist for a professional evaluation of the blistering condition.",
      "Keep blisters clean and intact to prevent painful open sores and secondary infections.",
      "Apply gentle, non-stick dressings if blisters rupture.",
      "Avoid wearing tight or friction-causing clothing over the affected area.",
      "Seek immediate medical attention if blistering spreads rapidly or affects the mouth/eyes."
    ]
  },
  "Exanthems and Drug Eruptions": {
    severity: "Medium",
    recommendations: [
      "Consult a doctor immediately to review recent medications and identify the potential cause.",
      "Discontinue any new medications only under direct medical supervision.",
      "Use cool baths, cold compresses, and calamine lotion to soothe widespread itching.",
      "Monitor for warning signs such as fever, mucosal involvement, or skin peeling.",
      "Keep hydrated and rest in a cool, comfortable environment."
    ]
  },
  "Poison Ivy Photos and other Contact Dermatitis": {
    severity: "Medium",
    recommendations: [
      "Wash the skin and all exposed clothing/tools immediately with soap and water to remove plant oils.",
      "Apply over-the-counter hydrocortisone cream or calamine lotion to reduce itching.",
      "Avoid scratching the rash to prevent secondary bacterial infections.",
      "Take cool baths or use cold, wet compresses for 15-30 minutes at a time.",
      "Consult a doctor if the rash affects your face, covers a large area, or doesn't improve after a week."
    ]
  },
  "Urticaria Hives": {
    severity: "Medium",
    recommendations: [
      "Avoid known triggers (certain foods, heat, stress, tight clothing, or pressure).",
      "Take a non-drowsy over-the-counter antihistamine to relieve itching and swelling.",
      "Apply cool compresses or take a cool bath to soothe the skin.",
      "Wear loose, lightweight cotton clothing to avoid further irritation.",
      "Seek emergency medical care immediately if hives are accompanied by swelling of the lips/tongue or difficulty breathing."
    ]
  },
  "Vasculitis Photos": {
    severity: "Medium",
    recommendations: [
      "Consult a physician or rheumatologist for evaluation of blood vessel inflammation.",
      "Elevate the affected limbs when resting to reduce swelling and purple spots (purpura).",
      "Avoid prolonged standing or walking during active flare-ups.",
      "Keep the skin clean and monitor closely for any signs of open sores or ulceration.",
      "Follow a balanced diet and follow-up on routine blood/urine tests as requested by your doctor."
    ]
  },
  "Light Diseases and Disorders of Pigmentation": {
    severity: "Medium",
    recommendations: [
      "Use broad-spectrum SPF 50+ sunscreen daily, applying it 15-30 minutes before sun exposure.",
      "Wear wide-brimmed hats, sunglasses, and UV-protective clothing outdoors.",
      "Consult a dermatologist to discuss treatments like topical retinoids, vitamin C, or laser therapy.",
      "Monitor pigmentation spots monthly for changes in size, border, or shape.",
      "Avoid midday sun (10 AM to 4 PM) and tanning beds entirely."
    ]
  },
  "Systemic Disease": {
    severity: "Medium",
    recommendations: [
      "Consult your primary care physician for comprehensive health screenings and diagnostics.",
      "Keep a log of all skin changes and systemic symptoms (fatigue, weight changes, joint pain).",
      "Manage underlying chronic conditions (diabetes, thyroid issues, etc.) through regular medication and checkups.",
      "Maintain a healthy lifestyle with balanced nutrition, hydration, and regular gentle exercise.",
      "Follow up with specialists as recommended by your physician."
    ]
  },
  "Acne and Rosacea Photos": {
    severity: "Low",
    recommendations: [
      "Wash your face twice daily with a gentle, non-comedogenic cleanser.",
      "Apply topical treatments containing salicylic acid, benzoyl peroxide, or azelaic acid.",
      "Avoid touching, picking, or squeezing blemishes to prevent scarring and infection.",
      "Use oil-free, non-comedogenic cosmetics, sunscreens, and moisturizers.",
      "Avoid rosacea triggers such as spicy foods, alcohol, hot beverages, and extreme weather."
    ]
  },
  "Seborrheic Keratoses and other Benign Tumors": {
    severity: "Low",
    recommendations: [
      "Keep in mind these growths are completely benign (non-cancerous) and normally do not require treatment.",
      "Consult a dermatologist if a growth becomes inflamed, bleeds, or catches on clothing.",
      "Do not try to scratch, pick, or peel the growth off yourself to avoid scarring and infection.",
      "Schedule a dermatologist visit if you want it removed for cosmetic reasons (typically via cryotherapy).",
      "Continue monitoring your skin monthly for any new or rapidly growing lesions."
    ]
  },
  "Warts Molluscum and other Viral Infections": {
    severity: "Low",
    recommendations: [
      "Avoid picking or scratching warts/molluscum lesions to prevent spreading them to other parts of your body.",
      "Wash your hands thoroughly after touching the affected area.",
      "Do not share towels, clothing, razors, or other personal items.",
      "Cover lesions with a bandage or clothing when swimming or playing sports.",
      "Consult a healthcare provider for safe removal options (salicylic acid, cryotherapy, or cantharidin)."
    ]
  },
  "Tinea Ringworm Candidiasis and other Fungal Infections": {
    severity: "Low",
    recommendations: [
      "Apply over-the-counter antifungal creams (miconazole, clotrimazole, terbinafine) twice daily.",
      "Keep the affected skin dry, cool, and exposed to air when possible.",
      "Wash towels, socks, and bedding frequently in hot water.",
      "Avoid walking barefoot in public locker rooms, showers, or pools.",
      "Complete the entire duration of the antifungal treatment even if symptoms disappear early."
    ]
  },
  "Cellulitis Impetigo and other Bacterial Infections": {
    severity: "Low",
    recommendations: [
      "Consult a physician promptly for prescription oral or topical antibiotics.",
      "Clean the affected area gently with mild soap and water, then cover with a sterile bandage.",
      "Do not squeeze or pop pus-filled blisters to avoid spreading the bacteria.",
      "Wash your hands frequently with soap and water.",
      "Wash clothing, towels, and sheets of the infected person daily and do not share them."
    ]
  },
  "Herpes HPV and other STDs Photos": {
    severity: "Low",
    recommendations: [
      "Consult a healthcare professional or sexual health clinic for diagnostic testing and antiviral treatment.",
      "Avoid intimate physical contact during active outbreaks to prevent transmission.",
      "Keep the affected area clean and dry.",
      "Wash your hands immediately if you touch the sores.",
      "Use barrier protection (condoms) consistently and discuss status openly with partners."
    ]
  },
  "Nail Fungus and other Nail Disease": {
    severity: "Low",
    recommendations: [
      "Consult a podiatrist or dermatologist to discuss oral or topical antifungal options.",
      "Keep nails trimmed short, clean, and dry.",
      "Apply topical antifungal lacquer as prescribed or directed.",
      "Wear breathable socks and shoes, and change socks daily or after sweating.",
      "Disinfect nail clippers after each use and avoid sharing them."
    ]
  },
  "Scabies Lyme Disease and other Infestations and Bites": {
    severity: "Low",
    recommendations: [
      "Consult a doctor for prescription scabicide lotions or antibiotic treatments for Lyme disease.",
      "Wash all clothing, bedding, and towels used in the last 3 days in hot water and dry on high heat.",
      "Ensure all household members or close contacts are treated simultaneously if scabies is diagnosed.",
      "Avoid scratching bites to prevent secondary skin infections.",
      "Wear insect repellent containing DEET and check for ticks after spending time outdoors."
    ]
  },
  "Hair Loss Photos Alopecia and other Hair Diseases": {
    severity: "Low",
    recommendations: [
      "Consult a dermatologist to identify the specific type of hair loss (alopecia areata, androgenetic, etc.).",
      "Avoid harsh chemical treatments, tight hairstyles, and excessive heat styling.",
      "Wash hair gently with a mild, sulfate-free shampoo.",
      "Eat a balanced diet rich in iron, zinc, biotin, and protein to support hair health.",
      "Manage stress, which can trigger or exacerbate certain hair loss conditions."
    ]
  },
  "Healthy Skin": {
    severity: "Low",
    recommendations: [
      "Congratulations! Your skin check shows characteristics consistent with healthy, normal skin.",
      "Maintain a daily routine: cleanse gently, moisturize, and apply SPF 30+ sunscreen daily.",
      "Stay well-hydrated and consume a balanced diet rich in antioxidants.",
      "Avoid smoking and excessive alcohol consumption, which can dry out and age the skin.",
      "Continue performing monthly skin self-checks to stay aware of your baseline skin health."
    ]
  }
};

export const getAdvice = (condition: string): AdviceData => {
  return adviceMap[condition] || {
    severity: "Low",
    recommendations: [
      "Schedule a routine appointment with a dermatologist for professional evaluation.",
      "Avoid direct sun exposure and use SPF 30+ sunscreen daily.",
      "Keep the affected area clean and moisturized.",
      "Document any changes in size, color, or texture with photos.",
      "Do not attempt self-treatment or scratch the area."
    ]
  };
};
