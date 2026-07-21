/* ============================================================
   VIVO — PRODUCT + BENEFIT DATA
   Single source of truth for every page (home, shop, product,
   coa, certificate, contact, checkout). Loaded as a classic
   script before each page's inline logic, so PRODUCTS, BENEFITS
   and BENEFIT_BY_ID are available as globals.

   Prices are PLACEHOLDERS; confirm before launch.
   New products use a placeholder image (assets/products/placeholder.png);
   swap in real vial art when available.
   ============================================================ */

/* Research-area taxonomy. `name` is the customer-facing label
   shown on the homepage, shop filters, product pages and COA.
   All labels are scientific / mechanism-based (research-use framing). */
const BENEFITS = [
  { id:'recovery',     name:'Regenerative',        k:'Regeneration',   color:'#7B3B34' },
  { id:'skin',         name:'Dermal & structural', k:'Structure',      color:'#C4913A' },
  { id:'vitality',     name:'Neuroactive',         k:'Neural',         color:'#3D5C36' },
  { id:'metabolic',    name:'Metabolic',           k:'Metabolic',      color:'#3A5268' },
  { id:'somatotropic', name:'Somatotropic',        k:'GH axis',        color:'#3E6E73' },
  { id:'supplies',     name:'Lab supplies',        k:'Reconstitution', color:'#8C9196' }
];

/* Quick lookup by benefit id, e.g. BENEFIT_BY_ID.skin.name */
const BENEFIT_BY_ID = Object.fromEntries(BENEFITS.map(b => [b.id, b]));

/* Per-SKU quantity discount: 5% off at 3 units, 10% off at 6+ units. */
function qtyDiscountRate(q){ return q >= 6 ? 0.10 : q >= 3 ? 0.05 : 0; }

/* Promo codes (demo). type 'pct' = fraction off subtotal, 'flat' = dollars off. */
const PROMOS = {
  'VIVO10':     { label:'10% off',  type:'pct',  value:0.10 },
  'RESEARCH15': { label:'15% off',  type:'pct',  value:0.15 },
  'WELCOME20':  { label:'$20 off',  type:'flat', value:20 }
};

const PH = 'assets/products/placeholder.png';

/* Each product carries a `variants` array (dose / vial-size options).
   Product-level `dose` and `price` mirror the default (first) variant
   so cards, the cart and quick-add keep working unchanged. */
const PRODUCTS = [
  /* ---------------- Regenerative ---------------- */
  { id:'bpc157', name:'BPC-157', benefit:'recovery', cat:'Pentadecapeptide', ph:'#b69487',
    img:'assets/products/vial-bpc157.png?v=2', detailVideo:'assets/video/bpc157-float-card.mp4', blurb:'Gastric pentadecapeptide',
    dose:'10 mg · 5 mL', price:99, variants:[{dose:'10 mg', vial:'5 mL', price:99}],
    tagline:'The protective peptide the gut makes.',
    overview:'BPC-157 is a peptide sequence the body produces in the gut, researched for tissue repair and connective tissue. A naturally occurring compound, concentrated for research.',
    points:['Researched for tissue repair','Studied for gut and connective tissue','Naturally occurring sequence'],
    whatItIs:'A 10 mg lyophilised peptide, a stable fragment of a protective protein found in gastric juice, prepared to research grade.',
    howItWorks:'Research focuses on BPC-157’s role in repair signalling and the maintenance of connective and gut tissue.' },

  { id:'tb500', name:'TB-500', benefit:'recovery', cat:'Thymosin β4 fragment', ph:'#c0a79c',
    img:'assets/products/vial-tb500.png?v=2', blurb:'Synthetic thymosin beta-4 fragment',
    dose:'10 mg · 5 mL', price:99, variants:[{dose:'10 mg', vial:'5 mL', price:99}],
    tagline:'The thymosin fragment behind repair.',
    overview:'TB-500 is a synthetic fragment of thymosin beta-4, characterised for its role in actin regulation. It is researched for the cellular pathways associated with tissue repair and cell migration.',
    points:['Studied in actin regulation','Investigated for tissue repair','Researched for cell migration'],
    whatItIs:'A lyophilised peptide fragment derived from the thymosin beta-4 sequence, concentrated for research.',
    howItWorks:'Research focuses on its interaction with actin and the signalling associated with cell migration and tissue remodelling.' },

  { id:'wolverine', name:'Wolverine', benefit:'recovery', cat:'Repair peptide blend', composition:'BPC-157 / TB-500', blend:[{name:'BPC-157',dose:'10 mg'},{name:'TB-500',dose:'10 mg'}], ph:'#b89a8e',
    img:'assets/products/vial-wolverine.png?v=2', blurb:'BPC-157 and TB-500 repair blend',
    dose:'10 / 10 mg · 5 mL', price:175, variants:[{dose:'10 / 10 mg', vial:'5 mL', price:175}],
    tagline:'Two repair peptides, one blend.',
    overview:'Wolverine is a research blend of BPC-157 and TB-500, two peptides associated with repair signalling. It is investigated for the connective-tissue and cellular pathways each compound engages.',
    points:['Studied for repair signalling','Investigated in connective tissue','Researched for tissue remodelling'],
    whatItIs:'A lyophilised blend of two repair peptides, BPC-157 and the thymosin beta-4 fragment TB-500.',
    howItWorks:'Research focuses on the combined pathways of BPC-157 in repair signalling and TB-500 in actin regulation and cell migration.' },

  /* ---------------- Dermal & structural ---------------- */
  { id:'ghk-cu', name:'GHK-Cu', benefit:'skin', cat:'Copper tripeptide', ph:'#cdbb95',
    img:'assets/products/vial-ghk-cu.png?v=2', blurb:'Copper tripeptide GHK-Cu',
    dose:'50 mg · 10 mL', price:75, variants:[{dose:'50 mg', vial:'10 mL', price:75}],
    tagline:'The copper tripeptide for skin matrix.',
    overview:'GHK-Cu is a copper tripeptide, a compound naturally present in plasma and characterised for its role in matrix remodelling. It is researched for the collagen and skin-matrix signalling pathways it participates in.',
    points:['Studied in matrix remodelling','Investigated for collagen signalling','Researched for skin-structure pathways'],
    whatItIs:'A lyophilised copper tripeptide, the naturally occurring GHK sequence complexed with copper, concentrated for research.',
    howItWorks:'Research focuses on its role in the signalling associated with collagen and elastin remodelling and skin-matrix maintenance.' },

  { id:'glow', name:'GLOW', benefit:'skin', cat:'Skin-matrix blend', composition:'GHK-Cu / BPC-157 / TB-500', blend:[{name:'GHK-Cu',dose:'50 mg'},{name:'BPC-157',dose:'10 mg'},{name:'TB-500',dose:'10 mg'}], ph:'#cdbb95',
    img:'assets/products/vial-glow.png?v=2', detailVideo:'assets/video/glow-float-card.mp4', blurb:'GHK-Cu, BPC-157 and TB-500 blend',
    dose:'50 / 10 / 10 mg · 10 mL', price:215, variants:[{dose:'50 / 10 / 10 mg', vial:'10 mL', price:215}],
    tagline:'A three-peptide skin-matrix blend.',
    overview:'GLOW is a research blend of GHK-Cu, BPC-157 and TB-500, pairing a copper tripeptide with two repair peptides. It is investigated for the skin-matrix and tissue-repair pathways the three compounds engage.',
    points:['Studied for skin-matrix signalling','Investigated in tissue repair','Researched for matrix remodelling'],
    whatItIs:'A lyophilised blend of three peptides: the copper tripeptide GHK-Cu and the repair peptides BPC-157 and TB-500.',
    howItWorks:'Research focuses on GHK-Cu in matrix and collagen signalling alongside BPC-157 and TB-500 in repair and cell-migration pathways.' },

  { id:'klow', name:'KLOW', benefit:'skin', cat:'Skin-matrix blend', composition:'GHK-Cu / BPC-157 / TB-500 / KPV', blend:[{name:'GHK-Cu',dose:'50 mg'},{name:'BPC-157',dose:'10 mg'},{name:'TB-500',dose:'10 mg'},{name:'KPV',dose:'10 mg'}], ph:'#c8b48f',
    img:'assets/products/vial-klow.png?v=2', blurb:'GHK-Cu, BPC-157, TB-500 and KPV blend',
    dose:'50 / 10 / 10 / 10 mg · 10 mL', price:199, variants:[{dose:'50 / 10 / 10 / 10 mg', vial:'10 mL', price:199}],
    tagline:'A four-peptide skin and repair blend.',
    overview:'KLOW is a research blend of GHK-Cu, BPC-157, TB-500 and the tripeptide KPV. It is investigated for the skin-matrix, tissue-repair and modulatory pathways the four compounds engage.',
    points:['Studied for skin-matrix signalling','Investigated in tissue repair','Researched for modulatory pathways'],
    whatItIs:'A lyophilised blend of four peptides: the copper tripeptide GHK-Cu, the repair peptides BPC-157 and TB-500, and the KPV tripeptide.',
    howItWorks:'Research focuses on GHK-Cu in matrix signalling, BPC-157 and TB-500 in repair pathways, and KPV in the modulatory signalling under study.' },

  { id:'glutathione', name:'Glutathione', benefit:'skin', cat:'Tripeptide antioxidant', ph:'#b39184',
    img:'assets/products/vial-glutathione.png?v=2', detailVideo:'assets/video/glutathione-float-card.mp4', blurb:'Reduced glutathione (GSH)',
    dose:'1500 mg · 10 mL', price:79, variants:[{dose:'1500 mg', vial:'10 mL', price:79}],
    tagline:'The cell’s primary antioxidant.',
    overview:'Glutathione is the antioxidant cells rely on most, studied for oxidative defence and detox pathways. A naturally occurring tripeptide, concentrated for research.',
    points:['Primary cellular antioxidant','Studied for detox pathways','Naturally occurring tripeptide'],
    whatItIs:'A 1500 mg lyophilised preparation of reduced glutathione, prepared to research grade.',
    howItWorks:'Glutathione neutralises reactive oxygen species and is studied for its role in the enzymes that carry out cellular detoxification.' },

  /* ---------------- Neuroactive ---------------- */
  { id:'semax', name:'Semax', benefit:'vitality', cat:'ACTH(4-10) analog', ph:'#bcbd98',
    img:'assets/products/vial-semax.png?v=2', blurb:'ACTH(4-10)-related heptapeptide',
    dose:'10 mg · 5 mL', price:75, variants:[{dose:'10 mg', vial:'5 mL', price:75}],
    tagline:'An ACTH-related neuropeptide.',
    overview:'Semax is a heptapeptide analog related to the ACTH(4-10) sequence, characterised for its neuropeptide activity. It is investigated for the neurotrophic and cognitive-signalling pathways under study.',
    points:['Studied in neuropeptide signalling','Investigated for neurotrophic pathways','Researched in cognitive signalling'],
    whatItIs:'A lyophilised heptapeptide analog derived from the ACTH(4-10) sequence, concentrated for research.',
    howItWorks:'Research focuses on its neuropeptide activity and the neurotrophic and modulatory signalling pathways associated with the ACTH-related sequence.' },

  { id:'selank', name:'Selank', benefit:'vitality', cat:'Tuftsin analog', ph:'#b9b893',
    img:'assets/products/vial-selank.png?v=2', detailVideo:'assets/video/selank-float-card.mp4', blurb:'Synthetic tuftsin analog',
    dose:'10 mg · 5 mL', price:75, variants:[{dose:'10 mg', vial:'5 mL', price:75}],
    tagline:'A tuftsin analog for stress study.',
    overview:'Selank is a synthetic analog of a naturally occurring tuftsin peptide, researched for the signalling tied to stress response and attention. A naturally derived sequence, concentrated for research.',
    points:['Researched in stress-response signalling','Studied for attention pathways','Naturally derived sequence'],
    whatItIs:'A 10 mg lyophilised peptide, a synthetic analog of a naturally occurring tuftsin tetrapeptide, prepared to research grade.',
    howItWorks:'Selank is studied for its effect on the signalling associated with stress response, attention and mood regulation.' },

  { id:'pt141', name:'PT-141', benefit:'vitality', cat:'Melanocortin agonist', ph:'#b3b48c',
    img:'assets/products/vial-pt141.png?v=2', blurb:'Melanocortin receptor agonist',
    dose:'10 mg · 5 mL', price:75, variants:[{dose:'10 mg', vial:'5 mL', price:75}],
    tagline:'A melanocortin receptor agonist.',
    overview:'PT-141 (bremelanotide) is a melanocortin receptor agonist, characterised for its activity across the melanocortin system. It is researched for the central signalling pathways this receptor family governs.',
    points:['Studied at melanocortin receptors','Investigated in central signalling','Researched for the melanocortin system'],
    whatItIs:'A lyophilised peptide of the melanocortin agonist class, the compound bremelanotide, concentrated for research.',
    howItWorks:'Research examines its binding at melanocortin receptors and the central signalling pathways associated with that system.' },

  { id:'nad', name:'NAD+', benefit:'vitality', cat:'Cellular coenzyme', ph:'#b6b48f',
    img:'assets/products/vial-nad.png?v=2', detailVideo:'assets/video/nad-float-card.mp4', blurb:'Nicotinamide adenine dinucleotide',
    dose:'1000 mg · 10 mL', price:135, variants:[{dose:'1000 mg', vial:'10 mL', price:135}],
    tagline:'The coenzyme of cellular energy.',
    overview:'NAD+ is a coenzyme every cell uses in energy metabolism and repair, concentrated for research. A naturally occurring cofactor, studied across cellular-energy pathways.',
    points:['Central to cellular-energy pathways','Studied for repair signalling','Naturally occurring cofactor'],
    whatItIs:'A 1000 mg lyophilised preparation of nicotinamide adenine dinucleotide, prepared to research grade.',
    howItWorks:'NAD+ is a cofactor for the enzymes that convert nutrients into energy and carry out cellular repair, and is studied across those pathways.' },

  /* ---------------- Metabolic ---------------- */
  { id:'glp1s', name:'GLP-1 S', benefit:'metabolic', cat:'GLP-1 analog', ph:'#9aa6b0',
    img:'assets/products/vial-glp1s.png?v=2', blurb:'GLP-1 receptor agonist analog',
    dose:'10 mg · 5 mL', price:139,
    variants:[{dose:'10 mg', vial:'5 mL', price:139},{dose:'30 mg', vial:'10 mL', price:199}],
    tagline:'The incretin analog for metabolic study.',
    overview:'GLP-1 S is a GLP-1 receptor agonist analog, characterised for its stability at the incretin receptor. It is researched for the metabolic and glucose-signalling pathways that the GLP-1 system governs.',
    points:['Studied at the GLP-1 receptor','Investigated in metabolic signalling','Researched for incretin pathways'],
    whatItIs:'A lyophilised peptide of the incretin class, a synthetic analog of the GLP-1 receptor agonist family.',
    howItWorks:'Research focuses on its binding at the GLP-1 receptor and the downstream incretin signalling that regulates glucose and appetite pathways.' },

  { id:'glp2t', name:'GLP-2 T', benefit:'metabolic', cat:'GLP-2 analog', ph:'#94a1ad',
    img:'assets/products/vial-glp2t.png?v=2', blurb:'GLP-2 analog peptide',
    dose:'10 mg · 5 mL', price:139,
    variants:[{dose:'10 mg', vial:'5 mL', price:139},{dose:'30 mg', vial:'10 mL', price:199}],
    tagline:'An intestinal incretin peptide.',
    overview:'GLP-2 T is a GLP-2 analog, characterised for its activity in the intestinal incretin pathway. It is researched for the signalling associated with gut epithelium and mucosal structure.',
    points:['Investigated in intestinal signalling','Studied at the GLP-2 receptor','Researched for gut-tissue pathways'],
    whatItIs:'A lyophilised peptide of the incretin family, a synthetic analog of the GLP-2 sequence.',
    howItWorks:'Research examines its binding at the GLP-2 receptor and the pathways associated with intestinal epithelial growth and mucosal maintenance.' },

  { id:'glp3r', name:'GLP-3 R', benefit:'metabolic', cat:'GLP-family peptide', ph:'#9aa6b0',
    img:'assets/products/vial-glp3r.png?v=2', detailVideo:'assets/video/glp3-float-card.mp4', blurb:'Next-generation GLP-family metabolic peptide',
    dose:'10 mg · 5 mL', price:169,
    variants:[{dose:'10 mg', vial:'5 mL', price:169},{dose:'30 mg', vial:'10 mL', price:329}],
    tagline:'A next-generation GLP peptide.',
    overview:'GLP-3 R is a next-generation peptide within the GLP metabolic family, characterised for extended receptor engagement. It is investigated for the incretin and metabolic pathways the GLP class governs.',
    points:['Studied in metabolic signalling','Investigated at GLP receptors','Researched for incretin pathways'],
    whatItIs:'A lyophilised peptide of the GLP metabolic class, a next-generation analog concentrated for research.',
    howItWorks:'Research focuses on its engagement across GLP-family receptors and the downstream metabolic signalling under study.' },

  { id:'cagrilintide', name:'Cagrilintide', benefit:'metabolic', cat:'Amylin analog', ph:'#94a1ad',
    img:'assets/products/vial-cagrilintide.png?v=2', blurb:'Long-acting amylin analog',
    dose:'10 mg · 5 mL', price:119, variants:[{dose:'10 mg', vial:'5 mL', price:119}],
    tagline:'A long-acting amylin analog.',
    overview:'Cagrilintide is a long-acting amylin analog, characterised for its extended activity at amylin receptors. It is researched for the metabolic and appetite-signalling pathways the amylin system governs.',
    points:['Studied at amylin receptors','Investigated in appetite signalling','Researched for metabolic pathways'],
    whatItIs:'A lyophilised peptide of the amylin analog class, engineered for prolonged receptor activity and concentrated for research.',
    howItWorks:'Research examines its binding at amylin receptors and the signalling associated with appetite and metabolic regulation.' },

  { id:'motsc', name:'MOTS-C', benefit:'metabolic', cat:'Mitochondrial peptide', ph:'#9aa6b0',
    img:'assets/products/vial-motsc.png?v=2', blurb:'Mitochondrial-derived signalling peptide',
    dose:'10 mg · 5 mL', price:129, variants:[{dose:'10 mg', vial:'5 mL', price:129}],
    tagline:'A mitochondrial-derived peptide.',
    overview:'MOTS-C is a mitochondrial-derived peptide, characterised for its role in metabolic regulation. It is investigated for the mitochondrial and metabolic signalling pathways it participates in.',
    points:['Studied in mitochondrial signalling','Investigated for metabolic regulation','Researched for cellular-energy pathways'],
    whatItIs:'A lyophilised mitochondrial-derived peptide, a naturally occurring sequence concentrated for research.',
    howItWorks:'Research focuses on its role in mitochondrial signalling and the metabolic pathways associated with cellular-energy regulation.' },

  { id:'glp1s-bpc', name:'GLP-1 S / BPC-157', benefit:'metabolic', cat:'GLP-1 + BPC-157', composition:'GLP-1 S / BPC-157', blend:[{name:'GLP-1 S',dose:'5 mg'},{name:'BPC-157',dose:'650 mcg'}], ph:'#9aa6b0',
    img:'assets/products/vial-glp1s-bpc.png?v=2', blurb:'GLP-1 analog and BPC-157 blend',
    dose:'5 mg / 650 mcg · 5 mL', price:119, variants:[{dose:'5 mg / 650 mcg', vial:'5 mL', price:119}],
    tagline:'An incretin and a repair peptide.',
    overview:'GLP-1 S / BPC-157 is a research blend pairing a GLP-1 receptor agonist analog with the repair peptide BPC-157. It is investigated for the metabolic and tissue-repair pathways the two compounds engage.',
    points:['Studied in incretin signalling','Investigated for repair pathways','Researched across metabolic and tissue systems'],
    whatItIs:'A lyophilised blend of two peptides: a GLP-1 receptor agonist analog and the gut-derived repair peptide BPC-157.',
    howItWorks:'Research focuses on the GLP-1 analog at the incretin receptor alongside BPC-157’s role in repair and connective-tissue signalling.' },

  { id:'glp2t-bpc', name:'GLP-2 T / BPC-157', benefit:'metabolic', cat:'GLP-2 + BPC-157', composition:'GLP-2 T / BPC-157', blend:[{name:'GLP-2 T',dose:'30 mg'},{name:'BPC-157',dose:'1.3 mg'}], ph:'#94a1ad',
    img:'assets/products/vial-glp2t-bpc.png?v=2', blurb:'GLP-2 analog and BPC-157 blend',
    dose:'30 mg / 1.3 mg · 10 mL', price:219, variants:[{dose:'30 mg / 1.3 mg', vial:'10 mL', price:219}],
    tagline:'An intestinal incretin and repair blend.',
    overview:'GLP-2 T / BPC-157 is a research blend pairing a GLP-2 analog with the repair peptide BPC-157. It is investigated for the intestinal and tissue-repair pathways the two compounds engage.',
    points:['Studied in intestinal signalling','Investigated for repair pathways','Researched across gut and tissue systems'],
    whatItIs:'A lyophilised blend of two peptides: a GLP-2 analog and the gut-derived repair peptide BPC-157.',
    howItWorks:'Research focuses on the GLP-2 analog at the intestinal receptor alongside BPC-157’s role in gut and connective-tissue repair signalling.' },

  /* ---------------- Somatotropic ---------------- */
  { id:'cjc-ipa', name:'CJC-1295 / Ipamorelin', benefit:'somatotropic', cat:'GHRH + secretagogue', composition:'CJC-1295 / Ipamorelin', blend:[{name:'CJC-1295',dose:'5 mg'},{name:'Ipamorelin',dose:'5 mg'}], ph:'#9db3b5',
    img:'assets/products/vial-cjc-ipa.png?v=2', blurb:'GHRH analog and GH secretagogue blend',
    dose:'5 / 5 mg · 5 mL', price:99, variants:[{dose:'5 / 5 mg', vial:'5 mL', price:99}],
    tagline:'A paired somatotropic-axis study.',
    overview:'CJC-1295 / Ipamorelin is a research blend pairing a GHRH analog with a growth-hormone secretagogue. It is investigated for the somatotropic axis and the signalling that governs growth-hormone release.',
    points:['Studied at the GHRH receptor','Investigated in secretagogue signalling','Researched for the somatotropic axis'],
    whatItIs:'A lyophilised blend of two peptides: CJC-1295, a GHRH analog, and Ipamorelin, a growth-hormone secretagogue.',
    howItWorks:'Research examines how the two peptides act on the somatotropic axis, one at the GHRH receptor and one as a secretagogue, to study growth-hormone signalling.' },

  { id:'tesamorelin', name:'Tesamorelin', benefit:'somatotropic', cat:'GHRH analog', ph:'#9db3b5',
    img:'assets/products/vial-tesamorelin.png?v=2', blurb:'GHRH analog peptide',
    dose:'10 mg · 5 mL', price:129, variants:[{dose:'10 mg', vial:'5 mL', price:129}],
    tagline:'A GHRH analog of the GH axis.',
    overview:'Tesamorelin is a GHRH analog, characterised for its stability at the GHRH receptor. It is researched for the somatotropic axis and the signalling that governs growth-hormone release.',
    points:['Studied at the GHRH receptor','Investigated in the somatotropic axis','Researched for growth-hormone signalling'],
    whatItIs:'A lyophilised peptide of the GHRH analog class, a stabilised analog concentrated for research.',
    howItWorks:'Research examines its binding at the GHRH receptor and the downstream signalling associated with growth-hormone release.' },

  /* ---------------- Lab supplies ---------------- */
  { id:'research-water', name:'Research Water', benefit:'supplies', cat:'Bacteriostatic water', ph:'#b4bcc0',
    img:PH, blurb:'Bacteriostatic reconstitution solvent',
    dose:'30 mL', price:30,
    variants:[{dose:'30 mL', vial:'', price:30},{dose:'10 mL', vial:'', price:19}],
    tagline:'The supply for reconstituting peptides.',
    overview:'Research Water is bacteriostatic water, a sterile diluent containing 0.9% benzyl alcohol. It is used in the laboratory to reconstitute lyophilised research peptides for handling and study.',
    points:['Reconstitutes lyophilised compounds','Contains 0.9% benzyl alcohol','Sterile laboratory diluent'],
    whatItIs:'A sterile laboratory solvent: water with 0.9% benzyl alcohol added as a bacteriostatic preservative.',
    howItWorks:'It serves as a diluent for dissolving lyophilised research peptides, with benzyl alcohol acting as a bacteriostatic preservative that limits microbial growth across repeated use.' },
];
