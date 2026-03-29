export interface HealthStatus {
  status: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface ErrorResponse {
  error: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  paymentSlipData: string;
  paymentSlipName: string;
  paymentSlipMime: string;
}

export interface RegisterResponse {
  message: string;
  studentId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  status: string;
}

export interface StudentAdmin {
  id: number;
  name: string;
  email: string;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
  approvedAt?: string | null;
  hasPaymentSlip: boolean;
}

export interface PaymentSlipResponse {
  fileData: string;
  fileName: string;
  mimeType: string;
}

export interface SessionSummary {
  sessionId: number;
  quizTitle: string;
  subject: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt?: string | null;
}

export interface StudentQuizHistory {
  student: StudentProfile;
  sessions: SessionSummary[];
  totalSessions: number;
  averageScore: number;
}

export interface AdminLoginRequest {
  password: string;
}

export interface RejectStudentRequest {
  reason: string;
}

export interface Quiz {
  id: number;
  title: string;
  subject: string;
  description: string;
  questionCount: number;
}

export interface CreateQuizRequest {
  title: string;
  subject: string;
  description: string;
}

export type CreateQuestionRequestQuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface CreateQuestionRequest {
  questionText: string;
  questionType: CreateQuestionRequestQuestionType;
  options?: string[] | null;
  correctAnswer: string;
  explanation?: string | null;
}

export interface QuestionWithAnswer {
  id: number;
  quizId: number;
  orderIndex: number;
  questionText: string;
  questionType: string;
  options?: string[] | null;
  correctAnswer: string;
  explanation?: string | null;
}

export type QuestionQuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface Question {
  id: number;
  quizId: number;
  orderIndex: number;
  questionText: string;
  questionType: QuestionQuestionType;
  options?: string[] | null;
}

export interface QuizWithQuestions {
  id: number;
  title: string;
  subject: string;
  description: string;
  questions: Question[];
}

export interface StartSessionRequest {
  quizId: number;
}

export interface Session {
  id: number;
  quizId: number;
  startedAt: string;
  totalQuestions: number;
}

export interface SubmitAnswerRequest {
  questionId: number;
  answer: string;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  explanation?: string | null;
  questionIndex: number;
  totalQuestions: number;
}

export interface AnswerSummary {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface SessionResult {
  sessionId: number;
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: AnswerSummary[];
}
