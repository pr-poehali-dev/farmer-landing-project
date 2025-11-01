import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Proposal {
  id: number;
  description: string;
  price: number;
  shares: number;
  type: string;
  photo_url: string;
  farmer_name: string;
  farm_name: string;
  region: string;
  vk_link: string;
  investors_count: number;
}

interface ProposalsSectionProps {
  proposals: Proposal[];
}

const ProposalsSection = ({ proposals }: ProposalsSectionProps) => {
  const navigate = useNavigate();

  if (proposals.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Живые предложения от фермеров
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {proposals.slice(0, 6).map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {proposal.photo_url && (
                <img 
                  src={proposal.photo_url} 
                  alt={proposal.description}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="MapPin" size={16} className="text-farmer-orange" />
                  <span className="text-sm text-gray-600">{proposal.region}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{proposal.description}</h3>
                <p className="text-gray-600 mb-4">
                  <strong>Ферма:</strong> {proposal.farm_name}<br />
                  <strong>Фермер:</strong> {proposal.farmer_name}
                </p>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-700">
                  <span>Цена: <strong className="text-farmer-green">{proposal.price} ₽</strong></span>
                  <span>Доли: <strong>{proposal.shares}</strong></span>
                </div>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Icon name="Users" size={16} className="text-farmer-green" />
                  <span>{proposal.investors_count} инвесторов</span>
                </div>
                <Button
                  onClick={() => navigate('/register?role=investor')}
                  className="w-full bg-farmer-green hover:bg-farmer-green-dark text-white"
                >
                  Инвестировать
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {proposals.length > 6 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/register?role=investor')}
              variant="outline"
              className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
            >
              Посмотреть все предложения
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProposalsSection;
