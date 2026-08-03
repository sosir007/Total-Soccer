export type CompetitionDataSource = {
  label: string;
  url?: string;
  remark?: string;
};

export type CompetitionDataMetadata = {
  competitionCode: string;
  name: string;
  dataKind: 'competition-results' | 'competition-patches';
  target: 'national-team' | 'club';
  scope: 'global' | 'confederation' | 'domestic' | 'custom';
  sources: CompetitionDataSource[];
  notes?: string[];
  lastVerifiedAt?: string;
};
