'use server';

export async function createTicket(data: FormData) {
    const subject = data.get('subject') as string;
    const description = data.get('description') as string;
    const priority = data.get('priority') as string;

    console.log('Creating ticket with the following details:');
    console.log('Subject:', subject);
    console.log('Description:', description);
    console.log('Priority:', priority);

    return { success: true, message: 'Ticket created successfully' };
}