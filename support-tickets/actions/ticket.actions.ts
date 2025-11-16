'use server';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';// this is used to revalidate the path after creating a ticket
import { logEvent } from '@/utils/sentry';
import { log } from 'console';
import { getCurrentUser } from '@/lib/current-user';

interface TicketActionState {
    success: boolean;
    message: string;
}

export async function createTicket(
    prevState: TicketActionState,
    formData: FormData
): Promise<TicketActionState> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            logEvent(
                'Ticket creation failed: user not authenticated',
                'ticket',
                {},
                'warning'
            );
            return { success: false, message: 'You must be logged in to create a ticket.' };
        }
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
                priority,
                userId: currentUser.id,
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

export async function getTickets() {
    try{
        const tickets = await prisma.ticket.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        log(
            'Fetched tickets list:', 
            'tickets',
            { count: tickets.length },
            'info'
        );
        return tickets;

    }
    catch(error){
        logEvent(
            'Fetching tickets failed: unexpected error',
            'tickets',
            {},
            'error',
            error
        );
        return [];
    }
}

export async function getTicketById(ticketId: string) {
    try{
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: Number(ticketId),
            },
        });
        if(!ticket){
            logEvent(
                `Ticket with ID: ${ticketId} not found`,
                'ticket',
                { ticketId },
                'warning'
            );
            return null;
        }
        
        logEvent(
            `Fetched ticket with ID: ${ticketId}`,
            'ticket',
            { ticketId },
            'info'
        );
        return ticket;

    }
    catch(error){
        logEvent(
            `Fetching ticket with ID: ${ticketId} failed: unexpected error`,
            'ticket',
            { ticketId },
            'error',
            error
        );
        return null;
    }
}