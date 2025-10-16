/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { ZodType } from 'zod';
import {
  useForm,
  type Path,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { EditionMode } from '@/lib/table/hooks/forms/useEntityEditor';

export interface GenericFormField<T extends FieldValues> {
  name: keyof T;
  label: string;
  type: (typeof inputTypes)[number] | 'textarea' | 'select';
  options?: string[]; // pour select
  placeholder?: string;
  required?: boolean;
}

interface GenericFormProps<T extends FieldValues, CreateDTO, UpdateDTO> {
  entity?: DefaultValues<T>;
  fields: GenericFormField<T>[];
  schema: ZodType<T>;
  editionMode: EditionMode;
  loading?: boolean;
  error?: Record<string, string> | null;
  onSubmit: (data: CreateDTO | UpdateDTO) => void;
  onCancel?: () => void;
}

const inputTypes = [
  'number',
  'search',
  'date',
  'email',
  'url',
  'time',
  'text',
  'file',
  'button',
  'image',
  'hidden',
  'color',
  'submit',
  'reset',
  'checkbox',
  'radio',
  'tel',
  'datetime-local',
  'month',
  'password',
  'range',
  'week',
] as const;

export default function GenericForm<
  T extends FieldValues,
  CreateDTO,
  UpdateDTO,
>({
  entity,
  fields,
  schema,
  loading = false,
  onSubmit,
  onCancel,
  editionMode,
}: GenericFormProps<T, CreateDTO, UpdateDTO>) {
  const { t } = useTranslation();

  type SchemaType = T;

  const form = useForm<SchemaType>({
    // cast schema to any for the resolver call to avoid overload incompatibilities between zod/resolvers/react-hook-form versions
    resolver: zodResolver(schema as any) as unknown as Resolver<SchemaType>,
    defaultValues: entity as DefaultValues<SchemaType> | undefined,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<T>)}
        className='space-y-6'
      >
        {fields
          .filter((f) => {
            if (editionMode === EditionMode.UPDATE) {
              return f.type !== 'password';
            }
            return true;
          })
          .map((field) => (
            <FormField
              key={String(field.name)}
              control={form.control}
              name={field.name as Path<SchemaType>}
              render={({ field: rhfField }) => {
                return (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {(() => {
                        switch (field.type) {
                          case 'textarea':
                            return (
                              <textarea
                                {...rhfField}
                                disabled={loading}
                                placeholder={field.placeholder}
                                className='w-full border rounded p-2'
                              />
                            );
                          case 'select':
                            return (
                              <Select
                                name={String(field.name)}
                                value={rhfField.value}
                                onValueChange={rhfField.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={field.placeholder || 'Select'}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {t(opt)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          default:
                            // Gère tous les types d'input standard
                            return (
                              <Input
                                {...rhfField}
                                type={field.type}
                                disabled={loading}
                                placeholder={field.placeholder}
                              />
                            );
                        }
                      })()}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}

        <div className='flex justify-end gap-4'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
          )}
          <Button type='submit' disabled={loading}>
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
