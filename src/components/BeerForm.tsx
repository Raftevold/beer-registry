import { useState, useEffect } from 'react'
import { Beer, Division, calculateABV, MaltIngredient, HopIngredient } from '../types/beer'
import { IngredientForm } from './IngredientForm'

interface BeerFormProps {
  onSubmit: (beer: Omit<Beer, 'id'>) => void;
  onCancel: () => void;
  initialBeer?: Beer;
  division: Division;
}

export function BeerForm({ onSubmit, onCancel, initialBeer, division }: BeerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    originalGravity: 1.050,
    finalGravity: 1.010,
    brewDate: new Date().toISOString().split('T')[0],
    description: '',
    batchSize: 20,
    status: 'Planning' as Beer['status']
  });

  const [malts, setMalts] = useState<MaltIngredient[]>([]);
  const [hops, setHops] = useState<HopIngredient[]>([]);

  useEffect(() => {
    if (initialBeer) {
      setFormData({
        name: initialBeer.name,
        style: initialBeer.style,
        originalGravity: initialBeer.originalGravity,
        finalGravity: initialBeer.finalGravity,
        brewDate: new Date(initialBeer.brewDate).toISOString().split('T')[0],
        description: initialBeer.description || '',
        batchSize: initialBeer.batchSize,
        status: initialBeer.status
      });
      setMalts(initialBeer.ingredients.malts);
      setHops(initialBeer.ingredients.hops);
    }
  }, [initialBeer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const abv = calculateABV(formData.originalGravity, formData.finalGravity);
    onSubmit({
      ...formData,
      abv,
      brewDate: new Date(formData.brewDate),
      division,
      notes: initialBeer?.notes || [],
      ingredients: {
        malts,
        hops
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Navn</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stil</label>
          <input
            type="text"
            required
            value={formData.style}
            onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Original Gravity (OG)</label>
            <input
              type="number"
              step="0.001"
              min="1.000"
              max="1.200"
              required
              value={formData.originalGravity}
              onChange={(e) => setFormData(prev => ({ ...prev, originalGravity: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Final Gravity (FG)</label>
            <input
              type="number"
              step="0.001"
              min="0.995"
              max="1.200"
              required
              value={formData.finalGravity}
              onChange={(e) => setFormData(prev => ({ ...prev, finalGravity: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-800">
            Estimated ABV: {calculateABV(formData.originalGravity, formData.finalGravity).toFixed(1)}%
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Batch Størrelse (L)</label>
          <input
            type="number"
            required
            value={formData.batchSize}
            onChange={(e) => setFormData(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bryggedato</label>
          <input
            type="date"
            required
            value={formData.brewDate}
            onChange={(e) => setFormData(prev => ({ ...prev, brewDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Beer['status'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Planning">Planlegging</option>
            <option value="Brewing">Brygging</option>
            <option value="Fermenting">Gjæring</option>
            <option value="Conditioning">Modning</option>
            <option value="Ready">Klar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ingredienser</h3>
        <IngredientForm
          malts={malts}
          hops={hops}
          onUpdateMalts={setMalts}
          onUpdateHops={setHops}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Avbryt
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {initialBeer ? 'Oppdater' : 'Legg til'}
        </button>
      </div>
    </form>
  );
}