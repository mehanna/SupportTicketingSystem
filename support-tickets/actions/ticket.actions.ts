'use server';
import * as Sentry from '@sentry/nextjs';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';// this is used to revalidate the path after creating a ticket

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
        // create the ticket in the database
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                priority
            },
        });
        Sentry.addBreadcrumb({
            category: 'ticket',
            message: `Ticket created with ID: ${ticket.id}`,
            level: 'info'
        });
        Sentry.captureMessage(`Ticket created successfully with ID: ${ticket.id}`);

        // revalidate the tickets list page to show the new ticket
        // what will happen is that Next.js will regenerate the /tickets page
        revalidatePath('/tickets');

        return { success: true, message: 'Ticket created successfully' };
    } catch (error) {
        Sentry.captureException(error as Error, {
            extra: { formData: Object.fromEntries(formData.entries()) }
        });
        return { success: false, message: 'An error occurred while creating the ticket.' };
    }
}