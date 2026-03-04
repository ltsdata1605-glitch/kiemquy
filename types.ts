export interface DenominationCount {
  value: number;
  count: number;
}

export interface AuditState {
  id?: number; // Optional: used as PK for saved versions, fixed for current state
  auditorName: string;
  erpCash: number;
  denominations: DenominationCount[];
  auditTimestamp: string;
  notes: string;
}