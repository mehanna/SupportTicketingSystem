'use server';
import * as Sentry from '@sentry/nextjs';

interface TicketActionState {
    success: boolean;
    message: string;
}

export async function createTicket(
    prevState: TicketActionState,
    formData: FormData
): Promise<TicketActionState> {
    try {
        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;

        console.log('Creating ticket with the following details:');
        console.log('Subject:', subject);
        console.log('Description:', description);
        console.log('Priority:', priority);
        // Adding console log to ticket creation action
        if (!subject || !description || !priority) {
            Sentry.captureMessage(
                'Ticket creation failed: missing required fields', 
                { level: 'warning' });
            return { success: false, message: 'All fields are required.' };
        }

        return { success: true, message: 'Ticket created successfully' };
    } catch (error) {
        Sentry.captureException(error as Error, {
            extra: { formData: Object.fromEntries(formData.entries()) }
        });
        return { success: false, message: 'An error occurred while creating the ticket.' };
    }
}