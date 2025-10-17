import { format, formatDistanceToNow, type Locale } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Map your app locales to date-fns locales
const localeMap: Record<string, Locale> = {
  en: enUS,
  fr: fr,
};

/**
 * Composable for formatting dates with app locale support
 * @returns Object with formatDate function and current locale
 * @example
 * In a Vue component
 * const { formatDate, formatDateTime, formatTime } = useDateFormat()
 *
 * Format a date
 * const formattedDate = formatDate(new Date()) // "5 juin 2025" (fr) or "June 5th, 2025" (en)
 *
 * Format with custom pattern
 * const customDate = formatDate(new Date(), 'dd/MM/yyyy') // "05/06/2025"
 * For more examples, see the function documentation below.
 * @see {@link https://date-fns.org/v4.1.0/docs/format | date-fns format documentation}
 */
export function useDateFormat() {
  const { i18n } = useTranslation();

  // Get the current date-fns locale based on app locale
  const dateFnsLocale = useMemo(() => {
    return localeMap[i18n.language] || fr; // Default to French if locale not found
  }, [i18n.language]);

  /**
   * Format a date using the current app locale
   * @param date - Date to format (Date, string, or number)
   * @param formatString - Format pattern (default: 'PPP' for localized date)
   * @returns Formatted date string
   * @example
   * Returns "5 juin 2025" (fr) or "June 5th, 2025" (en)
   * formatDate(new Date('2025-06-05'))
   *
   * Returns "05/06/2025" (custom format)
   * formatDate(new Date('2025-06-05'), 'dd/MM/yyyy')
   */
  const formatDate = (
    date: Date | string | number,
    formatString: string = 'PPP'
  ): string => {
    try {
      const dateObj =
        typeof date === 'string' || typeof date === 'number'
          ? new Date(date)
          : date;

      return format(dateObj, formatString, {
        locale: dateFnsLocale,
      });
    } catch (_error) {
      return 'Invalid Date';
    }
  };

  /**
   * Format a date with time using the current app locale
   * @param date - Date to format
   * @returns Formatted date and time string
   * @example
   * Returns "5 juin 2025 à 14:30" (fr) or "June 5th, 2025 at 2:30 PM" (en)
   * formatDateTime(new Date('2025-06-05T14:30:00'))
   */
  const formatDateTime = (date: Date | string | number): string => {
    return formatDate(date, 'PPp'); // PPp = localized date + time
  };

  /**
   * Format only the time using the current app locale
   * @param date - Date to format
   * @returns Formatted time string
   * @example
   * Returns "14:30" (fr) or "2:30 PM" (en)
   * formatTime(new Date('2025-06-05T14:30:00'))
   */
  const formatTime = (date: Date | string | number): string => {
    return formatDate(date, 'p'); // p = localized time
  };

  /**
   * Format a short date using the current app locale
   * @param date - Date to format
   * @returns Short formatted date string
   * @example
   * Returns "05/06/2025" (fr) or "06/05/2025" (en)
   * formatShortDate(new Date('2025-06-05'))
   */
  const formatShortDate = (date: Date | string | number): string => {
    return formatDate(date, 'P'); // P = localized short date
  };

  /**
   * Format a relative date (e.g., "2 days ago", "il y a 2 jours")
   * @param date - Date to format
   * @param addSuffix - Whether to add suffix like "ago" (default: true)
   * @returns Relative date string
   * @example
   * Returns "il y a 2 jours" (fr) or "2 days ago" (en)
   * formatRelativeDate(new Date('2025-06-03')) // assuming today is 2025-06-05
   *
   * Returns "dans 2 jours" (fr) or "in 2 days" (en)
   * formatRelativeDate(new Date('2025-06-07')) // future date
   */
  const formatRelativeDate = (
    date: Date | string | number,
    addSuffix: boolean = true
  ): string => {
    try {
      const dateObj =
        typeof date === 'string' || typeof date === 'number'
          ? new Date(date)
          : date;

      return formatDistanceToNow(dateObj, {
        addSuffix,
        locale: dateFnsLocale,
      });
    } catch (_error) {
      return 'Invalid Date';
    }
  };

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatShortDate,
    formatRelativeDate,
    locale: dateFnsLocale,
  };
}
