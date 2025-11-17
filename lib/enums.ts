export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
  LAWYER = "lawyer",
  ANY = "any",
}

export enum OtpVerificationType {
  SIGNUP = 0,
  FORGETPASSWORD = 1,
}

export enum LawCategory {
  CRIMINAL_LAWS = "criminal_laws",
  CIVIL_LAWS = "civil_laws",
  FAMILY_LAWS = "family_laws",
  SERVICE_LAWS = "service_laws",
  LABOUR_LAWS = "labour_laws",
  POLICE_LAWS = "police_laws",
  COMPANIES_LAWS = "companies_laws",
  LAND_PROPERTY_LAWS = "land_property_laws",
  ISLAMIC_RELIGIOUS_LAWS = "islamic_religious_laws",
  BANKING_FINANCIAL_LAWS = "banking_financial_laws",
  LAW_OF_EVIDENCE = "law_of_evidence",
  RENT_LAWS = "rent_laws",
  INTERNATIONAL_LAWS = "international_laws",
  TENANCY_LAWS = "tenancy_laws",
  LAND_REFORM_LAWS = "land_reform_laws",
  MINORITIES_LAWS = "minorities_laws",
  EXCISE_TAXATION_LAWS = "excise_taxation_laws",
  MILITARY_LAWS = "military_laws",
  HEALTH_MEDICAL_LAWS = "health_medical_laws",
  MEDIA_LAWS = "media_laws",
  ELECTION_LAWS = "election_laws",
  DEPARTMENTAL_LAWS = "departmental_laws",
  GENERAL_LAWS = "general_laws",
}

export enum ConsultationType {
  GENERAL = "general",
  SPECIALIST = "specialist",
  FOLLOW_UP = "follow_up",
  EMERGENCY = "emergency",
  INITIAL = "initial"
}

export enum ConsultationStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
  RESCHEDULED = "rescheduled"
}
export enum CancellationReason {
  CLIENT_REQUEST = "client_request",
  LAWYER_UNAVAILABLE = "lawyer_unavailable",
  EMERGENCY = "emergency",
  TECHNICAL_ISSUE = "technical_issue",
  OTHER = "other"
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIAL_REFUND = "partial_refund",
  EXPIRED = "expired",
}

export enum ContactMode {
  Email = "Email",
  Phone = "Phone",
  InApp = "In-app",
  Other = "Other",
}

export enum ConsultationCreatedBy {
  User = "user",
  Lawyer = "lawyer",
}

export enum TimeZone {
  UTC = "UTC",
  EST = "America/New_York",
  CST = "America/Chicago",
  MST = "America/Denver",
  PST = "America/Los_Angeles",
  GMT = "Europe/London",
  CET = "Europe/Paris",
  IST = "Asia/Kolkata",
  JST = "Asia/Tokyo",
  AEST = "Australia/Sydney",
  PKT = "Asia/Karachi" // Added for Pakistan
}

export enum CaseLawStatus {
  ACTIVE = "active",
  OVERRULED = "overruled",
  PENDING = "pending",
}

export enum ActStatus {
  ACTIVE = "active",
  REPEALED = "repealed",
  AMENDED = "amended",
}


export enum Courts {
  SUPREME_COURT_OF_PAKISTAN = "supreme_court_of_pakistan",
  // ISLAMABAD_HIGH_COURT = "islamabad_high_court",
  PUNJAB_HIGH_COURT = "punjab_high_court",
  SINDH_HIGH_COURT = "sindh_high_court",
  PESHAWAR_HIGH_COURT = "peshawar_high_court",
  BALOCHISTAN_HIGH_COURT = "balochistan_high_court",
  // AZAD_KASHMIR_SUPREME_COURT = "azad_kashmir_supreme_court",
  SHARIA_COURT = "sharia_court",
  // GILGIT_BALTISTAN_CHIEF_COURT = "gilgit_baltistan_chief_court",
  // GILGIT_BALTISTAN_SUPREME_APPELLATE_COURT = "gilgit_baltistan_supreme_appeal_court",
  // CUSTOMS_APPELLATE_TRIBUNAL = "customs_appeal_tribunal",
  // ANTI_TERRORISM_COURT = "anti_terrorism_court",
  // ACCOUNTABILITY_COURT = "accountability_court",
  // FAMILY_COURT = "family_court",
  // BANKING_COURT = "banking_court",
  // CONSUMER_COURT = "consumer_court",
  // LABOUR_COURT = "labour_court",
  // SERVICE_TRIBUNAL = "service_tribunal",
  // DRUG_COURT = "drug_court",
  // ELECTION_TRIBUNAL = "election_tribunal",
  // ENVIRONMENTAL_TRIBUNAL = "environmental_tribunal",
  // MILITARY_COURT = "military_court",
  // CIVIL_COURT = "civil_court",
  // SESSIONS_COURT = "sessions_court",
  // DISTRICT_COURT = "district_court",
  OTHER = "Other"
}

export enum Languages {
  ENGLISH = "english",
  URDU = "urdu",
  PASHTO = "pashto",
  PUNJABI = "punjabi",
  SINDHI = "sindhi",
  BALOCHI = "balochi",
  ARABIC = "arabic",
  PERSIAN = "persian"
}

export enum Days {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday"
}

export enum BarCouncils {
  PunjabBarCouncil = "Punjab Bar Council",
  SindhBarCouncil = "Sindh Bar Council",
  KhyberPakhtunkhwaBarCouncil = "KP Bar Council",
  BalochistanBarCouncil = "Balochistan Bar Council",
  IslamabadBarCouncil = "Islamabad Bar Council",
  AzadJammuAndKashmirBarCouncil = "Azad Jammu and Kashmir Bar Council",
  GilgitBaltistanBarCouncil = "Gilgit Baltistan Bar Council"
}


export enum Ratings {
  FIVE = "5",
  FOUR = "4",
  THREE = "3",
  TWO = "2",
  ONE = "1"
}

export enum LawyerFeeRange {
  UNDER_2000 = "0-2000",
  FROM_2000_TO_5000 = "2000-5000",
  FROM_5000_TO_10000 = "5000-10000",
  ABOVE_10000 = "10000-999999"
}

export enum LawyerExperienceRange {
  ZERO_TO_TWO = "0-2",
  THREE_TO_FIVE = "3-5",
  SIX_TO_TEN = "6-10",
  ABOVE_TEN = "10-999"
}

export enum PaymentMethod {
  SAFEPAY = "safepay",
}

export enum UserTheme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum UserLanguagePreference {
  ENGLISH = "english",
  URDU = "urdu"
}

export enum PakistanCities {
  PESHAWAR = "peshawar",
  ISLAMABAD = "islamabad",
  RAWALPINDI = "rawalpindi",
  LAHORE = "lahore",
  KARACHI = "karachi",
  QUETTA = "quetta",
  MULTAN = "multan",
  FAISALABAD = "faisalabad",
  SIALKOT = "sialkot",
  GUJRANWALA = "gujranwala",
  SARGODHA = "sargodha",
  BAHAWALPUR = "bahawalpur",
  RAHIM_YAR_KHAN = "rahim_yar_khan",
  DERA_GHAZI_KHAN = "dera_ghazi_khan",
  SUKKUR = "sukkur",
  HYDERABAD = "hyderabad",
  MIRPUR_KHAS = "mirpur_khas",
  NAWABSHAH = "nawabshah",
  LARKANA = "larkana",
  JACOBABAD = "jacobabad",
  OTHER = "other"
}

export enum PakistanProvinces {
  KHYBER_PAKHTUNKHWA = "khyber_pakhtunkhwa",
  PUNJAB = "punjab",
  SINDH = "sindh",
  BALOCHISTAN = "balochistan",
  GILGIT_BALTISTAN = "gilgit_baltistan",
  AZAD_JAMMU_AND_KASHMIR = "azad_jammu_and_kashmir"
}


export enum Timezone {
  UTC = "UTC",
  EST = "America/New_York",
  CST = "America/Chicago",
  MST = "America/Denver",
  PST = "America/Los_Angeles",
  GMT = "Europe/London",
  CET = "Europe/Paris",
  IST = "Asia/Kolkata",
  JST = "Asia/Tokyo",
  AEST = "Australia/Sydney",
  PKT = "Asia/Karachi"
}

export enum DateFormat {
  DD_MM_YYYY = "DD/MM/YYYY",
  MM_DD_YYYY = "MM/DD/YYYY",
  YYYY_MM_DD = "YYYY/MM/DD",
  DD_MM_YYYY_HH_MM_SS = "DD/MM/YYYY HH:mm:ss",
  MM_DD_YYYY_HH_MM_SS = "MM/DD/YYYY HH:mm:ss",
  YYYY_MM_DD_HH_MM_SS = "YYYY/MM/DD HH:mm:ss",
}

export enum NotificationType {
  SYSTEM = 'system',
  CHAT = 'chat',
  CONSULTATION = 'consultation',
  CONSULTATION_REMINDER_24H = 'consultation_reminder_24h',
  CONSULTATION_REMINDER_1H = 'consultation_reminder_1h',
  CONSULTATION_REMINDER_15M = 'consultation_reminder_15m',
  PAYMENT = 'payment',
  REMINDER = 'reminder',
  CUSTOM = 'custom',
}
export enum NotificationContextType {
  CHAT = 'chat',
  CONSULTATION = 'consultation',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  OTHER = 'other',
}

export enum NotificationDeliveryChannel {
  IN_APP = 'in_app',
  PUSH = 'push',
  EMAIL = 'email',
}
export enum FontSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
}

export enum Currency {
  PKR = "PKR",
  USD = "USD",
  EUR = "EUR",
}

export enum TimeSlot {
  _09_00_10_00 = "09:00-10:00",
  _10_00_11_00 = "10:00-11:00",
  _11_00_12_00 = "11:00-12:00",
  _12_00_13_00 = "12:00-13:00",
  _13_00_14_00 = "13:00-14:00",
  _14_00_15_00 = "14:00-15:00",
  _15_00_16_00 = "15:00-16:00",
  _16_00_17_00 = "16:00-17:00",
  _17_00_18_00 = "17:00-18:00",
  _18_00_19_00 = "18:00-19:00",
  _19_00_20_00 = "19:00-20:00",
}

export enum ExportStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum IdentityVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export enum PreferredCommunication {
  CHAT = "chat",
  CALL = "call",
  EMAIL = "email",
  ALL = "all",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum AccountStatus {
  PENDING_ACTIVATION = "pending_activation", // Registered but awaiting admin review/verification
  ACTIVE = "active",                         // Fully approved and verified
  SUSPENDED = "suspended",                   // Temporarily disabled
  BLOCKED = "blocked",                       // Permanently disabled after being active
  REJECTED = "rejected"                      // Denied at onboarding stage
}

export enum ReleaseChannel {
  ALPHA = "alpha",
  BETA = "beta",
  PUBLIC = "public",
  INTERNAL = "internal",
}

// QC Transaction Types
export enum QCTransactionType {
  PURCHASE = 'purchase',
  DEDUCTION = 'deduction',
  REFUND = 'refund',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment'
}

// QC Service Types
export enum QCServiceType {
  CHATBOT = 'chatbot',
  SUMMARIZER = 'summary',
  KNOWLEDGEBASE = 'knowledgebase',
  CONSULTATION = 'consultation',
  BLOG_PUBLISHING = 'blog_publishing',
  OTHER = 'other'
}

// Payment Type Enum
export enum PaymentType {
  CONSULTATION = 'consultation',
  SUBSCRIPTION = 'subscription',
  DOCUMENT_GENERATION = 'document_generation',
  PREMIUM_FEATURES = 'premium_features',
  REFUND = 'refund'
}
