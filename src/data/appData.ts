export interface AppItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  message: string;
}

export const appData: AppItem[] = [
  {
    id: '1',
    name: 'Calls',
    icon: '📞',
    color: '#34C759',
    message: 'Make calls from Here',
  },
  {
    id: '2',
    name: 'Camera',
    icon: '📷',
    color: '#8E8E93',
    message: 'Welcome to the camera app',
  },
  {
    id: '3',
    name: 'Messages',
    icon: '💬',
    color: '#34C759',
    message: 'Welcome to your Messages',
  },
  {
    id: '4',
    name: 'Music',
    icon: '🎵',
    color: '#FF3B30',
    message: 'Welcome to the Music Selection Screen',
  },
  {
    id: '5',
    name: 'Photos',
    icon: '🖼️',
    color: '#FF9500',
    message: 'Welcome to the Photos Screen',
  },
];

