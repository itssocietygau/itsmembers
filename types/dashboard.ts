export interface FacultyDistribution {
    faculty: string
    count: number
  }
  
  export interface GenderDistribution {
    male: number
    female: number
  }
  
  export interface RecentRegistration {
    registrationId: string
    name: string
    faculty: string
    gender: string
    createdAt: string
  }
  
  export interface DashboardStats {
    totalRegistrations: number
    facultyDistribution: FacultyDistribution[]
    genderDistribution: GenderDistribution
    recentRegistrations: RecentRegistration[]
  }