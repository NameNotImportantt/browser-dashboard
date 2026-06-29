export type BackupJsonPrimitive = string | number | boolean | null;

export interface BackupJsonObject {
  [key: string]: BackupJsonValue | undefined;
}

export type BackupJsonValue = BackupJsonPrimitive | BackupJsonObject | BackupJsonValue[];
