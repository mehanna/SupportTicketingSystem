'use server';

interface TicketActionState {
    success: boolean;
    message: string;
}

export async function createTicket(
    prevState: TicketActionState,
    formData: FormData
): Promise<TicketActionState> {
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;

    console.log('Creating ticket with the following details:');
    console.log('Subject:', subject);
    console.log('Description:', description);
    console.log('Priority:', priority);

    return { success: true, message: 'Ticket created successfully' };
}