import { useState } from 'react'
import { Beer, Division, BeerNote } from './types/beer'
import { BeerCard } from './components/BeerCard'
import { BeerForm } from './components/BeerForm'
import { StatsDashboard } from './components/StatsDashboard'
import { Dialog } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import './App.css'

function App() {
  const [selectedDivision, setSelectedDivision] = useState<Division>('Otterdal Bryggeri')
  const [beers, setBeers] = useState<Beer[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBeer, setEditingBeer] = useState<Beer | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<Beer['status'] | 'All'>('All')

  const filteredBeers = beers
    .filter(beer => beer.division === selectedDivision)
    .filter(beer => 
      beer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beer.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beer.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(beer => filterStatus === 'All' ? true : beer.status === filterStatus)

  const handleAddNote = (beerId: string, note: Omit<BeerNote, 'id'>) => {
    setBeers(prev => prev.map(beer => {
      if (beer.id === beerId) {
        return {
          ...beer,
          notes: [...(beer.notes || []), { ...note, id: Date.now().toString() }]
        };
      }
      return beer;
    }));
  };

  const handleAddBeer = (beerData: Omit<Beer, 'id'>) => {
    const newBeer = {
      ...beerData,
      id: Date.now().toString(),
      notes: []
    }
    setBeers(prev => [...prev, newBeer])
    setIsFormOpen(false)
  }

  const handleEditBeer = (beerData: Omit<Beer, 'id'>) => {
    if (!editingBeer) return
    setBeers(prev => prev.map(beer => 
      beer.id === editingBeer.id ? { ...beerData, id: beer.id } : beer
    ))
    setIsFormOpen(false)
    setEditingBeer(undefined)
  }

  const handleDeleteBeer = (id: string) => {
    setBeers(prev => prev.filter(beer => beer.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Bryggeri Registeret</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            {/* Division Selector */}
            <div className="mb-8">
              <div className="flex space-x-4">
                {['Otterdal Bryggeri', 'Johans Pub'].map((division) => (
                  <button
                    key={division}
                    onClick={() => setSelectedDivision(division as Division)}
                    className={`px-4 py-2 rounded-md ${
                      selectedDivision === division
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {division}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Dashboard */}
            <StatsDashboard 
              beers={beers.filter(beer => beer.division === selectedDivision)} 
              division={selectedDivision}
            />

            {/* Main Content Area */}
            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedDivision}
                </h2>
                
                <button 
                  onClick={() => {
                    setEditingBeer(undefined)
                    setIsFormOpen(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Registrer nytt brygg
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search beers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as Beer['status'] | 'All')}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Planning">Planning</option>
                  <option value="Brewing">Brewing</option>
                  <option value="Fermenting">Fermenting</option>
                  <option value="Conditioning">Conditioning</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>

              {/* Beer List */}
              <div className="mt-4">
                {filteredBeers.length === 0 ? (
                  <p className="text-gray-500">Ingen brygg registrert ennå.</p>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBeers.map(beer => (
                      <BeerCard
                        key={beer.id}
                        beer={beer}
                        onEdit={(beer) => {
                          setEditingBeer(beer)
                          setIsFormOpen(true)
                        }}
                        onDelete={handleDeleteBeer}
                        onAddNote={handleAddNote}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Beer Form Modal */}
      <Dialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBeer(undefined)
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl bg-white rounded-xl p-6 w-full">
            <Dialog.Title className="text-lg font-medium mb-4">
              {editingBeer ? 'Rediger brygg' : 'Registrer nytt brygg'}
            </Dialog.Title>
            
            <BeerForm
              onSubmit={editingBeer ? handleEditBeer : handleAddBeer}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingBeer(undefined)
              }}
              initialBeer={editingBeer}
              division={selectedDivision}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default App
