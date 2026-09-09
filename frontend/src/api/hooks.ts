import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from './client';
import type {
  Certification,
  ContactInfo,
  Education,
  Experience,
  NewMessage,
  Profile,
  Project,
  Skill,
  SocialLink,
  Statistic,
  Technology,
  Testimonial,
} from '../lib/types';

const staleTime = 5 * 60 * 1000;

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: () => apiGet<Profile>('/api/profile/'), staleTime });

export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: () => apiGet<Skill[]>('/api/skills/'), staleTime });

export const useTechnologies = () =>
  useQuery({ queryKey: ['technologies'], queryFn: () => apiGet<Technology[]>('/api/technologies/'), staleTime });

export const useExperiences = () =>
  useQuery({ queryKey: ['experiences'], queryFn: () => apiGet<Experience[]>('/api/experiences/'), staleTime });

export const useStatistics = () =>
  useQuery({ queryKey: ['statistics'], queryFn: () => apiGet<Statistic[]>('/api/statistics/'), staleTime });

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: () => apiGet<Project[]>('/api/projects/'), staleTime });

export const useContactInfo = () =>
  useQuery({ queryKey: ['contact-info'], queryFn: () => apiGet<ContactInfo>('/api/contact-info/'), staleTime });

export const useSendMessage = () =>
  useMutation({ mutationFn: (payload: NewMessage) => apiPost('/api/contact/', payload) });

export const useSocialLinks = () =>
  useQuery({ queryKey: ['social-links'], queryFn: () => apiGet<SocialLink[]>('/api/social-links/'), staleTime });

export const useEducation = () =>
  useQuery({ queryKey: ['education'], queryFn: () => apiGet<Education[]>('/api/education/'), staleTime });

export const useCertifications = () =>
  useQuery({ queryKey: ['certifications'], queryFn: () => apiGet<Certification[]>('/api/certifications/'), staleTime });

export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: () => apiGet<Testimonial[]>('/api/testimonials/'), staleTime });
