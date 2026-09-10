export interface Profile {
  full_name: string;
  site_name: string;
  title: string;
  email: string;
  phone: string;
  photo: string | null;
  logo: string | null;
  cv: string | null;
  description: string;
  available: boolean;
}

export interface Skill {
  id: number;
  name: string;
  value: number;
}

export interface Technology {
  id: number;
  name: string;
  logo: string;
}

export interface Experience {
  id: number;
  company: string;
  type: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface Statistic {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  link: string;
  description: string;
  role: string;
  results: string;
  technologies: Technology[];
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  form_active: boolean;
}

export interface NewMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date_obtained: string;
  credential_url: string;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string;
  content: string;
  photo: string | null;
}
