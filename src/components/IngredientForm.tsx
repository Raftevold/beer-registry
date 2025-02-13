import { useState } from 'react';
import { MaltIngredient, HopIngredient, YeastIngredient } from '../types/beer';

interface IngredientFormProps {
  malts: MaltIngredient[];
  hops: HopIngredient[];
  yeast: YeastIngredient[];
  onUpdateMalts: (malts: MaltIngredient[]) => void;
  onUpdateHops: (hops: HopIngredient[]) => void;
  onUpdateYeast: (yeast: YeastIngredient[]) => void;
}

export function IngredientForm({ malts, hops, yeast, onUpdateMalts, onUpdateHops, onUpdateYeast }: IngredientFormProps) {
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

  const [newYeast, setNewYeast] = useState<Omit<YeastIngredient, 'id'>>({
    name: '',
    amount: 0,
    type: '',
    temperature: 0,
    batchNumber: ''
  });

  const handleAddMalt = (e: React.MouseEvent) => {
    e.preventDefault();
    onUpdateMalts([...malts, { ...newMalt, id: Date.now().toString() }]);
    setNewMalt({ name: '', amount: 0, batchNumber: '', supplier: '' });
  };

  const handleAddHop = (e: React.MouseEvent) => {
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

  const handleAddYeast = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newYeast.type) return;
    onUpdateYeast([...yeast, { ...newYeast, id: Date.now().toString() }]);
    setNewYeast({ name: '', amount: 0, type: '', temperature: 0, batchNumber: '' });
  };

  const handleRemoveMalt = (id: string) => {
    onUpdateMalts(malts.filter(malt => malt.id !== id));
  };

  const handleRemoveHop = (id: string) => {
    onUpdateHops(hops.filter(hop => hop.id !== id));
  };

  const handleRemoveYeast = (id: string) => {
    onUpdateYeast(yeast.filter(y => y.id !== id));
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
              <span className="text-sm text-gray-500">{malt.batchNumber}</span>
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

        <div className="mt-3 grid grid-cols-5 gap-2">
          <div className="col-span-2">
            <label htmlFor="malt-name" className="sr-only">Malt navn</label>
            <input
              type="text"
              id="malt-name"
              name="malt-name"
              placeholder="Malt navn"
              value={newMalt.name}
              onChange={e => setNewMalt(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="malt-amount" className="sr-only">Mengde (kg)</label>
            <input
              type="number"
              id="malt-amount"
              name="malt-amount"
              placeholder="kg"
              value={newMalt.amount || ''}
              onChange={e => setNewMalt(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="malt-batch" className="sr-only">Sporing</label>
            <input
              type="text"
              id="malt-batch"
              name="malt-batch"
              placeholder="Sporing"
              value={newMalt.batchNumber}
              onChange={e => setNewMalt(prev => ({ ...prev, batchNumber: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddMalt}
            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Legg til malt"
          >
            Legg til
          </button>
        </div>
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
              <span className="text-sm text-gray-500">{hop.batchNumber}</span>
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

        <div className="mt-3 grid grid-cols-6 gap-2">
          <div className="col-span-2">
            <label htmlFor="hop-name" className="sr-only">Humle navn</label>
            <input
              type="text"
              id="hop-name"
              name="hop-name"
              placeholder="Humle navn"
              value={newHop.name}
              onChange={e => setNewHop(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="hop-amount" className="sr-only">Mengde (gram)</label>
            <input
              type="number"
              id="hop-amount"
              name="hop-amount"
              placeholder="gram"
              value={newHop.amount || ''}
              onChange={e => setNewHop(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="hop-alpha" className="sr-only">Alpha syre (%)</label>
            <input
              type="number"
              id="hop-alpha"
              name="hop-alpha"
              placeholder="α%"
              value={newHop.alphaAcid || ''}
              onChange={e => setNewHop(prev => ({ ...prev, alphaAcid: parseFloat(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="hop-batch" className="sr-only">Sporing</label>
            <input
              type="text"
              id="hop-batch"
              name="hop-batch"
              placeholder="Sporing"
              value={newHop.batchNumber}
              onChange={e => setNewHop(prev => ({ ...prev, batchNumber: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddHop}
            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Legg til humle"
          >
            Legg til
          </button>
        </div>

        <div className="mt-2">
          <label htmlFor="hop-timing" className="block text-sm text-gray-600 mb-1">Koketid (minutter)</label>
          <input
            type="number"
            id="hop-timing"
            name="hop-timing"
            value={newHop.timing}
            onChange={e => setNewHop(prev => ({ ...prev, timing: parseInt(e.target.value) }))}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      {/* Yeast Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Gjær</h4>
        
        <div className="space-y-4">
          {yeast.map(y => (
            <div key={y.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
              <span className="flex-1">{y.type}</span>
              <span>{y.temperature}°C</span>
              <span className="text-sm text-gray-500">{y.batchNumber}</span>
              <button
                onClick={() => handleRemoveYeast(y.id)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <div>
            <label htmlFor="yeast-type" className="sr-only">Gjærtype</label>
            <input
              type="text"
              id="yeast-type"
              name="yeast-type"
              placeholder="Gjærtype"
              value={newYeast.type}
              onChange={e => setNewYeast(prev => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="yeast-temp" className="sr-only">Gjøringstemperatur (°C)</label>
            <input
              type="number"
              id="yeast-temp"
              name="yeast-temp"
              placeholder="Temperatur"
              onChange={e => setNewYeast(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="yeast-batch" className="sr-only">Sporing</label>
            <input
              type="text"
              id="yeast-batch"
              name="yeast-batch"
              placeholder="Sporing"
              value={newYeast.batchNumber}
              onChange={e => setNewYeast(prev => ({ ...prev, batchNumber: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddYeast}
            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Legg til gjær"
          >
            Legg til
          </button>
        </div>
      </div>
    </div>
  );
}