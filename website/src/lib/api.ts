import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type {
  Quiz,
  QuizWithQuestions,
  Session,
  SessionResult,
  StudentProfile,
  StudentAdmin,
  StudentQuizHistory,
  PaymentSlipResponse,
  AnswerResult,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  AdminLoginRequest,
  RejectStudentRequest,
  CreateQuizRequest,
  CreateQuestionRequest,
  SubmitAnswerRequest,
  StartSessionRequest,
} from "@/types/api";

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const getListQuizzesQueryKey = () => ["/api/quizzes"] as const;

export function useListQuizzes(
  options?: { query?: UseQueryOptions<Quiz[]> }
) {
  return useQuery<Quiz[]>({
    queryKey: getListQuizzesQueryKey(),
    queryFn: () => apiFetch<Quiz[]>("/quizzes"),
    ...options?.query,
  });
}

export const getGetQuizQueryKey = (id: number) => [`/api/quizzes/${id}`] as const;

export function useGetQuiz(
  id: number,
  options?: { query?: UseQueryOptions<QuizWithQuestions> }
) {
  return useQuery<QuizWithQuestions>({
    queryKey: getGetQuizQueryKey(id),
    queryFn: () => apiFetch<QuizWithQuestions>(`/quizzes/${id}`),
    ...options?.query,
  });
}

export function useStartSession(
  options?: { mutation?: UseMutationOptions<Session, Error, StartSessionRequest> }
) {
  return useMutation<Session, Error, StartSessionRequest>({
    mutationFn: (data) =>
      apiFetch<Session>("/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useSubmitAnswer(
  options?: {
    mutation?: UseMutationOptions<AnswerResult, Error, { sessionId: number; data: SubmitAnswerRequest }>;
  }
) {
  return useMutation<AnswerResult, Error, { sessionId: number; data: SubmitAnswerRequest }>({
    mutationFn: ({ sessionId, data }) =>
      apiFetch<AnswerResult>(`/sessions/${sessionId}/answers`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export const getGetSessionResultQueryKey = (sessionId: number) =>
  [`/api/sessions/${sessionId}/result`] as const;

export function useGetSessionResult(
  sessionId: number,
  options?: { query?: UseQueryOptions<SessionResult> }
) {
  return useQuery<SessionResult>({
    queryKey: getGetSessionResultQueryKey(sessionId),
    queryFn: () => apiFetch<SessionResult>(`/sessions/${sessionId}/result`),
    ...options?.query,
  });
}

export const getGetStudentProfileQueryKey = () => ["/api/students/profile"] as const;

export function useGetStudentProfile(
  options?: { query?: UseQueryOptions<StudentQuizHistory> }
) {
  return useQuery<StudentQuizHistory>({
    queryKey: getGetStudentProfileQueryKey(),
    queryFn: () => apiFetch<StudentQuizHistory>("/students/profile"),
    ...options?.query,
  });
}

export function useRegisterStudent(
  options?: { mutation?: UseMutationOptions<RegisterResponse, Error, RegisterRequest> }
) {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: (data) =>
      apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useLoginStudent(
  options?: { mutation?: UseMutationOptions<StudentProfile, Error, LoginRequest> }
) {
  return useMutation<StudentProfile, Error, LoginRequest>({
    mutationFn: (data) =>
      apiFetch<StudentProfile>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useListStudents(
  options?: { query?: UseQueryOptions<StudentAdmin[]> }
) {
  return useQuery<StudentAdmin[]>({
    queryKey: ["/api/admin/students"],
    queryFn: () => apiFetch<StudentAdmin[]>("/admin/students"),
    ...options?.query,
  });
}

export function useApproveStudent(
  options?: { mutation?: UseMutationOptions<void, Error, number> }
) {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) =>
      apiFetch<void>(`/admin/students/${id}/approve`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/students"] }),
    ...options?.mutation,
  });
}

export function useRejectStudent(
  options?: {
    mutation?: UseMutationOptions<void, Error, { id: number; data: RejectStudentRequest }>;
  }
) {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: number; data: RejectStudentRequest }>({
    mutationFn: ({ id, data }) =>
      apiFetch<void>(`/admin/students/${id}/reject`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/students"] }),
    ...options?.mutation,
  });
}

export function useGetPaymentSlip(
  id: number,
  options?: { query?: UseQueryOptions<PaymentSlipResponse> }
) {
  return useQuery<PaymentSlipResponse>({
    queryKey: [`/api/admin/students/${id}/payment-slip`],
    queryFn: () => apiFetch<PaymentSlipResponse>(`/admin/students/${id}/payment-slip`),
    ...options?.query,
  });
}

export function useAdminLogin(
  options?: { mutation?: UseMutationOptions<void, Error, AdminLoginRequest> }
) {
  return useMutation<void, Error, AdminLoginRequest>({
    mutationFn: (data) =>
      apiFetch<void>("/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useCreateQuiz(
  options?: { mutation?: UseMutationOptions<Quiz, Error, CreateQuizRequest> }
) {
  const qc = useQueryClient();
  return useMutation<Quiz, Error, CreateQuizRequest>({
    mutationFn: (data) =>
      apiFetch<Quiz>("/quizzes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListQuizzesQueryKey() }),
    ...options?.mutation,
  });
}

export function useCreateQuestion(
  options?: {
    mutation?: UseMutationOptions<void, Error, { quizId: number; data: CreateQuestionRequest }>;
  }
) {
  const qc = useQueryClient();
  return useMutation<void, Error, { quizId: number; data: CreateQuestionRequest }>({
    mutationFn: ({ quizId, data }) =>
      apiFetch<void>(`/quizzes/${quizId}/questions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, { quizId }) =>
      qc.invalidateQueries({ queryKey: getGetQuizQueryKey(quizId) }),
    ...options?.mutation,
  });
}
