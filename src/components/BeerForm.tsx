import { useState, useEffect } from 'react'
import { Beer, Division, calculateABV, MaltIngredient, HopIngredient, YeastIngredient } from '../types/beer'
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
    completionDate: '',
    bestBeforeDate: '',
    description: '',
    batchSize: 20,
    status: 'Planning' as Beer['status'],
    allergens: ''
  });

  const [malts, setMalts] = useState<MaltIngredient[]>([]);
  const [hops, setHops] = useState<HopIngredient[]>([]);
  const [yeast, setYeast] = useState<YeastIngredient[]>([]);

  useEffect(() => {
    if (initialBeer) {
      const getBestBeforeDate = (date: Date | { toDate(): Date } | undefined) => {
        if (!date) return '';
        try {
          const dateObj = date instanceof Date ? date : date.toDate();
          return dateObj.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        name: initialBeer.name,
        style: initialBeer.style,
        originalGravity: initialBeer.originalGravity,
        finalGravity: initialBeer.finalGravity,
        brewDate: getBestBeforeDate(initialBeer.brewDate),
        completionDate: initialBeer.completionDate 
          ? getBestBeforeDate(initialBeer.completionDate)
          : '',
        bestBeforeDate: getBestBeforeDate(initialBeer.bestBeforeDate),
        description: initialBeer.description || '',
        batchSize: initialBeer.batchSize,
        status: initialBeer.status,
        allergens: initialBeer.allergens || ''
      });
      setMalts(initialBeer.ingredients.malts);
      setHops(initialBeer.ingredients.hops);
      setYeast(initialBeer.ingredients.yeast || []);
    }
  }, [initialBeer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const abv = calculateABV(formData.originalGravity, formData.finalGravity);
    
    // Set completion date based on status and form input
    const completionDate = formData.status === 'Ready' 
      ? (formData.completionDate ? new Date(formData.completionDate) : new Date())
      : undefined;

    onSubmit({
      ...formData,
      abv,
      brewDate: new Date(formData.brewDate),
      completionDate,
      bestBeforeDate: formData.bestBeforeDate ? new Date(formData.bestBeforeDate) : undefined,
      division,
      notes: initialBeer?.notes || [],
      ingredients: {
        malts,
        hops,
        yeast
      },
      allergens: formData.allergens || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="beer-name" className="block text-sm font-medium text-gray-700">Navn</label>
          <input
            id="beer-name"
            name="beer-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="beer-style" className="block text-sm font-medium text-gray-700">Stil</label>
          <input
            id="beer-style"
            name="beer-style"
            type="text"
            required
            value={formData.style}
            onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="original-gravity" className="block text-sm font-medium text-gray-700">Original Gravity (OG)</label>
            <input
              id="original-gravity"
              name="original-gravity"
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
            <label htmlFor="final-gravity" className="block text-sm font-medium text-gray-700">Final Gravity (FG)</label>
            <input
              id="final-gravity"
              name="final-gravity"
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
          <label htmlFor="batch-size" className="block text-sm font-medium text-gray-700">Batch Størrelse (L)</label>
          <input
            id="batch-size"
            name="batch-size"
            type="number"
            required
            value={formData.batchSize}
            onChange={(e) => setFormData(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="brew-date" className="block text-sm font-medium text-gray-700">Bryggedato</label>
          <input
            id="brew-date"
            name="brew-date"
            type="date"
            required
            value={formData.brewDate}
            onChange={(e) => setFormData(prev => ({ ...prev, brewDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [color-scheme:light]"
          />
        </div>

        <div>
          <label htmlFor="beer-status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="beer-status"
            name="beer-status"
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

        {formData.status === 'Ready' && (
          <div>
            <label htmlFor="completion-date" className="block text-sm font-medium text-gray-700">Ferdig dato</label>
            <input
              id="completion-date"
              name="completion-date"
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [color-scheme:light]"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="mt-1 text-sm text-gray-500">
              Om ferdig dato ikke er satt, vil dagens dato bli brukt
            </p>
          </div>
        )}

        <div>
          <label htmlFor="best-before-date" className="block text-sm font-medium text-gray-700">Best før dato</label>
          <input
            id="best-before-date"
            name="best-before-date"
            type="date"
            value={formData.bestBeforeDate}
            onChange={(e) => setFormData(prev => ({ ...prev, bestBeforeDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 [color-scheme:light]"
            min={formData.completionDate || undefined}
          />
        </div>

        <div>
          <label htmlFor="beer-description" className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            id="beer-description"
            name="beer-description"
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
          yeast={yeast}
          onUpdateMalts={setMalts}
          onUpdateHops={setHops}
          onUpdateYeast={setYeast}
        />

        <div className="mt-4">
          <label htmlFor="allergens" className="block text-sm font-medium text-gray-700">Allergener</label>
          <input
            id="allergens"
            name="allergens"
            type="text"
            value={formData.allergens}
            onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
            placeholder="F.eks: Bygg, hvete, gluten, humle"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Liste over allergener, separert med komma</p>
        </div>
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