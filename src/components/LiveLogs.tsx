import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

const LiveLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    const addLog = (level: LogEntry['level'], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const timestamp = new Date().toLocaleTimeString('ru-RU');
      
      setLogs(prev => [...prev.slice(-99), { timestamp, level, message }]);
    };

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('info', ...args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warn', ...args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', ...args);
    };

    (window as any).logSuccess = (...args: any[]) => {
      addLog('success', ...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (autoScroll && isOpen) {
      const logsContainer = document.getElementById('logs-container');
      if (logsContainer) {
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll, isOpen]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warn': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return 'Info';
      case 'warn': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'success': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full w-14 h-14 shadow-lg"
        title="Живые логи"
      >
        <Icon name={isOpen ? 'X' : 'Terminal'} size={24} />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[500px] max-w-[90vw] h-[400px] z-50 shadow-2xl flex flex-col">
          <div className="p-3 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Icon name="Terminal" size={18} className="text-gray-700" />
              <h3 className="font-semibold text-gray-900">Живые логи</h3>
              <span className="text-xs text-gray-500">({logs.length})</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoScroll(!autoScroll)}
                className="h-8 px-2"
                title={autoScroll ? 'Отключить автопрокрутку' : 'Включить автопрокрутку'}
              >
                <Icon name={autoScroll ? 'ChevronDown' : 'Pause'} size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLogs}
                className="h-8 px-2"
                title="Очистить логи"
              >
                <Icon name="Trash2" size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 px-2"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          <div 
            id="logs-container"
            className="flex-1 overflow-y-auto p-3 bg-gray-900 text-gray-100 font-mono text-xs"
          >
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Логи появятся здесь...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-2 flex items-start gap-2">
                  <span className="text-gray-500 flex-shrink-0">{log.timestamp}</span>
                  <Icon 
                    name={getLevelIcon(log.level)} 
                    size={14} 
                    className={`${getLevelColor(log.level)} flex-shrink-0 mt-0.5`}
                  />
                  <span className="flex-1 break-words">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default LiveLogs;
