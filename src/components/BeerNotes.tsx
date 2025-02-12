import { useState } from 'react';
import { BeerNote } from '../types/beer';

interface BeerNotesProps {
  notes: BeerNote[];
  onAddNote: (note: Omit<BeerNote, 'id'>) => void;
}

export function BeerNotes({ notes, onAddNote }: BeerNotesProps) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    onAddNote({
      date: new Date(),
      text: newNote.trim()
    });
    setNewNote('');
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Brewing Notes</h4>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">
              {note.date.toLocaleDateString()} {note.date.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-700 mt-1">{note.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}