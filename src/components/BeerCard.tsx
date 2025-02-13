import { useState } from 'react';
import { Beer, BeerNote, DateOrTimestamp } from '../types/beer';
import { BeerNotes } from './BeerNotes';

interface BeerCardProps {
  beer: Beer;
  onEdit: (beer: Beer) => void;
  onDelete: (id: string) => void;
  onAddNote: (beerId: string, note: Omit<BeerNote, 'id'>) => void;
}

const getDateFromValue = (value: DateOrTimestamp): Date => {
  return value instanceof Date ? value : value.toDate();
};

const formatDate = (date: DateOrTimestamp): string => {
  return getDateFromValue(date).toLocaleDateString();
};

export function BeerCard({ beer, onEdit, onDelete, onAddNote }: BeerCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  
  const daysInProduction = beer.status === 'Ready' && beer.completionDate
    ? Math.ceil((getDateFromValue(beer.completionDate).getTime() - getDateFromValue(beer.brewDate).getTime()) / (1000 * 3600 * 24))
    : Math.ceil((new Date().getTime() - getDateFromValue(beer.brewDate).getTime()) / (1000 * 3600 * 24));

  const productionTimeText = beer.status === 'Ready' 
    ? `Produksjonstid: ${daysInProduction} dager` 
    : `Dager i produksjon: ${daysInProduction}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{beer.name}</h3>
        <span className={`px-2 py-1 text-sm rounded-full ${
          beer.status === 'Ready' ? 'bg-green-100 text-green-800' :
          beer.status === 'Brewing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {beer.status}
        </span>
      </div>
      
      <div className="mt-2 space-y-2">
        <p className="text-sm text-gray-600">Style: {beer.style}</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm text-gray-600">OG: {beer.originalGravity.toFixed(3)}</p>
          <p className="text-sm text-gray-600">FG: {beer.finalGravity.toFixed(3)}</p>
        </div>
        <p className="text-sm font-medium text-gray-700">ABV: {beer.abv.toFixed(1)}%</p>
        <p className="text-sm text-gray-600">Batch Size: {beer.batchSize}L</p>
        <p className="text-sm text-gray-600">
          Brew Date: {formatDate(beer.brewDate)}
        </p>
        <p className="text-sm text-gray-600">
          {productionTimeText}
        </p>
        {beer.completionDate && (
          <p className="text-sm text-gray-600">
            Ferdig dato: {formatDate(beer.completionDate)}
          </p>
        )}
        {beer.bestBeforeDate && (
          <p className="text-sm text-gray-600">
            Best før: {formatDate(beer.bestBeforeDate)}
          </p>
        )}
        {beer.description && (
          <p className="text-sm text-gray-600">{beer.description}</p>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(beer)}
            className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(beer.id)}
            className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            Delete
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
          >
            {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
          </button>
        </div>

        {showIngredients && (
          <div className="space-y-4">
            {/* Malts */}
            {beer.ingredients.malts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Malt</h4>
                <div className="space-y-2">
                  {beer.ingredients.malts.map(malt => (
                    <div key={malt.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span>{malt.name}</span>
                      <span className="mx-2">•</span>
                      <span>{malt.amount}kg</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">Sporing #{malt.batchNumber}</span>
                      {malt.supplier && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-gray-500">{malt.supplier}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hops */}
            {beer.ingredients.hops.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Humle</h4>
                <div className="space-y-2">
                  {beer.ingredients.hops.map(hop => (
                    <div key={hop.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span>{hop.name}</span>
                      <span className="mx-2">•</span>
                      <span>{hop.amount}g</span>
                      <span className="mx-2">•</span>
                      <span>{hop.alphaAcid}% α</span>
                      <span className="mx-2">•</span>
                      <span>{hop.timing}min</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">Sporing #{hop.batchNumber}</span>
                      {hop.supplier && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-gray-500">{hop.supplier}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeast */}
            {beer.ingredients.yeast && beer.ingredients.yeast.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Gjær</h4>
                <div className="space-y-2">
                  {beer.ingredients.yeast.map(y => (
                    <div key={y.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span>{y.type}</span>
                      <span className="mx-2">•</span>
                      <span>{y.temperature}°C</span>
                      {y.batchNumber && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-gray-500">Sporing #{y.batchNumber}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showNotes && (
          <BeerNotes
            notes={beer.notes || []}
            onAddNote={(note) => onAddNote(beer.id, note)}
          />
        )}
      </div>
    </div>
  );
}