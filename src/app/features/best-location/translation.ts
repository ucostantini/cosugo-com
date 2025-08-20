export type Locale = {
  [key in Loc]: string;
};

export type Loc = "en" | "fr" | "it";

const translationMap: { [key: string]: Locale } = {
  // Categories
  "Ricchezza e consumi": { "en": "Wealth and Consumption", "fr": "Richesse et consommation", "it": "Ricchezza e consumi" },
  "Affari e lavoro": { "en": "Business and Employment", "fr": "Affaires et emploi", "it": "Affari e lavoro" },
  "Ambiente e servizi": { "en": "Environment and Services", "fr": "Environnement et services", "it": "Ambiente e servizi" },
  "Demografia e società": { "en": "Demography and Society", "fr": "Démographie et société", "it": "Demografia e società" },
  "Giustizia e sicurezza": { "en": "Justice and Safety", "fr": "Justice et sécurité", "it": "Giustizia e sicurezza" },
  "Cultura e tempo libero": { "en": "Culture and Leisure", "fr": "Culture et loisir", "it": "Cultura e tempo libero" },

  // Indicators (as before) — only a subset shown previously; included here in full
  "Canoni medi di locazione": { "en": "Average rent levels", "fr": "Loyers moyens", "it": "Canoni medi di locazione" },
  "Depositi bancari": { "en": "Bank deposits", "fr": "Dépôts bancaires", "it": "Depositi bancari" },
  "Disuguaglianza del reddito netto": { "en": "Net income inequality", "fr": "Inégalité du revenu net", "it": "Disuguaglianza del reddito netto" },
  "Famiglie con Isee basso": { "en": "Households assessed as low income (ISEE-equivalent)", "fr": "Ménages évalués comme à faibles revenus (équivalent ISEE)", "it": "Famiglie con Isee basso" },
  "Inflazione indice generale": { "en": "General inflation index", "fr": "Indice général de l'inflation", "it": "Inflazione indice generale" },
  "Inflazione alimentari e bevande non alcoliche": { "en": "Inflation — food and non-alcoholic beverages", "fr": "Inflation — aliments et boissons non alcoolisées", "it": "Inflazione alimentari e bevande non alcoliche" },
  "Mensilità di stipendio per comprare casa": { "en": "Months' salary required to purchase a dwelling", "fr": "Mois de salaire nécessaires pour acheter un logement", "it": "Mensilità di stipendio per comprare casa" },
  "Pagamenti delle fatture entro i 30 giorni": { "en": "Invoices paid within 30 days", "fr": "Paiements des factures sous 30 jours", "it": "Pagamenti delle fatture entro i 30 giorni" },
  "Pensionati con assegni bassi": { "en": "Pensioners receiving low benefits", "fr": "Pensionnés percevant de faibles pensions", "it": "Pensionati con assegni bassi" },
  "Protesti pro capite": { "en": "Amount of protested bills per capita", "fr": "Montant des effets impayés protestés par habitant", "it": "Protesti pro capite" },
  "Retribuzione media annua": { "en": "Average annual pay", "fr": "Rémunération annuelle moyenne", "it": "Retribuzione media annua" },
  "Riqualificazioni energetiche": { "en": "Spending on energy upgrades", "fr": "Rénovations énergétiques", "it": "Riqualificazioni energetiche" },
  "Spesa delle famiglie": { "en": "Household expenditure", "fr": "Dépenses des ménages", "it": "Spesa delle famiglie" },
  "Trend del Pil pro capite": { "en": "Per capita GDP trend", "fr": "Tendance du PIB par habitant", "it": "Trend del Pil pro capite" },
  "Valore aggiunto per abitante": { "en": "Value added per inhabitant", "fr": "Valeur ajoutée par habitant", "it": "Valore aggiunto per abitante" },

  "Cessazioni": { "en": "Business closures", "fr": "Cessations d'activité", "it": "Cessazioni" },
  "Gender pay gap": { "en": "Gender pay gap", "fr": "Écart salarial entre les sexes", "it": "Gender pay gap" },
  "Imprese in fallimento": { "en": "Bankrupt businesses", "fr": "Entreprises en faillite", "it": "Imprese in fallimento" },
  "Imprese sociali": { "en": "Social enterprises", "fr": "Entreprises sociales", "it": "Imprese sociali" },
  "Laureati e altri titoli terziari (25-39 anni)": { "en": "Graduates and other tertiary qualifications (25–39 years)", "fr": "Diplômés et autres titres tertiaires (25–39 ans)", "it": "Laureati e altri titoli terziari (25-39 anni)" },
  "Numero di ore cig autorizzate": { "en": "Hours of authorised short-time working", "fr": "Heures d'activité partielle autorisées", "it": "Numero di ore cig autorizzate" },
  "Numero pensioni di vecchiaia": { "en": "Number of old-age pensions", "fr": "Nombre de pensions de vieillesse", "it": "Numero pensioni di vecchiaia" },
  "Nuove iscrizioni": { "en": "New registrations", "fr": "Nouvelles inscriptions", "it": "Nuove iscrizioni" },
  "Presenze turistiche": { "en": "Tourist stays", "fr": "Présences touristiques", "it": "Presenze turistiche" },
  "Quota di export sul Pil": { "en": "Exports as a share of GDP", "fr": "Part des exportations dans le PIB", "it": "Quota di export sul Pil" },
  "Startup innovative": { "en": "Innovative start-ups", "fr": "Start-ups innovantes", "it": "Startup innovative" },
  "Lavoro: infortuni mortali o con inabilità permanente": { "en": "Work-related fatalities or permanently disabling injuries", "fr": "Travail : accidents mortels ou entraînant une incapacité permanente", "it": "Lavoro: infortuni mortali o con inabilità permanente" },
  "Tasso di mancata partecipazione al lavoro": { "en": "Non-participation rate in the labour force", "fr": "Taux de non-participation au marché du travail", "it": "Tasso di mancata partecipazione al lavoro" },
  "Tasso di occupazione": { "en": "Employment rate", "fr": "Taux d'emploi", "it": "Tasso di occupazione" },
  "Trend delle presenze turistiche": { "en": "Trend in tourist stays", "fr": "Tendance des présences touristiques", "it": "Trend delle presenze turistiche" },

  "Comuni con servizi online per le famiglie": { "en": "Municipalities offering online services for families", "fr": "Communes offrant des services en ligne pour les familles", "it": "Comuni con servizi online per le famiglie" },
  "Superamenti di limite di Pm10": { "en": "Days exceeding the PM10 limit", "fr": "Dépassements de la limite de PM10", "it": "Superamenti di limite di Pm10" },
  "Densità di tutti gli impianti fotovoltaici": { "en": "Density of photovoltaic installations", "fr": "Densité des installations photovoltaïques", "it": "Densità di tutti gli impianti fotovoltaici" },
  "Ecosistema urbano": { "en": "Urban ecosystem", "fr": "Écosystème urbain", "it": "Ecosistema urbano" },
  "Distribuzione dell'acqua": { "en": "Water distribution", "fr": "Distribution de l'eau", "it": "Distribuzione dell'acqua" },
  "Energia elettrica da fonti rinnovabili": { "en": "Electricity from renewable sources", "fr": "Électricité d'origine renouvelable", "it": "Energia elettrica da fonti rinnovabili" },
  "Qualità della vita dei bambini, giovani e anziani": { "en": "Quality of life for children, young people and older adults", "fr": "Qualité de vie des enfants, des jeunes et des aînés", "it": "Qualità della vita dei bambini, giovani e anziani" },
  "Illuminazione pubblica sostenibile": { "en": "Sustainable public lighting", "fr": "Éclairage public durable", "it": "Illuminazione pubblica sostenibile" },
  "Indice di fragilità urbana": { "en": "Urban fragility index", "fr": "Indice de fragilité urbaine", "it": "Indice di fragilità urbana" },
  "Irregolarità del servizio elettrico": { "en": "Irregularities in electricity service", "fr": "Anomalies du service électrique", "it": "Irregolarità del servizio elettrico" },
  "Posti-km offerti dal Tpl": { "en": "Seat-kilometres offered by local public transport", "fr": "Places-km offertes par le transport public local", "it": "Posti-km offerti dal Tpl" },
  "Raccolta differenziata": { "en": "Separate waste collection", "fr": "Collecte sélective", "it": "Raccolta differenziata" },
  "Rischio alluvione": { "en": "Flood risk", "fr": "Risque d'inondation", "it": "Rischio alluvione" },
  "Rischio frana": { "en": "Landslide risk", "fr": "Risque de glissement de terrain", "it": "Rischio frana" },
  "Tasso di motorizzazione": { "en": "Motorisation rate", "fr": "Taux de motorisation", "it": "Tasso di motorizzazione" },

  "Qualità della vita delle donne": { "en": "Quality of life for women", "fr": "Qualité de vie des femmes", "it": "Qualità della vita delle donne" },
  "Emigrazione ospedaliera": { "en": "Hospital outmigration", "fr": "Émigration hospitalière", "it": "Emigrazione ospedaliera" },
  "Età media al parto": { "en": "Average maternal age at childbirth", "fr": "Âge moyen à la naissance", "it": "Età media al parto" },
  "Indice della solitudine": { "en": "Loneliness index", "fr": "Indice de solitude", "it": "Indice della solitudine" },
  "Indice di dipendenza anziani": { "en": "Elderly dependency ratio", "fr": "Indice de dépendance des personnes âgées", "it": "Indice di dipendenza anziani" },
  "Immigrati regolari residenti": { "en": "Registered regular immigrants", "fr": "Immigrés réguliers résidant", "it": "Immigrati regolari residenti" },
  "Iscritti all'Aire": { "en": "Italians registered as resident abroad (AIRE)", "fr": "Italiens inscrits comme résidents à l'étranger (AIRE)", "it": "Iscritti all'Aire" },
  "Consumo di farmaci per depressione": { "en": "Consumption of antidepressant medications", "fr": "Consommation d'antidépresseurs", "it": "Consumo di farmaci per depressione" },
  "Medici specialisti": { "en": "Specialist doctors", "fr": "Médecins spécialistes", "it": "Medici specialisti" },
  "Mortalità evitabile": { "en": "Avoidable mortality", "fr": "Mortalité évitable", "it": "Mortalità evitabile" },
  "Quoziente di mortalità": { "en": "Mortality rate", "fr": "Quotient de mortalité", "it": "Quoziente di mortalità" },
  "Saldo migratorio totale": { "en": "Total net migration", "fr": "Solde migratoire total", "it": "Saldo migratorio totale" },
  "Speranza di vita alla nascita": { "en": "Life expectancy at birth", "fr": "Espérance de vie à la naissance", "it": "Speranza di vita alla nascita" },
  "Tasso di fecondità": { "en": "Fertility rate", "fr": "Taux de fécondité", "it": "Tasso di fecondità" },
  "Uscita precoce dal sistema di istruzione e formazione": { "en": "Early school leaving", "fr": "Abandon précoce du système d'enseignement et de formation", "it": "Uscita precoce dal sistema di istruzione e formazione" },

  "Altri delitti mortali denunciati": { "en": "Other reported lethal offences", "fr": "Autres infractions mortelles déclarées", "it": "Altri delitti mortali denunciati" },
  "Durata media dei procedimenti civili": { "en": "Average duration of civil proceedings", "fr": "Durée moyenne des procédures civiles", "it": "Durata media dei procedimenti civili" },
  "Furti con destrezza": { "en": "Pickpocketing", "fr": "Vols par dextérité (pickpocketing)", "it": "Furti con destrezza" },
  "Furti con strappo": { "en": "Snatch thefts", "fr": "Vols avec arrachage", "it": "Furti con strappo" },
  "Furti di autovetture": { "en": "Car thefts", "fr": "Vols de voitures", "it": "Furti di autovetture" },
  "Incendi": { "en": "Arson", "fr": "Incendies", "it": "Incendi" },
  "Indice di criminalità - totale dei delitti denunciati": { "en": "Crime index — total reported offences", "fr": "Indice de criminalité — total des infractions déclarées", "it": "Indice di criminalità - totale dei delitti denunciati" },
  "Indice di litigiosità": { "en": "Litigiousness index", "fr": "Indice de litigiousité", "it": "Indice di litigiosità" },
  "Indice di rotazione delle cause": { "en": "Index of case turnover", "fr": "Indice de rotation des affaires", "it": "Indice di rotazione delle cause" },
  "Mortalità stradale in ambito extraurbano": { "en": "Road fatalities in extra-urban areas", "fr": "Mortalité routière en milieu extra-urbain", "it": "Mortalità stradale in ambito extraurbano" },
  "Omicidi volontari": { "en": "Intentional homicides", "fr": "Homicides volontaires", "it": "Omicidi volontari" },
  "Rapine in pubblica via": { "en": "Street robberies", "fr": "Braquages en voie publique", "it": "Rapine in pubblica via" },
  "Reati legati agli stupefacenti": { "en": "Drug-related offences", "fr": "Infractions liées aux stupéfiants", "it": "Reati legati agli stupefacenti" },
  "Riciclaggio e impiego di denaro": { "en": "Money laundering and use of illicit funds", "fr": "Blanchiment d'argent et emploi de capitaux illicites", "it": "Riciclaggio e impiego di denaro" },
  "Truffe e frodi informatiche": { "en": "Fraud and cyber fraud", "fr": "Escroqueries et fraudes informatiques", "it": "Truffe e frodi informatiche" },

  "Amministratori comunali con meno di 40 anni": { "en": "Municipal administrators aged under 40", "fr": "Administrateurs municipaux de moins de 40 ans", "it": "Amministratori comunali con meno di 40 anni" },
  "I City Rank Amministrazioni Digitali": { "en": "City Rank — Digital Administrations", "fr": "Classement des villes — administrations numériques", "it": "I City Rank Amministrazioni Digitali" },
  "Aree protette": { "en": "Protected areas", "fr": "Zones protégées", "it": "Aree protette" },
  "Bar, cinema e ristoranti": { "en": "Bars, cinemas and restaurants", "fr": "Bars, cinémas et restaurants", "it": "Bar, cinema e ristoranti" },
  "Copertura alla rete Gigabit": { "en": "Gigabit network coverage", "fr": "Couverture du réseau Gigabit", "it": "Copertura alla rete Gigabit" },
  "Indice del clima": { "en": "Climate index", "fr": "Indice climatique", "it": "Indice del clima" },
  "Indice di accessibilità ai servizi essenziali": { "en": "Accessibility index to essential services", "fr": "Indice d'accessibilité aux services essentiels", "it": "Indice di accessibilità ai servizi essenziali" },
  "Indice di lettura": { "en": "Reading index", "fr": "Indice de lecture", "it": "Indice di lettura" },
  "Indice di Sportività": { "en": "Sports index", "fr": "Indice de sportivité", "it": "Indice di Sportività" },
  "Librerie": { "en": "Bookshops", "fr": "Librairies", "it": "Librerie" },
  "Offerta culturale": { "en": "Cultural offerings", "fr": "Offre culturelle", "it": "Offerta culturale" },
  "Palestre, piscine, centri per il benessere e stabilimenti termali": { "en": "Gyms, swimming pools, wellness centres and thermal spas", "fr": "Salles de sport, piscines, centres de bien-être et établissements thermaux", "it": "Palestre, piscine, centri per il benessere e stabilimenti termali" },
  "Partecipazione elettorale": { "en": "Electoral participation", "fr": "Participation électorale", "it": "Partecipazione elettorale" },
  "Spesa dei Comuni per la cultura": { "en": "Municipal expenditure on culture", "fr": "Dépenses municipales pour la culture", "it": "Spesa dei Comuni per la cultura" },
  "Spettatori - ingressi agli spettacoli": { "en": "Audience — admissions to performances", "fr": "Spectateurs — entrées aux spectacles", "it": "Spettatori - ingressi agli spettacoli" },

  // --- Units (Italian keys -> "en" / "fr" translations) ---
  "Incidenza % sul reddito medio disponibile pro capite": {
    "en": "Share (%) of average disposable income per capita",
    "fr": "Part (%) du revenu disponible moyen par habitant",
    "it": "Incidenza % sul reddito medio disponibile pro capite"
  },
  "In migliaia euro pro capite": {
    "en": "Thousands of euros per capita",
    "fr": "En milliers d'euros par habitant",
    "it": "In migliaia euro pro capite"
  },
  "Rapporto ultimo quintile/primo quintile": {
    "en": "Ratio top quintile / bottom quintile",
    "fr": "Rapport quintile supérieur / quintile inférieur",
    "it": "Rapporto ultimo quintile/primo quintile"
  },
  "Isee < 7mila euro - In % sul totale dei nuclei con Isee": {
    "en": "Equivalent to ISEE < €7,000 — % of households assessed for means-tested support (ISEE is an Italian household economic indicator)",
    "fr": "Équivalent ISEE < €7 000 — % des ménages évalués pour des prestations sous condition de ressources (ISEE = indicateur italien de situation économique)",
    "it": "Isee < 7mila euro - In % sul totale dei nuclei con Isee"
  },
  "in %": {
    "en": "Percentage (%)",
    "fr": "Pourcentage (%)",
    "it": "in %"
  },
  "Per 60 mq in zona semi centrale su retribuzione media da lavoro dipendente": {
    "en": "For 60 m² in a semi-central area based on average employee earnings",
    "fr": "Pour 60 m² en zone semi-centrale sur la base du salaire moyen des salariés",
    "it": "Per 60 mq in zona semi centrale su retribuzione media da lavoro dipendente"
  },
  "Fatture commerciali ai fornitori pagate entro la scadenza. In %": {
    "en": "Commercial supplier invoices settled by the due date — %",
    "fr": "Factures commerciales aux fournisseurs payées à l'échéance — %",
    "it": "Fatture commerciali ai fornitori pagate entro la scadenza. In %"
  },
  "Valori percentuali": {
    "en": "Percentage (%)",
    "fr": "Pourcentage (%)",
    "it": "Valori percentuali"
  },
  "In euro all'anno": {
    "en": "Euros per year",
    "fr": "Euros par an",
    "it": "In euro all'anno"
  },
  "Euro": {
    "en": "Euros",
    "fr": "Euros",
    "it": "Euro"
  },
  "Euro per abitante": {
    "en": "Euros per inhabitant",
    "fr": "Euros par habitant",
    "it": "Euro per abitante"
  },
  "Var % annua": {
    "en": "Annual % change",
    "fr": "Variation annuelle en %",
    "it": "Var % annua"
  },
  "Migliaia di euro a valori correnti": {
    "en": "Thousands of euros at current prices",
    "fr": "Milliers d'euros à valeurs courantes",
    "it": "Migliaia di euro a valori correnti"
  },
  "Ogni 100 imprese registrate": {
    "en": "Per 100 registered enterprises",
    "fr": "Pour 100 entreprises enregistrées",
    "it": "Ogni 100 imprese registrate"
  },
  "Diff. % retribuzione media annua rispetto ai maschi (dipendenti del settore privato)": {
    "en": "% difference in average annual remuneration compared with men (private sector employees)",
    "fr": "Diff. % de la rémunération annuelle moyenne par rapport aux hommes (salariés du secteur privé)",
    "it": "Diff. % retribuzione media annua rispetto ai maschi (dipendenti del settore privato)"
  },
  "Ogni 10mila abitanti": {
    "en": "Per 10,000 inhabitants",
    "fr": "Pour 10 000 habitants",
    "it": "Ogni 10mila abitanti"
  },
  "Ore medie per impresa registrata": {
    "en": "Average hours per registered company",
    "fr": "Heures moyennes par entreprise enregistrée",
    "it": "Ore medie per impresa registrata"
  },
  "Numero pensionati ogni 1000 abitanti": {
    "en": "Number of pensioners per 1,000 inhabitants",
    "fr": "Nombre de pensionnés pour 1 000 habitants",
    "it": "Numero pensionati ogni 1000 abitanti"
  },
  "Per kmq": {
    "en": "Per km²",
    "fr": "Par km²",
    "it": "Per kmq"
  },
  "Rapporto % tra esportazioni di beni verso l'estero e valore aggiunto": {
    "en": "% ratio of goods exports to value added",
    "fr": "Rapport en % entre les exportations de biens à l'étranger et la valeur ajoutée",
    "it": "Rapporto % tra esportazioni di beni verso l'estero e valore aggiunto"
  },
  "Ogni mille oscietà di capitale": {
    "en": "Per 1,000 capital companies",
    "fr": "Pour 1 000 sociétés de capitaux",
    "it": "Ogni mille oscietà di capitale"
  },
  "Per 10mila occupati": {
    "en": "Per 10,000 employees",
    "fr": "Pour 10 000 occupés",
    "it": "Per 10mila occupati"
  },
  "In %": {
    "en": "Percentage (%)",
    "fr": "Pourcentage (%)",
    "it": "In %"
  },
  "In % (20-64 anni)": {
    "en": "Percentage (%) (20–64 years)",
    "fr": "Pourcentage (%) (20–64 ans)",
    "it": "In % (20-64 anni)"
  },
  "Giorni": {
    "en": "Days",
    "fr": "Jours",
    "it": "Giorni"
  },
  "Numero per 10 Kmq nei comuni capoluogo": {
    "en": "Number per 10 km² in provincial capitals",
    "fr": "Nombre pour 10 km² dans les communes chef-lieu",
    "it": "Numero per 10 Kmq nei comuni capoluogo"
  },
  "Indice sintetico su 18 parametri": {
    "en": "Composite index across 18 parameters",
    "fr": "Indice synthétique sur 18 paramètres",
    "it": "Indice sintetico su 18 parametri"
  },
  "Incidenza eolico, fotovoltaico, geotermico e idrico, in % su produzione lorda": {
    "en": "Share of wind, solar PV, geothermal and hydro as % of gross production",
    "fr": "Part éolien, photovoltaïque, géothermique et hydraulique en % de la production brute",
    "it": "Incidenza eolico, fotovoltaico, geotermico e idrico, in % su produzione lorda"
  },
  "Indice sintetico su 36 parametri (12 per generazione)": {
    "en": "Composite index across 36 parameters (12 per generation)",
    "fr": "Indice synthétique sur 36 paramètres (12 par génération)",
    "it": "Indice sintetico su 36 parametri (12 per generazione)"
  },
  "Punti luce a led, in % sul totale nel comune capoluogo": {
    "en": "LED light points as % of the total in the provincial capital",
    "fr": "Points lumineux à DEL en % du total dans la commune chef-lieu",
    "it": "Punti luce a led, in % sul totale nel comune capoluogo"
  },
  "Superficie con indice di fragilità >=8 (1:10), in % sul totale": {
    "en": "Proportion of area with fragility index ≥ 8 (scale 1–10) — % of total",
    "fr": "Superficie avec un indice de fragilité ≥ 8 (échelle 1–10) — % du total",
    "it": "Superficie con indice di fragilità >=8 (1:10), in % sul totale"
  },
  "Numero medio per utente": {
    "en": "Average number per user",
    "fr": "Nombre moyen par usager",
    "it": "Numero medio per utente"
  },
  "Valori per abitante": {
    "en": "Values per inhabitant",
    "fr": "Valeurs par habitant",
    "it": "Valori per abitante"
  },
  "In percentuale": {
    "en": "Percentage (%)",
    "fr": "Pourcentage (%)",
    "it": "In percentuale"
  },
  "Popolazione in aree a pericolosità idraulica elevata": {
    "en": "Population in areas of high flood hazard",
    "fr": "Population en zones à fort péril hydraulique",
    "it": "Popolazione in aree a pericolosità idraulica elevata"
  },
  "Popolazione in aree a pericolosità da frana elevata e molto elevata": {
    "en": "Population in areas at high or very high landslide hazard",
    "fr": "Population en zones à péril de glissement élevé ou très élevé",
    "it": "Popolazione in aree a pericolosità da frana elevata e molto elevata"
  },
  "Auto in circolazione ogni 100 abitanti": {
    "en": "Cars in circulation per 100 inhabitants",
    "fr": "Voitures en circulation pour 100 habitants",
    "it": "Auto in circolazione ogni 100 abitanti"
  },
  "Indice sintetico su 12 parametri": {
    "en": "Composite index across 12 parameters",
    "fr": "Indice synthétique sur 12 paramètres",
    "it": "Indice sintetico su 12 parametri"
  },
  "Dimissioni di residenti avvenute in altra regione (in %)": {
    "en": "Discharges of resident patients occurring in another region (%)",
    "fr": "Sorties de résidents survenues dans une autre région (en %)",
    "it": "Dimissioni di residenti avvenute in altra regione (in %)"
  },
  "l’età media al parto delle madri espressa in anni e decimi di anno, calcolata considerando i soli nati vivi.": {
    "en": "Average age of mothers at childbirth expressed in years and tenths (live births only)",
    "fr": "Âge moyen des mères au moment de la naissance, exprimé en années et dixièmes (naissances vivantes seulement)",
    "it": "l’età media al parto delle madri espressa in anni e decimi di anno, calcolata considerando i soli nati vivi."
  },
  "Persone sole in % sul totale dei nuclei": {
    "en": "People living alone — % of total households",
    "fr": "Personnes vivant seules — % du total des ménages",
    "it": "Persone sole in % sul totale dei nuclei"
  },
  "rapporto tra popolazione di 65 anni e più e popolazione in età attiva (15-64 anni), moltiplicato per 100": {
    "en": "Ratio of population aged 65+ to working-age population (15–64), ×100",
    "fr": "Rapport entre la population de 65 ans et plus et la population en âge actif (15–64 ans), multiplié par 100",
    "it": "rapporto tra popolazione di 65 anni e più e popolazione in età attiva (15-64 anni), moltiplicato per 100"
  },
  "In percentuale sulla popolazione residente": {
    "en": "Percentage of resident population",
    "fr": "Pourcentage de la population résidente",
    "it": "In percentuale sulla popolazione residente"
  },
  "per provincia di iscrizione in % su popolazione": {
    "en": "By province of registration — % of population (AIRE = Registry of Italians Residing Abroad)",
    "fr": "Par province d'inscription — % de la population (AIRE = Registre des Italiens résidant à l'étranger)",
    "it": "per provincia di iscrizione in % su popolazione"
  },
  "Pillole (unità minime farmacologiche) pro capite": {
    "en": "Pills (minimum pharmaceutical units) per capita",
    "fr": "Comprimés (unités pharmaceutiques minimales) par habitant",
    "it": "Pillole (unità minime farmacologiche) pro capite"
  },
  "Per 10mila abitanti": {
    "en": "Per 10,000 inhabitants",
    "fr": "Pour 10 000 habitants",
    "it": "Per 10mila abitanti"
  },
  "Tassi standardizzati per 10.000 residenti": {
    "en": "Standardised rates per 10,000 residents",
    "fr": "Taux standardisés pour 10 000 résidents",
    "it": "Tassi standardizzati per 10.000 residenti"
  },
  "Standardizzato per 10mila abitanti (io ho messo x 1000 come da dato originale)": {
    "en": "Standardised per 10,000 inhabitants (note: original dataset used x 1,000)",
    "fr": "Standardisé pour 10 000 habitants (note : le jeu de données original utilisait x 1 000)",
    "it": "Standardizzato per 10mila abitanti (io ho messo x 1000 come da dato originale)"
  },
  "differenza tra il numero degli iscritti ed il numero dei cancellati dai registri anagrafici per trasferimento di residenza": {
    "en": "Difference between the number of registrations and removals from population registers due to change of residence",
    "fr": "Différence entre le nombre d'inscriptions et le nombre de radiations des registres pour changement de résidence",
    "it": "differenza tra il numero degli iscritti ed il numero dei cancellati dai registri anagrafici per trasferimento di residenza"
  },
  "Numero medio di anni": {
    "en": "Average number of years",
    "fr": "Nombre moyen d'années",
    "it": "Numero medio di anni"
  },
  "somma dei quozienti specifici di fecondità calcolati rapportando, per ogni età feconda (15-50 anni), il numero di nati vivi all’ammontare medio annuo della popolazione femminile": {
    "en": "Sum of age-specific fertility quotients (15–50 years) — live births per average annual female population",
    "fr": "Somme des quotients spécifiques de fécondité (15–50 ans) — naissances vivantes rapportées à la population féminine moyenne annuelle",
    "it": "somma dei quozienti specifici di fecondità calcolati rapportando, per ogni età feconda (15-50 anni), il numero di nati vivi all’ammontare medio annuo della popolazione femminile"
  },
  "Analfabeti, senza titolo di studio, con licenza elementare o media. In % (25-49 anni)": {
    "en": "Illiterates or persons without qualifications; primary or lower secondary only — % (25–49 years)",
    "fr": "Analphabètes, sans diplôme, ou titulaires d'un niveau primaire ou secondaire inférieur — % (25–49 ans)",
    "it": "Analfabeti, senza titolo di studio, con licenza elementare o media. In % (25-49 anni)"
  },
  "Per 100.000 abitanti": {
    "en": "Per 100,000 inhabitants",
    "fr": "Pour 100 000 habitants",
    "it": "Per 100.000 abitanti"
  },
  "In giorni": {
    "en": "Days",
    "fr": "Jours",
    "it": "In giorni"
  },
  "Denunce ogni 100mila abitanti": {
    "en": "Reported offences per 100,000 inhabitants",
    "fr": "Plainte(s) pour 100 000 habitants",
    "it": "Denunce ogni 100mila abitanti"
  },
  "Cause civili iscritte ogni 100mila abitanti": {
    "en": "Civil cases filed per 100,000 inhabitants",
    "fr": "Affaires civiles enregistrées pour 100 000 habitants",
    "it": "Cause civili iscritte ogni 100mila abitanti"
  },
  "Procedimenti definiti su nuovi iscritti": {
    "en": "Proceedings concluded relative to new filings",
    "fr": "Procédures définitives sur nouvelles inscriptions",
    "it": "Procedimenti definiti su nuovi iscritti"
  },
  "In % sul totale": {
    "en": "Percentage (%) of the total",
    "fr": "Pourcentage (%) du total",
    "it": "In % sul totale"
  },
  "Indice sintetico su XX parametri (amministrazioni digitali)": {
    "en": "Composite index across XX parameters (digital services)",
    "fr": "Indice synthétique sur XX paramètres (services numériques)",
    "it": "Indice sintetico su XX parametri (amministrazioni digitali)"
  },
  "Ogni 100mila abitanti": {
    "en": "Per 100,000 inhabitants",
    "fr": "Pour 100 000 habitants",
    "it": "Ogni 100mila abitanti"
  },
  "% famiglie coperte (FTTH)": {
    "en": "% of households covered (FTTH)",
    "fr": "% de foyers couverts (FTTH)",
    "it": "% famiglie coperte (FTTH)"
  },
  "Media dei punteggi in base a 10 parametri climatici": {
    "en": "Mean score across 10 climatic parameters",
    "fr": "Moyenne des scores selon 10 paramètres climatiques",
    "it": "Media dei punteggi in base a 10 parametri climatici"
  },
  "Tempo medio di percorrenza stradale per raggiungere il primo polo (in minuti)": {
    "en": "Average road travel time to nearest service hub (minutes)",
    "fr": "Temps moyen de trajet routier pour atteindre le premier pôle (en minutes)",
    "it": "Tempo medio di percorrenza stradale per raggiungere il primo polo (in minuti)"
  },
  "Copie ogni 100 abitanti": {
    "en": "Copies per 100 inhabitants",
    "fr": "Exemplaires pour 100 habitants",
    "it": "Copie ogni 100 abitanti"
  },
  "Media dei punteggi in base a 36 parametri": {
    "en": "Mean score across 36 parameters",
    "fr": "Moyenne des scores selon 36 paramètres",
    "it": "Media dei punteggi in base a 36 parametri"
  },
  "Spettacoli ogni mille abitanti": {
    "en": "Performances per 1,000 inhabitants",
    "fr": "Spectacles pour 1 000 habitants",
    "it": "Spettacoli ogni mille abitanti"
  },
  "Spettatori medi per spettacolo spettacoli": {
    "en": "Average spectators per performance",
    "fr": "Spectateurs moyens par représentation",
    "it": "Spettatori medi per spettacolo spettacoli"
  },
  "In euro pro capite per alcuni capitoli": {
    "en": "Euros per capita for selected budget items",
    "fr": "Euros par habitant pour certains chapitres",
    "it": "In euro pro capite per alcuni capitoli"
  }

};

export { translationMap };
