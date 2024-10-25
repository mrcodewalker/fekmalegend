export interface SubjectWarningDto {
  subject_name: string;
  eight_to_ten: number;
  less_than_five: number;
  eight_to_ten_percent: number;
  less_than_five_percent: number;
  alert_message: string[];
  valid: boolean;
}
