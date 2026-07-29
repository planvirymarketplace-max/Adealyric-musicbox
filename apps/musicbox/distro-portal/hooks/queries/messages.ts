import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MessageThread, Message } from '@/types/database';

// ── Query keys ──
const keys = {
  threads: ['messages', 'threads'] as const,
  threadMessages: (threadId: string) => ['messages', 'thread', threadId] as const,
};

// ── Threads ──
export function useMessageThreads() {
  return useQuery<MessageThread[]>({
    queryKey: keys.threads,
    queryFn: () => apiClient.get<MessageThread[]>('/api/messages/threads'),
  });
}

// ── Thread Messages ──
export function useThreadMessages(threadId: string) {
  return useQuery<Message[]>({
    queryKey: keys.threadMessages(threadId),
    queryFn: () => apiClient.get<Message[]>(`/api/messages/threads/${threadId}/messages`),
    enabled: !!threadId,
    refetchInterval: 10_000, // Poll for new messages every 10s
  });
}

// ── Create Thread ──
export function useCreateThread() {
  const qc = useQueryClient();
  return useMutation<MessageThread, unknown, { subject?: string; requestId?: string; participantIds: string[] }>({
    mutationFn: (body) => apiClient.post<MessageThread>('/api/messages/threads', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.threads }),
  });
}

// ── Send Message ──
export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation<Message, unknown, { threadId: string; body: string; isInternalNote?: boolean }>({
    mutationFn: (msg) => apiClient.post<Message>(`/api/messages/threads/${msg.threadId}/messages`, msg),
    onSuccess: (_, { threadId }) => qc.invalidateQueries({ queryKey: keys.threadMessages(threadId) }),
  });
}
