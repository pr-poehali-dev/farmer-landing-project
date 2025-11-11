import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface AiAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  analysis: string;
  loading: boolean;
}

export default function AiAnalysisModal({ open, onClose, analysis, loading }: AiAnalysisModalProps) {
  const [parsedAnalysis, setParsedAnalysis] = useState<any>(null);

  useEffect(() => {
    if (analysis) {
      try {
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setParsedAnalysis(JSON.parse(jsonMatch[0]));
        } else {
          setParsedAnalysis({ raw: analysis });
        }
      } catch {
        setParsedAnalysis({ raw: analysis });
      }
    }
  }, [analysis]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Brain" size={28} className="text-purple-600" />
            ИИ-анализ хозяйства
          </DialogTitle>
          <DialogDescription>
            Персонализированные рекомендации на основе данных вашего хозяйства
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin">
              <Icon name="Loader2" size={48} className="text-purple-600" />
            </div>
            <p className="text-muted-foreground">Анализирую данные хозяйства...</p>
          </div>
        ) : parsedAnalysis ? (
          <div className="space-y-6">
            {parsedAnalysis.raw ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {parsedAnalysis.raw}
                </div>
              </div>
            ) : (
              <>
                {parsedAnalysis.productivity && (
                  <Section
                    icon="TrendingUp"
                    title="Продуктивность"
                    content={parsedAnalysis.productivity}
                    color="text-green-600"
                  />
                )}

                {parsedAnalysis.technology && (
                  <Section
                    icon="Cpu"
                    title="Технологичность"
                    content={parsedAnalysis.technology}
                    color="text-blue-600"
                  />
                )}

                {parsedAnalysis.investments && (
                  <Section
                    icon="TrendingUp"
                    title="Инвестиционная привлекательность"
                    content={parsedAnalysis.investments}
                    color="text-purple-600"
                  />
                )}

                {parsedAnalysis.risks && (
                  <Section
                    icon="AlertTriangle"
                    title="Риски"
                    content={parsedAnalysis.risks}
                    color="text-orange-600"
                  />
                )}

                {parsedAnalysis.recommendations && (
                  <Section
                    icon="Lightbulb"
                    title="Рекомендации"
                    content={parsedAnalysis.recommendations}
                    color="text-yellow-600"
                  />
                )}
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
              <Icon name="Sparkles" size={14} />
              <span>Анализ выполнен с помощью GigaChat AI</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Нет данных для отображения
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SectionProps {
  icon: string;
  title: string;
  content: string | string[];
  color: string;
}

function Section({ icon, title, content, color }: SectionProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Icon name={icon} size={20} className={color} />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      {Array.isArray(content) ? (
        <ul className="space-y-2 list-disc list-inside">
          {content.map((item, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
}
