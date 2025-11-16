import * as Sentry from '@sentry/nextjs';
import { error } from 'console';

/**
 * This function logs events to Sentry with optional context data.
 */
type LogLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug' | 'log';

export function logEvent(
    message: string, 
    category: string = 'general',
    data?: Record<string, any>,// any additional data to attach
    level: LogLevel = 'info', // default log level is 'info'
    error?: unknown
) {
    Sentry.addBreadcrumb({
        category,
        message,
        level,
        data
    });
    if (error) {
        Sentry.captureException(error as Error, { extra: data });
    } else {
        Sentry.captureMessage(message, { level, extra: data });
    }
}
