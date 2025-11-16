'use server';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';// this is used to revalidate the path after creating a ticket
import { logEvent } from '@/utils/sentry';

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

        // Adding console log to ticket creation action
        if (!subject || !description || !priority) {
            logEvent(
                'Ticket creation failed: missing required fields',
                'ticket',
                { subject, description, priority },
                'warning'
            );
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
        // Log successful ticket creation
        logEvent(
            `Ticket created with ID: ${ticket.id}`,
            'ticket',
            { ticketId: ticket.id },
            'info'
        );
        // revalidate the tickets list page to show the new ticket
        // what will happen is that Next.js will regenerate the /tickets page
        revalidatePath('/tickets');

        return { success: true, message: 'Ticket created successfully' };
    } catch (error) {
        logEvent(
            'Ticket creation failed: unexpected error',
            'ticket',
            {formData: Object.fromEntries(formData.entries())},
            'error',
            error
        );
        return { success: false, message: 'An error occurred while creating the ticket.' };
    }
}