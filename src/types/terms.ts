export type SectionType = "steps" | "policy" | "terms" | "acknowledgment" | "custom";
export type SectionColor = "default" | "blue" | "yellow" | "green" | "red" | "orange";

export interface TermsSectionItem {
  text?: string;
  title?: string;
  body?: string;
  color?: SectionColor;
}

export interface TermsSection {
  type: SectionType;
  section_label: string;
  items: TermsSectionItem[];
}

export interface ITermsCondition {
  id: string;
  title: string;
  content: TermsSection[];
  action_type: string;
  payment_option_id?: string | null;
  withdrawal_type_id?: string | null;
}
