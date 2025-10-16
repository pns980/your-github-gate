export interface Rule {
  title: string;
  description: string;
  area?: string[];
  skill?: string;
  discipline?: string;
}

export interface RuleResponse {
  id?: string;
  rule_title: string;
  resonates: boolean;
  applicable: boolean;
  learned_new: boolean;
  thoughts: string;
  created_at?: string;
}

