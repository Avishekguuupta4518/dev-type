import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Score } from '@/models/Score';

// All available themes with their colors
const themes: Record<
  string,
  {
    bg: string;
    bgSub: string;
    text: string;
    sub: string;
    main: string;
  }
> = {
  dark: {
    bg: '#323437',
    bgSub: '#2c2e31',
    text: '#d1d0c5',
    sub: '#646669',
    main: '#e2b714',
  },

  ocean: {
    bg: '#1a2634',
    bgSub: '#152028',
    text: '#c7d5e0',
    sub: '#5a7a8c',
    main: '#00b4d8',
  },

  forest: {
    bg: '#1e2d24',
    bgSub: '#172119',
    text: '#c9d1c8',
    sub: '#5a7a5a',
    main: '#4ade80',
  },

  dracula: {
    bg: '#282a36',
    bgSub: '#21222c',
    text: '#f8f8f2',
    sub: '#6272a4',
    main: '#bd93f9',
  },

  nord: {
    bg: '#2e3440',
    bgSub: '#242933',
    text: '#eceff4',
    sub: '#81a1c1',
    main: '#88c0d0',
  },

  github: {
    bg: '#0d1117',
    bgSub: '#161b22',
    text: '#c9d1d9',
    sub: '#8b949e',
    main: '#58a6ff',
  },

  tokyo: {
    bg: '#1a1b26',
    bgSub: '#16161e',
    text: '#c0caf5',
    sub: '#565f89',
    main: '#7aa2f7',
  },

  matrix: {
    bg: '#000000',
    bgSub: '#041404',
    text: '#00ff41',
    sub: '#008f11',
    main: '#00ff41',
  },

  cyberpunk: {
    bg: '#0f0f1a',
    bgSub: '#161629',
    text: '#f1f1f1',
    sub: '#7b7be0',
    main: '#ff00ff',
  },

  material: {
    bg: '#263238',
    bgSub: '#1e272c',
    text: '#eeffff',
    sub: '#546e7a',
    main: '#80cbc4',
  },

  neon: {
    bg: '#0a0a0a',
    bgSub: '#111111',
    text: '#ffffff',
    sub: '#888888',
    main: '#39ff14',
  },
};

// Convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 226, g: 183, b: 20 };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(req.url);
    const themeName = searchParams.get('theme') || 'dark';
    
    const colors = themes[themeName] || themes.dark;
    const rgb = hexToRgb(colors.main);
    
    const mongooseInstance = await dbConnect();
    const collection = mongooseInstance.connection.collection('users');
    let user = await collection.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      // Fallback to name search
      const decodedName = decodeURIComponent(username);
      user = await collection.findOne({ 
        name: { $regex: new RegExp(`^${decodedName}$`, 'i') } 
      });
    }

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const scores = await Score.find({ userId: user._id });

    // Calculate activity data
    const currentYear = new Date().getFullYear();
    const activityMap = new Map<string, number>();
    
    scores.forEach((score: { timestamp: Date }) => {
      const date = new Date(score.timestamp).toISOString().split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // Generate days
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    const days: { date: string; count: number; dayOfWeek: number; month: number }[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
        dayOfWeek: current.getDay(),
        month: current.getMonth(),
      });
      current.setDate(current.getDate() + 1);
    }

    // Group into weeks
    const weeks: { date: string; count: number; dayOfWeek: number; month: number }[][] = [];
    let currentWeek: typeof days = [];
    
    const firstDayOfWeek = days[0].dayOfWeek;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', count: -1, dayOfWeek: i, month: -1 });
    }
    
    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const maxCount = Math.max(...days.map(d => d.count), 1);
    const totalTests = scores.length;
    const activeDays = [...activityMap.values()].length;

    const getColor = (count: number): string => {
      if (count === -1) return 'transparent';
      if (count === 0) return colors.bgSub;
      const intensity = Math.min(count / Math.max(maxCount, 4), 1);
      if (intensity <= 0.25) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
      if (intensity <= 0.5) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`;
      if (intensity <= 0.75) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`;
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    };

    // Generate SVG - add extra width for legend
    const cellSize = 10;
    const cellGap = 2;
    const leftPadding = 25;
    const topPadding = 20;
    const rightPadding = 30; // Extra space for "More" text
    const width = leftPadding + weeks.length * (cellSize + cellGap) + rightPadding;
    const height = topPadding + 7 * (cellSize + cellGap) + 30;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${colors.bg}" rx="6"/>
  
  <!-- Title -->
  <text x="8" y="13" font-family="monospace" font-size="10" fill="${colors.text}">${user.name}'s ${currentYear} activity</text>
  <text x="${width - 8}" y="13" font-family="monospace" font-size="9" fill="${colors.sub}" text-anchor="end">${totalTests} tests · ${activeDays} days</text>
  
  <!-- Day labels -->
  <text x="6" y="${topPadding + 1 * (cellSize + cellGap) + 7}" font-family="monospace" font-size="8" fill="${colors.sub}">M</text>
  <text x="6" y="${topPadding + 3 * (cellSize + cellGap) + 7}" font-family="monospace" font-size="8" fill="${colors.sub}">W</text>
  <text x="6" y="${topPadding + 5 * (cellSize + cellGap) + 7}" font-family="monospace" font-size="8" fill="${colors.sub}">F</text>
`;

    // Generate cells
    weeks.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        const x = leftPadding + weekIndex * (cellSize + cellGap);
        const y = topPadding + dayIndex * (cellSize + cellGap);
        const color = getColor(day.count);
        if (color !== 'transparent') {
          svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"/>\n`;
        }
      });
    });

    // Legend - positioned at bottom right with proper spacing
    const legendY = height - 10;
    const legendStartX = width - 120;
    svg += `
  <text x="${legendStartX}" y="${legendY}" font-family="monospace" font-size="8" fill="${colors.sub}">Less</text>
  <rect x="${legendStartX + 22}" y="${legendY - 8}" width="10" height="10" fill="${colors.bgSub}" rx="2"/>
  <rect x="${legendStartX + 34}" y="${legendY - 8}" width="10" height="10" fill="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)" rx="2"/>
  <rect x="${legendStartX + 46}" y="${legendY - 8}" width="10" height="10" fill="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)" rx="2"/>
  <rect x="${legendStartX + 58}" y="${legendY - 8}" width="10" height="10" fill="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)" rx="2"/>
  <rect x="${legendStartX + 70}" y="${legendY - 8}" width="10" height="10" fill="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)" rx="2"/>
  <text x="${legendStartX + 85}" y="${legendY}" font-family="monospace" font-size="8" fill="${colors.sub}">More</text>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating embed:', error);
    return new NextResponse('Error generating embed', { status: 500 });
  }
}
