import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ── Types ──
type CmsPage = { id: string; title: string; slug: string; content: string; published: boolean; artistId?: string; createdAt: string; updatedAt: string };

// ── Query keys ──
const keys = {
  pages: (artistId?: string) => ['cms', 'pages', artistId] as const,
  page: (id: string) => ['cms', 'page', id] as const,
};

// ── Pages ──
export function useCmsPages(artistId?: string) {
  return useQuery<CmsPage[]>({
    queryKey: keys.pages(artistId),
    queryFn: () => apiClient.get<CmsPage[]>('/api/cms/pages', { artistId }),
  });
}

export function useCmsPage(id: string) {
  return useQuery<CmsPage>({
    queryKey: keys.page(id),
    queryFn: () => apiClient.get<CmsPage>(`/api/cms/pages/${id}`),
    enabled: !!id,
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation<CmsPage, unknown, Partial<CmsPage>>({
    mutationFn: (body) => apiClient.post<CmsPage>('/api/cms/pages', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'pages'] }),
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation<CmsPage, unknown, { id: string; data: Partial<CmsPage> }>({
    mutationFn: ({ id, data }) => apiClient.put<CmsPage>(`/api/cms/pages/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.page(id) });
      qc.invalidateQueries({ queryKey: ['cms', 'pages'] });
    },
  });
}
