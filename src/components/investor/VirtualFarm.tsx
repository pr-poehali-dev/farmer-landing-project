import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface FarmAsset {
  id: string;
  type: 'cow' | 'chicken' | 'crop' | 'tractor';
  name: string;
  income: number;
  quantity: number;
}

export function VirtualFarm({ investments }: { investments: any[] }) {
  const [farmAssets, setFarmAssets] = useState<FarmAsset[]>([]);

  useEffect(() => {
    const assets = investments.map(inv => ({
      id: inv.id,
      type: getAssetType(inv.amount),
      name: inv.farmer_name || 'Ферма',
      income: inv.expected_return || 0,
      quantity: Math.floor(inv.amount / 10000) || 1
    }));
    setFarmAssets(assets);
  }, [investments]);

  return (
    <div className="farm-container">
      <div className="farm-field" style={{
        backgroundImage: 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 50%)',
        minHeight: '500px',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '20px'
        }}>
          {farmAssets.map(asset => (
            <FarmAssetCard key={asset.id} asset={asset} />
          ))}
        </div>

        <Card className="mt-4 p-4 bg-white/90">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {farmAssets.reduce((sum, a) => sum + a.quantity, 0)}
              </div>
              <div className="text-sm text-gray-600">Всего активов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                ₽{farmAssets.reduce((sum, a) => sum + a.income, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Ожидаемый доход</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {investments.length}
              </div>
              <div className="text-sm text-gray-600">Ферм в портфеле</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FarmAssetCard({ asset }: { asset: FarmAsset }) {
  const emojis = {
    cow: '🐄',
    chicken: '🐔',
    crop: '🌾',
    tractor: '🚜'
  };

  return (
    <div 
      className="farm-asset"
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ fontSize: '48px' }}>
        {emojis[asset.type]}
      </div>
      {asset.quantity > 1 && (
        <div className="badge">×{asset.quantity}</div>
      )}
      <div className="text-xs mt-1 font-semibold">{asset.name}</div>
      <div className="text-xs text-green-600">
        +₽{asset.income.toLocaleString()}
      </div>
    </div>
  );
}

function getAssetType(amount: number): FarmAsset['type'] {
  if (amount < 50000) return 'chicken';
  if (amount < 150000) return 'crop';
  if (amount < 300000) return 'cow';
  return 'tractor';
}
