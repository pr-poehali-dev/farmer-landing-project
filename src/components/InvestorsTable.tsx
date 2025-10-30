import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Investor {
  id: number;
  name: string;
  investment_amount: string;
  desired_return_type: string;
  contact_phone?: string;
  contact_email?: string;
  additional_notes?: string;
  created_at: string;
}

const InvestorsTable = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    investment_amount: '',
    desired_return_type: 'product',
    contact_phone: '',
    contact_email: '',
    additional_notes: ''
  });

  const API_URL = 'https://functions.poehali.dev/30d55d3c-842e-4719-b0e7-16cc84d86abd';

  const returnTypeLabels: Record<string, string> = {
    product: 'Продукт',
    money: 'Деньги',
    animal_observation: 'Наблюдение за животным'
  };

  const fetchInvestors = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setInvestors(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingInvestor ? 'PUT' : 'POST';
      const body = editingInvestor 
        ? { ...formData, id: editingInvestor.id }
        : formData;

      const response = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingInvestor ? 'Инвестор обновлен' : 'Инвестор добавлен'
        });
        setDialogOpen(false);
        resetForm();
        fetchInvestors();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить инвестора?')) return;

    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      toast({ title: 'Удалено' });
      fetchInvestors();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      investment_amount: '',
      desired_return_type: 'product',
      contact_phone: '',
      contact_email: '',
      additional_notes: ''
    });
    setEditingInvestor(null);
  };

  const openEditDialog = (investor: Investor) => {
    setEditingInvestor(investor);
    setFormData({
      name: investor.name,
      investment_amount: investor.investment_amount,
      desired_return_type: investor.desired_return_type,
      contact_phone: investor.contact_phone || '',
      contact_email: investor.contact_email || '',
      additional_notes: investor.additional_notes || ''
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="TrendingUp" size={28} className="text-blue-600" />
          Инвесторы
        </h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Icon name="Plus" size={18} />
              Добавить инвестора
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvestor ? 'Редактировать инвестора' : 'Новый инвестор'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="investment_amount">Сумма инвестиций (₽) *</Label>
                  <Input
                    id="investment_amount"
                    type="number"
                    value={formData.investment_amount}
                    onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="desired_return_type">Желаемая отдача *</Label>
                  <Select
                    value={formData.desired_return_type}
                    onValueChange={(value) => setFormData({ ...formData, desired_return_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Продукт</SelectItem>
                      <SelectItem value="money">Деньги</SelectItem>
                      <SelectItem value="animal_observation">Наблюдение за животным</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_phone">Телефон</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_notes">Дополнительные заметки</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingInvestor ? 'Сохранить' : 'Добавить'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Сумма инвестиций</TableHead>
              <TableHead>Желаемая отдача</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              investors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>{Number(investor.investment_amount).toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell>{returnTypeLabels[investor.desired_return_type]}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {investor.contact_phone && <div>{investor.contact_phone}</div>}
                      {investor.contact_email && <div>{investor.contact_email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(investor)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(investor.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InvestorsTable;
