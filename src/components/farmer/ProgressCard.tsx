import { Card } from '@/components/ui/card';

interface Props {
  progress: number;
}

export default function ProgressCard({ progress }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Диагностика хозяйства</h2>
          <p className="text-sm text-gray-600">Расскажи о своей ферме — мы подберём решения</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{progress}%</div>
          <div className="text-xs text-gray-500">заполнено</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
}
