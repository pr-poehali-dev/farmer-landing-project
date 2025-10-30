import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Seller {
  id: number;
  company_name: string;
  payment_for_analytics: string;
  interested_in_contacts: boolean;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
  created_at: string;
}

const SellersTable = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: '',
    payment_for_analytics: '',
    interested_in_contacts: true,
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    description: ''
  });

  const API_URL = 'https://functions.poehali.dev/2aa973b1-8ae3-4b27-8c70-e3f4f54c4159';

  const fetchSellers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSellers(data);
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
    fetchSellers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingSeller ? 'PUT' : 'POST';
      const body = editingSeller 
        ? { ...formData, id: editingSeller.id }
        : formData;

      const response = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingSeller ? 'Продавец обновлен' : 'Продавец добавлен'
        });
        setDialogOpen(false);
        resetForm();
        fetchSellers();
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
    if (!confirm('Удалить продавца?')) return;

    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      toast({ title: 'Удалено' });
      fetchSellers();
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
      company_name: '',
      payment_for_analytics: '',
      interested_in_contacts: true,
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      description: ''
    });
    setEditingSeller(null);
  };

  const openEditDialog = (seller: Seller) => {
    setEditingSeller(seller);
    setFormData({
      company_name: seller.company_name,
      payment_for_analytics: seller.payment_for_analytics,
      interested_in_contacts: seller.interested_in_contacts,
      contact_person: seller.contact_person || '',
      contact_phone: seller.contact_phone || '',
      contact_email: seller.contact_email || '',
      description: seller.description || ''
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
          <Icon name="Store" size={28} className="text-orange-600" />
          Продавцы сельхозтоваров
        </h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Icon name="Plus" size={18} />
              Добавить продавца
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSeller ? 'Редактировать продавца' : 'Новый продавец'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="company_name">Название компании *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payment_for_analytics">Готовы платить за аналитику (₽) *</Label>
                  <Input
                    id="payment_for_analytics"
                    type="number"
                    value={formData.payment_for_analytics}
                    onChange={(e) => setFormData({ ...formData, payment_for_analytics: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interested_in_contacts"
                    checked={formData.interested_in_contacts}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, interested_in_contacts: checked as boolean })
                    }
                  />
                  <Label htmlFor="interested_in_contacts" className="cursor-pointer">
                    Заинтересован в контактах фермеров
                  </Label>
                </div>
                <div>
                  <Label htmlFor="contact_person">Контактное лицо</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
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
                  <Label htmlFor="description">Описание услуг</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Какие товары и услуги предлагаете"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingSeller ? 'Сохранить' : 'Добавить'}
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
              <TableHead>Компания</TableHead>
              <TableHead>Оплата за аналитику</TableHead>
              <TableHead>Нужны контакты</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.company_name}</TableCell>
                  <TableCell>{Number(seller.payment_for_analytics).toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell>
                    {seller.interested_in_contacts ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Icon name="Check" size={16} /> Да
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <Icon name="X" size={16} /> Нет
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {seller.contact_person && <div className="font-medium">{seller.contact_person}</div>}
                      {seller.contact_phone && <div>{seller.contact_phone}</div>}
                      {seller.contact_email && <div>{seller.contact_email}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(seller)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(seller.id)}
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

export default SellersTable;
