export interface NotesWidgetProps {
  text: string;
  onSave: (text: string) => Promise<void>;
}
