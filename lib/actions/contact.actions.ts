"use server"

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from "@/lib/database";
import ContactForm from "@/lib/database/models/contact.model";
import { handleError } from "@/lib/utils";

export async function getAllContactForms({ query, limit = 10, page = 1 }: { query?: string, limit?: number, page?: number }) {
  try {
    await connectToDatabase();

    const conditions: { $or?: Array<{ [key: string]: any }> } = {};
    if (query) {
      conditions['$or'] = [
        { userName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } }
      ];
    }

    const skipAmount = (page - 1) * limit;

    const contactForms = await ContactForm.find(conditions)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const contactFormsCount = await ContactForm.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(contactForms)),
      totalPages: Math.ceil(contactFormsCount / limit)
    };
  } catch (error) {
    console.error('Error in getAllContactForms:', error);
    throw error;
  }
}

export async function deleteContactForm({ contactFormId, path }: { contactFormId: string, path: string }) {
  try {
    await connectToDatabase()

    const deletedContactForm = await ContactForm.findByIdAndDelete(contactFormId)
    if (deletedContactForm) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}
