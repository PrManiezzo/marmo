import React, { useState } from 'react';
import { Package } from 'lucide-react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { useStore } from '../../store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

interface PieceEntry {
  id: string;
  width: number;
  length: number;
  thickness: number;
}

export default function PiecesEntryModal({ isOpen, onClose, productId }: Props) {
  const { products, addProductPieces } = useStore();
  const [pieces, setPieces] = useState<PieceEntry[]>([{
    id: Date.now().toString(),
    width: 0,
    length: 0,
    thickness: 0
  }]);
  const [error, setError] = useState('');

  const product = products.find(p => p.id === productId);

  const handleAddPiece = () => {
    setPieces([...pieces, {
      id: Date.now().toString(),
      width: 0,
      length: 0,
      thickness: 0
    }]);
  };

  const handleRemovePiece = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  const handlePieceChange = (id: string, field: keyof PieceEntry, value: number) => {
    setPieces(pieces.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const invalidPieces = pieces.some(p => 
      p.width <= 0 || p.length <= 0 || p.thickness <= 0
    );

    if (invalidPieces) {
      setError('Todas as dimensões devem ser maiores que zero');
      return;
    }

    addProductPieces(productId, pieces);
    onClose();
    setPieces([{
      id: Date.now().toString(),
      width: 0,
      length: 0,
      thickness: 0
    }]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Entrada de Peças - ${product?.name || ''}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {pieces.map((piece, index) => (
            <div key={piece.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Peça {index + 1}</h4>
                {pieces.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemovePiece(piece.id)}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Largura (m)"
                  type="number"
                  step="0.01"
                  value={piece.width || ''}
                  onChange={(e) => handlePieceChange(piece.id, 'width', parseFloat(e.target.value))}
                  required
                />
                <Input
                  label="Comprimento (m)"
                  type="number"
                  step="0.01"
                  value={piece.length || ''}
                  onChange={(e) => handlePieceChange(piece.id, 'length', parseFloat(e.target.value))}
                  required
                />
                <Input
                  label="Espessura (m)"
                  type="number"
                  step="0.001"
                  value={piece.thickness || ''}
                  onChange={(e) => handlePieceChange(piece.id, 'thickness', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAddPiece}
          className="w-full"
        >
          Adicionar Nova Peça
        </Button>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" icon={Package}>
            Confirmar Entrada
          </Button>
        </div>
      </form>
    </Modal>
  );
}