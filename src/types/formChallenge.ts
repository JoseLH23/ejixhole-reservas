export interface FormChallengeResponse {
  token: string;
  issued_at: string;
  expires_at: string;
  minimum_wait_seconds: number;
  enforcement_mode: "monitor" | "enforce";
}
