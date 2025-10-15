
export type Base<
  T extends {
    createdAt?: Date | null | undefined;
    updatedAt?: Date | null | undefined;
    deletedAt?: Date | null | undefined;
    id?: string | null | undefined;
    [key: string]: unknown;
  },
> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt' | 'id'>;
