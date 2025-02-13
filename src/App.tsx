import { useEffect, useState } from 'react'
import { Beer, Division, BeerNote } from './types/beer'
import { BeerCard } from './components/BeerCard'
import { BeerForm } from './components/BeerForm'
import { StatsDashboard } from './components/StatsDashboard'
import { LoginPage } from './components/LoginPage'
import { ExportModal } from './components/ExportModal'
import { Dialog } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { db } from './firebase/config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [selectedDivision, setSelectedDivision] = useState<Division>('Otterdal Bryggeri')
  const [beers, setBeers] = useState<Beer[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBeer, setEditingBeer] = useState<Beer | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<Beer['status'] | 'All'>('All')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const beersPerPage = 6;

  useEffect(() => {
    const loadBeers = async () => {
      const beersCollection = collection(db, 'beers');
      const beerSnapshot = await getDocs(beersCollection);
      const loadedBeers = beerSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          brewDate: data.brewDate.toDate(),
          completionDate: data.completionDate?.toDate(),
          bestBeforeDate: data.bestBeforeDate?.toDate(),
          notes: data.notes.map((note: any) => ({
            ...note,
            date: note.date.toDate()
          }))
        } as Beer;
      });
      setBeers(loadedBeers);
    };
    loadBeers();
  }, []);

  const filteredBeers = beers
    .filter(beer => beer.division === selectedDivision)
    .filter(beer => 
      beer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beer.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beer.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(beer => filterStatus === 'All' ? true : beer.status === filterStatus)
    .sort((a, b) => b.brewDate.getTime() - a.brewDate.getTime())

  const pageCount = Math.ceil(filteredBeers.length / beersPerPage);
  const paginatedBeers = filteredBeers.slice(
    (currentPage - 1) * beersPerPage,
    currentPage * beersPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, selectedDivision]);

  const handleAddNote = async (beerId: string, note: Omit<BeerNote, 'id'>) => {
    const beerRef = doc(db, 'beers', beerId);
    const newNote = {
      ...note,
      id: Date.now().toString(),
      date: Timestamp.fromDate(note.date)
    };
    const beer = beers.find(b => b.id === beerId);
    if (beer) {
      const updatedNotes = [...beer.notes, newNote];
      await updateDoc(beerRef, { notes: updatedNotes });
      setBeers(prev => prev.map(beer => {
        if (beer.id === beerId) {
          return {
            ...beer,
            notes: [...beer.notes, { ...newNote, date: note.date }]
          };
        }
        return beer;
      }));
    }
  };

  const handleAddBeer = async (beerData: Omit<Beer, 'id'>) => {
    const beersCollection = collection(db, 'beers');
    const docRef = await addDoc(beersCollection, {
      ...beerData,
      brewDate: Timestamp.fromDate(beerData.brewDate instanceof Date ? beerData.brewDate : beerData.brewDate.toDate()),
      completionDate: beerData.completionDate ? Timestamp.fromDate(beerData.completionDate instanceof Date ? beerData.completionDate : beerData.completionDate.toDate()) : null,
      notes: []
    });
    const newBeer = {
      ...beerData,
      id: docRef.id,
      notes: []
    };
    setBeers(prev => [...prev, newBeer]);
    setIsFormOpen(false);
  };

  const handleEditBeer = async (beerData: Omit<Beer, 'id'>) => {
    if (!editingBeer) return;
    const beerRef = doc(db, 'beers', editingBeer.id);
    
    // Convert dates to Firestore Timestamps
    const updateData = {
      ...beerData,
      brewDate: Timestamp.fromDate(beerData.brewDate instanceof Date ? beerData.brewDate : beerData.brewDate.toDate()),
      completionDate: beerData.completionDate ? Timestamp.fromDate(beerData.completionDate instanceof Date ? beerData.completionDate : beerData.completionDate.toDate()) : null
    };
    
    await updateDoc(beerRef, updateData);
    setBeers(prev => prev.map(beer => 
      beer.id === editingBeer.id ? { ...beerData, id: beer.id } : beer
    ));
    setIsFormOpen(false);
    setEditingBeer(undefined);
  };

  const handleDeleteBeer = async (id: string) => {
    const beerRef = doc(db, 'beers', id);
    await deleteDoc(beerRef);
    setBeers(prev => prev.filter(beer => beer.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
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
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            {/* Division Selector */}
            <div className="mb-8 flex justify-between items-center">
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
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              >
                Eksporter Brygg
              </button>
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
                  <>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {paginatedBeers.map(beer => (
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

                    {/* Pagination Controls */}
                    {pageCount > 1 && (
                      <div className="mt-6 flex justify-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 
                                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Forrige
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                          disabled={currentPage === pageCount}
                          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 
                                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Neste
                        </button>
                      </div>
                    )}
                  </>
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
          <Dialog.Panel className="mx-auto max-w-xl bg-white rounded-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <Dialog.Title className="text-lg font-medium">
                {editingBeer ? 'Rediger brygg' : 'Registrer nytt brygg'}
              </Dialog.Title>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <BeerForm
                onSubmit={editingBeer ? handleEditBeer : handleAddBeer}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingBeer(undefined)
                }}
                initialBeer={editingBeer}
                division={selectedDivision}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        beers={filteredBeers}
      />
    </div>
  );
}

export default App
