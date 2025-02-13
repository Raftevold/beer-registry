import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Beer, MaltIngredient, HopIngredient, YeastIngredient, DateOrTimestamp } from '../types/beer';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  beers: Beer[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a365d',
    borderBottom: 1,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1e40af',
    borderBottom: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  gridItem: {
    width: '50%',
    marginBottom: 8,
    padding: 4,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#1e293b',
  },
  ingredientList: {
    marginLeft: 20,
    marginTop: 4,
  },
  ingredientItem: {
    fontSize: 11,
    marginBottom: 4,
    color: '#334155',
  },
  noteItem: {
    fontSize: 11,
    marginBottom: 6,
    color: '#334155',
    fontStyle: 'italic',
  },
});

const formatDate = (date: DateOrTimestamp): string => {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return date.toDate().toLocaleDateString();
};

const BeerReport = ({ beer }: { beer: Beer }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.subtitle}>{beer.style} - {beer.division}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grunnleggende Informasjon</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{beer.status}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Batch størrelse</Text>
            <Text style={styles.value}>{beer.batchSize} liter</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>ABV</Text>
            <Text style={styles.value}>{beer.abv.toFixed(2)}%</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Original Gravity (OG)</Text>
            <Text style={styles.value}>{beer.originalGravity}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Final Gravity (FG)</Text>
            <Text style={styles.value}>{beer.finalGravity}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Bryggedato</Text>
            <Text style={styles.value}>{formatDate(beer.brewDate)}</Text>
          </View>
          {beer.completionDate && (
            <View style={styles.gridItem}>
              <Text style={styles.label}>Ferdigstillelsesdato</Text>
              <Text style={styles.value}>{formatDate(beer.completionDate)}</Text>
            </View>
          )}
          {beer.bestBeforeDate && (
            <View style={styles.gridItem}>
              <Text style={styles.label}>Best før</Text>
              <Text style={styles.value}>{formatDate(beer.bestBeforeDate)}</Text>
            </View>
          )}
        </View>
        {beer.description && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.label}>Beskrivelse</Text>
            <Text style={styles.value}>{beer.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredienser</Text>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Malt</Text>
          {beer.ingredients.malts.map((malt: MaltIngredient, index: number) => (
            <Text key={index} style={[styles.ingredientItem, styles.ingredientList]}>
              • {malt.name}: {malt.amount}kg {malt.batchNumber ? `(Batch: ${malt.batchNumber})` : ''}
              {malt.supplier ? ` - ${malt.supplier}` : ''}
            </Text>
          ))}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Humle</Text>
          {beer.ingredients.hops.map((hop: HopIngredient, index: number) => (
            <Text key={index} style={[styles.ingredientItem, styles.ingredientList]}>
              • {hop.name}: {hop.amount}g, {hop.alphaAcid}% α, {hop.timing} min
              {hop.batchNumber ? ` (Batch: ${hop.batchNumber})` : ''}
              {hop.supplier ? ` - ${hop.supplier}` : ''}
            </Text>
          ))}
        </View>

        <View>
          <Text style={styles.label}>Gjær</Text>
          {beer.ingredients.yeast.map((yeast: YeastIngredient, index: number) => (
            <Text key={index} style={[styles.ingredientItem, styles.ingredientList]}>
              • {yeast.type}, {yeast.temperature}°C
              {yeast.batchNumber ? ` (Batch: ${yeast.batchNumber})` : ''}
              {yeast.supplier ? ` - ${yeast.supplier}` : ''}
            </Text>
          ))}
        </View>
      </View>

      {beer.notes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bryggnotater</Text>
          {beer.notes.map((note, index) => (
            <Text key={index} style={[styles.noteItem, styles.ingredientList]}>
              • {formatDate(note.date)}: {note.text}
            </Text>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export function ExportModal({ isOpen, onClose, beers }: ExportModalProps) {
  const [selectedBeers, setSelectedBeers] = useState<Set<string>>(new Set());

  const toggleBeer = (beerId: string) => {
    const newSelected = new Set(selectedBeers);
    if (newSelected.has(beerId)) {
      newSelected.delete(beerId);
    } else {
      newSelected.add(beerId);
    }
    setSelectedBeers(newSelected);
  };

  const handleDownloadComplete = () => {
    // Close modal after starting download
    setTimeout(() => {
      onClose();
      setSelectedBeers(new Set());
    }, 100);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md bg-white rounded-xl w-full">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Eksporter Brygg
            </Dialog.Title>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {beers.map(beer => (
                <label key={beer.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedBeers.has(beer.id)}
                    onChange={() => toggleBeer(beer.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{beer.name}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {Array.from(selectedBeers).map(beerId => {
                const beer = beers.find(b => b.id === beerId);
                if (!beer) return null;
                
                return (
                  <PDFDownloadLink
                    key={beer.id}
                    document={<BeerReport beer={beer} />}
                    fileName={`${beer.name.replace(/\s+/g, '-')}-rapport.pdf`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleDownloadComplete}
                  >
                    {({ loading }) => (loading ? 'Laster...' : 'Last ned PDF')}
                  </PDFDownloadLink>
                );
              })}
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Lukk
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}