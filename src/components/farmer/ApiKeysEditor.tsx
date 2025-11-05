import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  name: string;
  displayName: string;
  description: string;
  value: string;
  placeholder: string;
}

const API_KEYS: ApiKey[] = [
  {
    name: 'TELEGRAM_BOT_TOKEN',
    displayName: 'Telegram Bot Token',
    description: 'Токен бота для авторизации через Telegram',
    value: '',
    placeholder: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'
  },
  {
    name: 'TELEGRAM_BOT_USERNAME',
    displayName: 'Telegram Bot Username',
    description: 'Имя бота (без @)',
    value: '',
    placeholder: 'mybot'
  },
  {
    name: 'VK_CLIENT_ID',
    displayName: 'VK Client ID',
    description: 'ID приложения ВКонтакте',
    value: '',
    placeholder: '51234567'
  },
  {
    name: 'VK_CLIENT_SECRET',
    displayName: 'VK Client Secret',
    description: 'Защищённый ключ приложения ВКонтакте',
    value: '',
    placeholder: 'AbCdEfGhIjKlMnOp'
  },
  {
    name: 'YANDEX_CLIENT_ID',
    displayName: 'Yandex Client ID',
    description: 'Client ID приложения Яндекс ID',
    value: '',
    placeholder: 'a1b2c3d4e5f6g7h8i9j0'
  },
  {
    name: 'YANDEX_CLIENT_SECRET',
    displayName: 'Yandex Client Secret',
    description: 'Client Secret приложения Яндекс ID',
    value: '',
    placeholder: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'
  }
];

export default function ApiKeysEditor() {
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys);
        setKeys(prev => prev.map(key => ({
          ...key,
          value: parsed[key.name] || ''
        })));
      } catch (e) {
        console.error('Failed to parse saved keys', e);
      }
    }
  }, []);

  const handleSave = (keyName: string, value: string) => {
    const updatedKeys = keys.map(k => 
      k.name === keyName ? { ...k, value } : k
    );
    setKeys(updatedKeys);

    const keysObject = updatedKeys.reduce((acc, k) => ({
      ...acc,
      [k.name]: k.value
    }), {});

    localStorage.setItem('api_keys', JSON.stringify(keysObject));
    setEditingKey(null);

    toast({
      title: 'Ключ сохранён',
      description: `${keys.find(k => k.name === keyName)?.displayName} успешно обновлён`
    });
  };

  const handleEdit = (keyName: string) => {
    setEditingKey(keyName);
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Key" size={24} />
            API ключи для авторизации
          </CardTitle>
          <CardDescription>
            Управляйте ключами для входа через Telegram, VK и Яндекс
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {keys.map((key) => (
            <div key={key.name} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Label className="text-base font-semibold">{key.displayName}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{key.description}</p>
                </div>
                {editingKey !== key.name && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(key.name)}
                  >
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                )}
              </div>

              {editingKey === key.name ? (
                <div className="space-y-3">
                  <Input
                    type="text"
                    defaultValue={key.value}
                    placeholder={key.placeholder}
                    id={`input-${key.name}`}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const input = document.getElementById(`input-${key.name}`) as HTMLInputElement;
                        handleSave(key.name, input.value);
                      }}
                      size="sm"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      size="sm"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  {key.value ? (
                    <>
                      <Icon name="CheckCircle2" size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">Настроен</span>
                      <span className="text-muted-foreground ml-2 font-mono">
                        {key.value.substring(0, 10)}...
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon name="AlertCircle" size={16} className="text-amber-600" />
                      <span className="text-amber-600 font-medium">Не настроен</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="Info" size={20} />
            Как получить ключи?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Telegram Bot:</h4>
            <p className="text-muted-foreground">
              1. Найдите @BotFather в Telegram<br />
              2. Создайте бота командой /newbot<br />
              3. Скопируйте токен и имя бота
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">VKontakte:</h4>
            <p className="text-muted-foreground">
              Перейдите на <a href="https://vk.com/apps?act=manage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vk.com/apps?act=manage</a>, создайте приложение и скопируйте ID и защищённый ключ
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Яндекс ID:</h4>
            <p className="text-muted-foreground">
              Перейдите на <a href="https://oauth.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">oauth.yandex.ru</a>, создайте приложение и скопируйте Client ID и Client Secret
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
