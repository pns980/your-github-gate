export interface Rule {
  title: string;
  description: string;
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

