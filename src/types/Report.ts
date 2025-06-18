export interface Report {
  total_spend_galactic: number;
  rows_affected: number;
  less_spent_at: number;
  big_spent_at: number;
  less_spent_value: number;
  big_spent_value: number;
  average_spend_galactic: number;
  big_spent_civ: 'humans' | 'blobs' | 'monsters';
  less_spent_civ: 'humans' | 'blobs' | 'monsters';
}
