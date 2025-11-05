import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Investment {
  id: number;
  proposal_id: number;
  asset?: {
    type: 'animal' | 'crop' | 'beehive';
    livestock_type?: string;
    crop_type?: string;
    name?: string;
  };
  farmer_name?: string;
  amount: number;
  shares: number;
}

interface FarmPlotProps {
  type: 'livestock' | 'crops' | 'beehives' | 'empty';
  image: string;
  title: string;
  items: Investment[];
  onClick: () => void;
}

function FarmPlot({ type, image, title, items, onClick }: FarmPlotProps) {
  const hasItems = items.length > 0;
  
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '3px solid #fff'
      }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all group-hover:brightness-110"
        style={{ 
          backgroundImage: `url(${image})`,
          filter: hasItems ? 'brightness(1)' : 'brightness(0.7) grayscale(0.3)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg drop-shadow-lg">{title}</h3>
            {hasItems ? (
              <p className="text-sm opacity-90 drop-shadow">
                {items.length} {items.length === 1 ? 'инвестиция' : 'инвестиций'}
              </p>
            ) : (
              <p className="text-sm opacity-90 drop-shadow">Пусто</p>
            )}
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            {hasItems ? (
              <div className="text-2xl">{items.length}</div>
            ) : (
              <Icon name="Plus" size={24} className="opacity-80" />
            )}
          </div>
        </div>
      </div>
      
      {!hasItems && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-semibold text-sm">
            Нажмите чтобы добавить
          </div>
        </div>
      )}
    </div>
  );
}

export function VirtualFarm({ investments }: { investments: Investment[] }) {
  const navigate = useNavigate();
  const [selectedPlot, setSelectedPlot] = useState<'livestock' | 'crops' | 'beehives' | null>(null);

  const livestockInvestments = investments.filter(inv => 
    inv.asset?.type === 'animal'
  );
  
  const cropInvestments = investments.filter(inv => 
    inv.asset?.type === 'crop'
  );
  
  const beehiveInvestments = investments.filter(inv => 
    inv.asset?.type === 'beehive'
  );

  const handlePlotClick = (plotType: 'livestock' | 'crops' | 'beehives') => {
    setSelectedPlot(plotType);
  };

  const handleGoToMarket = () => {
    setSelectedPlot(null);
    navigate('/dashboard/investor', { state: { scrollToTab: 'market' } });
  };

  const getPlotTitle = (type: 'livestock' | 'crops' | 'beehives') => {
    switch(type) {
      case 'livestock': return 'Животные';
      case 'crops': return 'Культуры';
      case 'beehives': return 'Пасека';
    }
  };

  const getPlotItems = (type: 'livestock' | 'crops' | 'beehives') => {
    switch(type) {
      case 'livestock': return livestockInvestments;
      case 'crops': return cropInvestments;
      case 'beehives': return beehiveInvestments;
    }
  };

  const renderDialogContent = () => {
    if (!selectedPlot) return null;
    
    const items = getPlotItems(selectedPlot);
    const hasItems = items.length > 0;

    if (!hasItems) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              У вас пока нет {selectedPlot === 'livestock' ? 'животных' : selectedPlot === 'crops' ? 'культур' : 'ульев'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-8 text-center">
            <div className="text-6xl mb-4">
              {selectedPlot === 'livestock' && '🐄'}
              {selectedPlot === 'crops' && '🌾'}
              {selectedPlot === 'beehives' && '🐝'}
            </div>
            
            <p className="text-gray-600 mb-6">
              Давайте добавим! Перейдём на маркет предложений и найдём что-то интересное.
            </p>
            
            <Button 
              onClick={handleGoToMarket}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Icon name="ShoppingCart" className="mr-2" size={20} />
              Перейти на маркет
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {selectedPlot === 'livestock' && '🐄 Мои животные'}
            {selectedPlot === 'crops' && '🌾 Мои культуры'}
            {selectedPlot === 'beehives' && '🐝 Моя пасека'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((inv, idx) => (
            <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">
                    {inv.asset?.name || 'Без названия'}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Фермер: {inv.farmer_name || 'Неизвестно'}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Долей:</span>{' '}
                      <span className="font-semibold">{inv.shares}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Сумма:</span>{' '}
                      <span className="font-semibold text-green-600">
                        ₽{inv.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-4xl ml-4">
                  {selectedPlot === 'livestock' && '🐄'}
                  {selectedPlot === 'crops' && '🌾'}
                  {selectedPlot === 'beehives' && '🐝'}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={handleGoToMarket}
            variant="outline"
            className="w-full"
          >
            <Icon name="Plus" className="mr-2" size={20} />
            Добавить ещё
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #c8e6c9 100%)',
          padding: '24px',
          minHeight: '600px'
        }}
      >
        <div className="absolute top-4 left-4 right-4">
          <Card className="p-4 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Icon name="Sprout" className="text-green-600" size={28} />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Моя виртуальная ферма
                </h2>
                <p className="text-sm text-gray-600">
                  Нажмите на участок чтобы посмотреть детали
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ marginTop: '120px' }}
        >
          <FarmPlot
            type="livestock"
            image="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=600&fit=crop"
            title="Животные"
            items={livestockInvestments}
            onClick={() => handlePlotClick('livestock')}
          />
          
          <FarmPlot
            type="crops"
            image="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop"
            title="Культуры"
            items={cropInvestments}
            onClick={() => handlePlotClick('crops')}
          />
          
          <FarmPlot
            type="beehives"
            image="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop"
            title="Пасека"
            items={beehiveInvestments}
            onClick={() => handlePlotClick('beehives')}
          />
        </div>

        <div className="mt-8">
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {investments.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Всего инвестиций
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-green-600">
                  ₽{investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Общая сумма
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {new Set(investments.map(i => i.farmer_name)).size}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Фермеров в портфеле
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={selectedPlot !== null} onOpenChange={() => setSelectedPlot(null)}>
        <DialogContent className="max-w-2xl">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
