// Base student registration type
export interface StudentRegistration {
    id?: string;
    registrationId: string;
    name: string;
    faculty: Faculty;
    batch: string;
    gender: Gender;
    dob: string; // ISO date string
    phone: string;
    email: string;
    createdAt: string; // ISO date string
    updatedAt?: string; // ISO date string
  }
  
  // Faculty type as enum
  export enum Faculty {
    AGRICULTURE = "Faculty of Agriculture",
    FISHERIES = "Fisheries",
    VETERINARY = "Veterinary Medicine",
    AGRICULTURAL_ECONOMICS = "Agricultural Economics",
    FORESTRY = "Forestry and Environment",
    ENGINEERING = "Engineering and Bioresource",
    GRADUATE = "Graduate Studies"
  }
  
  // Gender type as enum
  export enum Gender {
    MALE = "male",
    FEMALE = "female"
  }
  
  // Type for form values
  export interface RegistrationFormValues {
    name: string;
    faculty: Faculty;
    batch: string;
    gender: Gender;
    dob: string;
    phone: string;
    email: string;
  }
  
  // Type for API responses
  export interface RegistrationResponse {
    success: boolean;
    registrationId: string;
    student?: StudentRegistration;
    error?: string;
  }
  
  // Type for search parameters
  export interface SearchParams {
    registrationId?: string;
    name?: string;
    faculty?: Faculty;
    batch?: string;
  }
  
  // Type for edit operations
  export interface EditRegistrationPayload {
    registrationId: string;
    updates: Partial<StudentRegistration>;
  }