import { hexToRgb } from '@/models/common/color'
import dynamic from 'next/dynamic'
import { memo, useCallback } from 'react'
import { useTheme } from './page'

const ChartLib = dynamic(() => import('@/components/chart-lib'), {
  ssr: false,
})

export const Chart = memo(({ chartData, title, isUTC }: { chartData: any[], title?: string, isUTC?: boolean }) => {
  const theme = useTheme()

  const formatDate = useCallback((date: Date | string) => new Date(date).getTime() / 1000 - (new Date(date).getTimezoneOffset() * 60), [])

  return (
    <ChartLib
      from={chartData?.length ? formatDate(chartData[0].datetime) : undefined}
      to={chartData?.length ? formatDate(chartData[chartData.length - 1].datetime) : undefined}
      height={360}

      options={{
        alignLabels: true,
        layout: {
          fontSize: 12,
          fontFamily: 'Inter, Calibri, Arial',
          backgroundColor: theme.background.secondary,
          textColor: theme.foreground.secondary,
          borderColor: `rgba(${hexToRgb(theme.foreground.secondary)[0]}, ${hexToRgb(theme.foreground.secondary)[1]}, ${hexToRgb(theme.foreground.secondary)[2]}, 0.1)`,
        },
        timeScale: {
          timeVisible: true,
          borderColor: `rgba(${hexToRgb(theme.foreground.secondary)[0]}, ${hexToRgb(theme.foreground.secondary)[1]}, ${hexToRgb(theme.foreground.secondary)[2]}, 0.1)`,
        },
        grid: {
          horzLines: {
            color: `rgba(${hexToRgb(theme.foreground.secondary)[0]}, ${hexToRgb(theme.foreground.secondary)[1]}, ${hexToRgb(theme.foreground.secondary)[2]}, 0.1)`,
          },
          vertLines: {
            color: `rgba(${hexToRgb(theme.foreground.secondary)[0]}, ${hexToRgb(theme.foreground.secondary)[1]}, ${hexToRgb(theme.foreground.secondary)[2]}, 0.1)`,
          },
        },
        watermark: {
          color: `rgba(${hexToRgb(theme.foreground.secondary)[0]}, ${hexToRgb(theme.foreground.secondary)[1]}, ${hexToRgb(theme.foreground.secondary)[2]}, 0.4)`,
          visible: true,
          text: title,
          fontSize: 32,
          horzAlign: 'center',
          vertAlign: 'center',
        }
      }}
      areaSeries={[{
        legend: ' ',
        topcolor: 'rgba(33, 150, 243, 0.56)',
        bottomcolor: 'rgba(33, 150, 243, 0.04)',
        linecolor: 'rgba(33, 150, 243, 1)',
        data: chartData?.length ? chartData.map((x, idx) => ({
          id: idx,
          value: x.value,
          time: isUTC ? +x.datetime : formatDate(x.datetime),
        })) : []
      }]}
      autoWidth
    />
  )
})
