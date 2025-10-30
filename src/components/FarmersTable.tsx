import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Farmer {
  id: number;
  name: string;
  region: string;
  equity_offer: string;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
  created_at: string;
}

const FarmersTable = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    region: '',
    equity_offer: '',
    contact_phone: '',
    contact_email: '',
    description: ''
  });

  const API_URL = 'https://functions.poehali.dev/f2f79627-2956-4166-8ffc-58fe95ec7947';

  const fetchFarmers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFarmers(data);
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
    fetchFarmers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingFarmer ? 'PUT' : 'POST';
      const body = editingFarmer 
        ? { ...formData, id: editingFarmer.id }
        : formData;

      const response = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingFarmer ? 'Фермер обновлен' : 'Фермер добавлен'
        });
        setDialogOpen(false);
        resetForm();
        fetchFarmers();
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
    if (!confirm('Удалить фермера?')) return;

    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      toast({ title: 'Удалено' });
      fetchFarmers();
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
      region: '',
      equity_offer: '',
      contact_phone: '',
      contact_email: '',
      description: ''
    });
    setEditingFarmer(null);
  };

  const openEditDialog = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      region: farmer.region,
      equity_offer: farmer.equity_offer,
      contact_phone: farmer.contact_phone || '',
      contact_email: farmer.contact_email || '',
      description: farmer.description || ''
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
          <Icon name="Tractor" size={28} className="text-green-600" />
          Фермеры
        </h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Icon name="Plus" size={18} />
              Добавить фермера
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFarmer ? 'Редактировать фермера' : 'Новый фермер'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Название хозяйства *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Регион *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="equity_offer">Предложение доли инвесторам *</Label>
                  <Textarea
                    id="equity_offer"
                    value={formData.equity_offer}
                    onChange={(e) => setFormData({ ...formData, equity_offer: e.target.value })}
                    required
                    placeholder="Например: 10% доли в молочной ферме за 5 млн рублей"
                  />
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
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingFarmer ? 'Сохранить' : 'Добавить'}
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
              <TableHead>Название</TableHead>
              <TableHead>Регион</TableHead>
              <TableHead>Предложение доли</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              farmers.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell className="font-medium">{farmer.name}</TableCell>
                  <TableCell>{farmer.region}</TableCell>
                  <TableCell className="max-w-xs truncate">{farmer.equity_offer}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {farmer.contact_phone && <div>{farmer.contact_phone}</div>}
                      {farmer.contact_email && <div>{farmer.contact_email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(farmer)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(farmer.id)}
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

export default FarmersTable;
