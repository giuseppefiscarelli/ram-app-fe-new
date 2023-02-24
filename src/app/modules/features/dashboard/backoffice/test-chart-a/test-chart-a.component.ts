import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-test-chart-a',
  templateUrl: './test-chart-a.component.html',
  styleUrls: ['./test-chart-a.component.scss']
})

export class TestChartAComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  constructor() {
    const formatter = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    this.chartOptions = {
      series: [
        {
          name: "2022",
         data:[
          558420.40 ,
          772228.76 ,
          1040647.27 ,
          888789.21 ,
          1144482.74 ,
          899174.83 ,
          876164.14 ,
          592941.35 ,
          935425.65 ,
          1054824.40 ,
          1093049.98 ,
          889815.41 ,
         ]
        },
        {
          name: "2021",
          data:[
            842952.08 ,
            480838.69 ,
            775988.78 ,
            514030.33 ,
            486654.12 ,
            433390.38 ,
            565584.43 ,
            349941.15 ,
            545407.26 ,
            615741.90 ,
            695876.10 ,
            516020.50
          ]
         },


      ],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "Fatturato",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            formatter.format(opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]) +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: [
          "Gennaio",
          "Febbraio",
          "Marzo",
          "Aprile",
          "Maggio",
          "Giugno",
          "Luglio",
          "Agosto",
          "Settembre",
          "Ottobre",
          "Novembre",
          "Dicembre"
        ]
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },

        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }

  ngOnInit(): void {
  }

}
