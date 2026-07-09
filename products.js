/* ============================================================
   VIVO — PRODUCT + BENEFIT DATA
   Single source of truth for every page (home, shop, product,
   coa, contact, checkout). Loaded as a classic script before
   each page's inline logic, so PRODUCTS, BENEFITS and
   BENEFIT_BY_ID are available as globals.

   Prices are placeholders — confirm before launch.
   ============================================================ */

/* Benefit taxonomy — products reference these by id.
   `name` is the customer-facing label shown on the homepage,
   shop filters, and product pages. */
const BENEFITS = [
  { id:'recovery',    name:'Regenerative',        k:'Regeneration', color:'#7B3B34' },
  { id:'skin',        name:'Dermal & structural', k:'Structure',    color:'#C4913A' },
  { id:'vitality',    name:'Neuroactive',         k:'Neural',       color:'#3D5C36' },
  { id:'metabolic',   name:'Metabolic',           k:'Metabolic',    color:'#3A5268' }
];

/* Quick lookup by benefit id, e.g. BENEFIT_BY_ID.skin.name */
const BENEFIT_BY_ID = Object.fromEntries(BENEFITS.map(b => [b.id, b]));

const PRODUCTS = [
  { id:'glow', name:'GLOW', benefit:'skin', cat:'Skin & Renewal', dose:'5 mg', price:120, ph:'#cdbb95', img:'Products/Vials/clean/vial_glow.png', detailVideo:'glow_float_card.mp4', blurb:'Copper-peptide complex, GHK-Cu family',
    tagline:'The copper peptide behind skin’s firmness and structure.',
    overview:'GLOW is a copper-peptide complex studied for the structures that keep skin firm, even and resilient. A compound naturally present in plasma, concentrated for research.',
    points:['Studied for skin firmness and elasticity','Researched for tone and texture','Copper peptide, naturally occurring'],
    whatItIs:'A lyophilised copper-peptide complex (the GHK-Cu family) prepared to research grade. Each vial holds 5 mg of compound and nothing else.',
    howItWorks:'Copper peptides are associated with the signalling skin uses to remodel collagen and elastin. GLOW concentrates that signal so it can be studied directly.' },

  { id:'bpc157', name:'BPC-157', benefit:'recovery', cat:'Recovery & Healing', dose:'10 mg', price:95, ph:'#b69487', img:'Products/Vials/clean/vial_bpc147.png', detailVideo:'bpc157_float_card.mp4', blurb:'Gastric pentadecapeptide',
    tagline:'The body-protection compound the gut already makes.',
    overview:'BPC-157 is a peptide sequence the body produces in the gut, researched for tissue repair and connective tissue. A naturally occurring compound, concentrated for research.',
    points:['Researched for tissue repair','Studied for gut and connective tissue','Naturally occurring sequence'],
    whatItIs:'A 10 mg lyophilised peptide, a stable fragment of a protective protein found in gastric juice, prepared to research grade.',
    howItWorks:'Research focuses on BPC-157’s role in repair signalling and the maintenance of connective and gut tissue.' },

  { id:'selank', name:'Selank', benefit:'vitality', cat:'Mind, Mood & Sleep', dose:'5 mg', price:70, ph:'#b9b893', img:'Products/Vials/clean/vial_selank.png', detailVideo:'selank_float_card.mp4', blurb:'Synthetic tetrapeptide analog',
    tagline:'Studied for calm, focus, and the quality of rest.',
    overview:'Selank is an anxiolytic peptide researched for a steadier baseline. Calm without sedation, focus without edge.',
    points:['Researched for calm and focus','Studied for sleep quality','Non-sedating profile'],
    whatItIs:'A 5 mg lyophilised peptide, a synthetic analog of a naturally occurring tetrapeptide, prepared to research grade.',
    howItWorks:'Selank is studied for its effect on the signalling tied to stress response, attention and mood.' },

  { id:'nad', name:'NAD+', benefit:'vitality', cat:'Cellular Energy', dose:'5 mg', price:110, ph:'#b6b48f', img:'Products/Vials/clean/vial_nad+.png', detailVideo:'nad_float_card.mp4', blurb:'Nicotinamide adenine dinucleotide',
    tagline:'The coenzyme at the centre of cellular energy.',
    overview:'NAD+ is a coenzyme every cell uses to make energy and run repair. Levels fall with time; this preparation concentrates it for research.',
    points:['Central to cellular energy','Studied for repair pathways','Declines naturally over time'],
    whatItIs:'A 5 mg lyophilised preparation of nicotinamide adenine dinucleotide, prepared to research grade.',
    howItWorks:'NAD+ is a cofactor for the enzymes that convert nutrients into energy and carry out cellular repair.' },

  { id:'glutathione', name:'Glutathione', benefit:'skin', cat:'Detox & Antioxidant', dose:'5 mg', price:85, ph:'#b39184', img:'Products/Vials/clean/vial_glutathione.png', detailVideo:'glutathione_float_card.mp4', blurb:'Reduced glutathione (GSH)',
    tagline:'The body’s master antioxidant, prepared for research.',
    overview:'Glutathione is the antioxidant cells rely on most, studied for oxidative defence, detox pathways and skin clarity.',
    points:['Primary cellular antioxidant','Studied for detox pathways','Studied for skin brightness'],
    whatItIs:'A 5 mg lyophilised preparation of reduced glutathione, prepared to research grade.',
    howItWorks:'Glutathione neutralises reactive oxygen species and is studied for its role in the liver’s detox enzymes.' },

  { id:'glp3', name:'GLP-3', benefit:'metabolic', cat:'Metabolic Balance', dose:'5 mg', price:130, ph:'#9aa6b0', img:'Products/Vials/clean/vial_bpcglp-3.png', detailVideo:'glp3_float_card.mp4', blurb:'GLP-family metabolic peptide',
    tagline:'Next-generation metabolic balance.',
    overview:'GLP-3 is a metabolic peptide studied for steady appetite signalling and balanced energy use.',
    points:['Studied for metabolic regulation','Appetite signalling','Steady energy'],
    whatItIs:'A 5 mg lyophilised peptide of the GLP family, prepared to research grade.',
    howItWorks:'GLP peptides are studied for their role in the gut-brain signalling that governs appetite and glucose handling.' },

  { id:'aod9604', name:'AOD-9604', benefit:'metabolic', cat:'Lipotropic', dose:'5 mg', price:90, ph:'#94a1ad', img:'Products/Vials/clean/vial_aod9604.png', detailVideo:'aod9604_float_card.mp4', blurb:'hGH fragment (176-191)',
    tagline:'A lipotropic fragment of a peptide the body already makes.',
    overview:'AOD-9604 is a targeted fragment of human growth hormone studied for lipid metabolism, without the rest of the hormone’s activity.',
    points:['Studied for lipid metabolism','Targeted HGH fragment (176-191)','Non-glycemic profile'],
    whatItIs:'A 5 mg lyophilised peptide fragment (the 176-191 region of hGH), prepared to research grade.',
    howItWorks:'AOD-9604 isolates the fat-metabolism portion of the growth-hormone molecule so it can be studied on its own.' },
];
