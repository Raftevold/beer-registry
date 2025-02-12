import { useState } from 'react';
import { MaltIngredient, HopIngredient } from '../types/beer';

interface IngredientFormProps {
  malts: MaltIngredient[];
  hops: HopIngredient[];
  onUpdateMalts: (malts: MaltIngredient[]) => void;
  onUpdateHops: (hops: HopIngredient[]) => void;
}

export function IngredientForm({ malts, hops, onUpdateMalts, onUpdateHops }: IngredientFormProps) {
  const [newMalt, setNewMalt] = useState<Omit<MaltIngredient, 'id'>>({
    name: '',
    amount: 0,
    batchNumber: '',
    supplier: ''
  });

  const [newHop, setNewHop] = useState<Omit<HopIngredient, 'id'>>({
    name: '',
    amount: 0,
    alphaAcid: 0,
    timing: 60,
    batchNumber: '',
    supplier: ''
  });

  const handleAddMalt = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMalts([...malts, { ...newMalt, id: Date.now().toString() }]);
    setNewMalt({ name: '', amount: 0, batchNumber: '', supplier: '' });
  };

  const handleAddHop = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHops([...hops, { ...newHop, id: Date.now().toString() }]);
    setNewHop({
      name: '',
      amount: 0,
      alphaAcid: 0,
      timing: 60,
      batchNumber: '',
      supplier: ''
    });
  };

  const handleRemoveMalt = (id: string) => {
    onUpdateMalts(malts.filter(malt => malt.id !== id));
  };

  const handleRemoveHop = (id: string) => {
    onUpdateHops(hops.filter(hop => hop.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Malt Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Malt</h4>
        
        <div className="space-y-4">
          {malts.map(malt => (
            <div key={malt.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
              <span className="flex-1">{malt.name}</span>
              <span>{malt.amount}kg</span>
              <span className="text-sm text-gray-500">#{malt.batchNumber}</span>
              {malt.supplier && <span className="text-sm text-gray-500">{malt.supplier}</span>}
              <button
                onClick={() => handleRemoveMalt(malt.id)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMalt} className="mt-3 grid grid-cols-5 gap-2">
          <input
            type="text"
            placeholder="Malt navn"
            value={newMalt.name}
            onChange={e => setNewMalt(prev => ({ ...prev, name: e.target.value }))}
            className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="kg"
            value={newMalt.amount || ''}
            onChange={e => setNewMalt(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.1"
          />
          <input
            type="text"
            placeholder="Batch #"
            value={newMalt.batchNumber}
            onChange={e => setNewMalt(prev => ({ ...prev, batchNumber: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Legg til
          </button>
        </form>
      </div>

      {/* Hops Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Humle</h4>
        
        <div className="space-y-4">
          {hops.map(hop => (
            <div key={hop.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
              <span className="flex-1">{hop.name}</span>
              <span>{hop.amount}g</span>
              <span>{hop.alphaAcid}% α</span>
              <span>{hop.timing}min</span>
              <span className="text-sm text-gray-500">#{hop.batchNumber}</span>
              {hop.supplier && <span className="text-sm text-gray-500">{hop.supplier}</span>}
              <button
                onClick={() => handleRemoveHop(hop.id)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddHop} className="mt-3 grid grid-cols-6 gap-2">
          <input
            type="text"
            placeholder="Humle navn"
            value={newHop.name}
            onChange={e => setNewHop(prev => ({ ...prev, name: e.target.value }))}
            className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="gram"
            value={newHop.amount || ''}
            onChange={e => setNewHop(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
          />
          <input
            type="number"
            placeholder="α%"
            value={newHop.alphaAcid || ''}
            onChange={e => setNewHop(prev => ({ ...prev, alphaAcid: parseFloat(e.target.value) }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            max="100"
            step="0.1"
          />
          <input
            type="text"
            placeholder="Batch #"
            value={newHop.batchNumber}
            onChange={e => setNewHop(prev => ({ ...prev, batchNumber: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Legg til
          </button>
        </form>

        <div className="mt-2">
          <label className="block text-sm text-gray-600 mb-1">Koketid (minutter)</label>
          <input
            type="number"
            value={newHop.timing}
            onChange={e => setNewHop(prev => ({ ...prev, timing: parseInt(e.target.value) }))}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}