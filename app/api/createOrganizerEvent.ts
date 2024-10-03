import { NextApiRequest, NextApiResponse } from 'next';
import { createOrganizerEvent } from '@/lib/actions/organizer.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const eventData = req.body;
      const newEvent = await createOrganizerEvent(eventData);
      res.status(200).json(newEvent);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: 'Error creating event', details: error instanceof Error ? error.message : String(error) });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
