import { clsx, type ClassValue } from "clsx"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { SidebarChatItem } from "@/store/reducers/aiSessionSlice"
import { AIChatSession } from "@/store/types/api"
import { logout } from "@/store/reducers/authSlice"
import { AppDispatch } from "@/store/store"
import localStorageManager from "@/utils/localStorage"
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const getErrorMessage = (error: any, fallback: string): string => {
  return error?.response?.data?.message || fallback;
};

export const onView = (fileUrl: string) => {
  window.open(fileUrl, '_blank')
}

export const onDownload = async (url: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = url.split('/').pop() || 'draft'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
    document.body.removeChild(a)
  } catch (error) {
    toast.error("Failed to download")
    console.error(error)
  }
}

export function groupChatsByDate(fetchedSessions: AIChatSession[]): SidebarChatItem[] {
  if (!fetchedSessions) return [];

  const sidebarItems: SidebarChatItem[] = [
    { section: "Today", items: [] },
    { section: "Yesterday", items: [] },
    { section: "Previous 7 Days", items: [] },
    { section: "Last 30 Days", items: [] },
    { section: "Older", items: [] },
  ];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  fetchedSessions.forEach(session => {
    const updated = new Date(session.updatedAt || '');

    if (updated >= today) {
      sidebarItems[0].items.push(session);
    } else if (updated >= yesterday) {
      sidebarItems[1].items.push(session);
    } else if (updated >= sevenDaysAgo) {
      sidebarItems[2].items.push(session);
    } else if (updated >= thirtyDaysAgo) {
      sidebarItems[3].items.push(session);
    } else {
      sidebarItems[4].items.push(session);
    }
  });

  // Sort each section's items by updatedAt descending
  sidebarItems.forEach(section => {
    section.items.sort((a, b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime());
  });

  // Remove empty sections 
  return sidebarItems.filter(section => section.items.length > 0);
}

export const formatFileType = (fileType: string): string => {
  const t = fileType.toLowerCase();

  if (t.includes('pdf')) return 'PDF';

  // Word Documents
  if (t.includes('vnd.openxmlformats-officedocument.wordprocessingml.document') || t.includes('docx')) return 'DOCX';
  if (t.includes('application/msword') || t.includes('msword') || t.includes('doc')) return 'DOC';

  // Excel Spreadsheets
  if (t.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet') || t.includes('xlsx')) return 'XLSX';
  if (t.includes('vnd.ms-excel') || t.includes('xls')) return 'XLS';

  // PowerPoint Presentations
  if (t.includes('vnd.openxmlformats-officedocument.presentationml.presentation') || t.includes('pptx')) return 'PPTX';
  if (t.includes('vnd.ms-powerpoint') || t.includes('ppt')) return 'PPT';

  // Text Files
  if (t.includes('plain') || t.includes('txt')) return 'TXT';

  // CSV
  if (t.includes('csv')) return 'CSV';

  // Rich Text Format
  if (t.includes('rtf')) return 'RTF';

  // Images
  if (t.includes('jpeg') || t.includes('jpg')) return 'JPG';
  if (t.includes('png')) return 'PNG';
  if (t.includes('gif')) return 'GIF';
  if (t.includes('bmp')) return 'BMP';
  if (t.includes('webp')) return 'WEBP';
  if (t.includes('svg')) return 'SVG';
  if (t.includes('tiff') || t.includes('tif')) return 'TIFF';
  if (t.includes('heic')) return 'HEIC';

  // Audio
  if (t.includes('mpeg') || t.includes('mp3')) return 'MP3';
  if (t.includes('wav')) return 'WAV';
  if (t.includes('ogg')) return 'OGG';
  if (t.includes('aac')) return 'AAC';
  if (t.includes('flac')) return 'FLAC';

  // Video
  if (t.includes('mp4')) return 'MP4';
  if (t.includes('quicktime') || t.includes('mov')) return 'MOV';
  if (t.includes('webm')) return 'WEBM';
  if (t.includes('avi')) return 'AVI';
  if (t.includes('mkv')) return 'MKV';

  // Archives
  if (t.includes('zip')) return 'ZIP';
  if (t.includes('rar')) return 'RAR';
  if (t.includes('7z')) return '7Z';
  if (t.includes('tar')) return 'TAR';
  if (t.includes('gz') || t.includes('gzip')) return 'GZ';

  // Code
  if (t.includes('javascript') || t.includes('.js')) return 'JS';
  if (t.includes('json')) return 'JSON';
  if (t.includes('typescript') || t.includes('.ts')) return 'TS';
  if (t.includes('html')) return 'HTML';
  if (t.includes('css')) return 'CSS';
  if (t.includes('xml')) return 'XML';
  if (t.includes('python') || t.includes('.py')) return 'PY';
  if (t.includes('java')) return 'JAVA';
  if (t.includes('c++') || t.includes('cpp')) return 'CPP';
  if (t.includes('csharp') || t.includes('cs')) return 'C#';

  // Fallback: clean up long MIME types
  if (t.startsWith('application/') || t.startsWith('text/') || t.startsWith('image/') || t.startsWith('audio/') || t.startsWith('video/')) {
    const lastSegment = t.split('.').pop() || t.split('/').pop();
    return lastSegment?.toUpperCase() || fileType;
  }

  return fileType;
};

export const enumToLabel = (enumValue: string) => {
  if (!enumValue) return '';
  return enumValue.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export const onLogout = (dispatch: AppDispatch, callback: () => void) => {
  dispatch(logout())
    .then(() => {
      callback();
      localStorageManager.clear();
    });
}

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Format as +92 XXX XXXXXXX
  if (digits.startsWith('92')) {
    const rest = digits.slice(2);
    if (rest.length <= 3) return `+92 ${rest}`;
    return `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
  } else if (digits.startsWith('0')) {
    const rest = digits.slice(1);
    if (rest.length <= 3) return `+92 ${rest}`;
    return `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
  }

  if (digits.length <= 3) return `+92 ${digits}`;
  return `+92 ${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
};

export const formattedPrice = (price: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
}

export const formatConsultationDate = (dateString: string | Date) => {
  if (dateString instanceof Date) {
    dateString = dateString.toISOString()
  }
  const date = parseISO(dateString)
  if (isToday(date)) {
    return `Today ${format(date, 'h:mm a')}`
  } else if (isTomorrow(date)) {
    return `Tomorrow ${format(date, 'h:mm a')}`
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`
  }
  return format(date, 'MMM dd, yyyy h:mm a')
}