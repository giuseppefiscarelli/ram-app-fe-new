import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexTitleSubtitle,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-test-chart-b',
  templateUrl: './test-chart-b.component.html',
  styleUrls: ['./test-chart-b.component.scss']
})
export class TestChartBComponent implements OnInit {
  @ViewChild("chartB") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    const m3 = '3'
    this.chartOptions = {

      series: [
        {
          name: "M<sup>3</sup> ABETE",
          data: [  292.652,
            660.247,
            938.845,
            867.164,
            1084.071,
            702.862,
            525.377,
            577.645,
            741.417,
            998.753,
            1251.813,
            789.514]
        },
        {
          name: "M<sup>3</sup> OSB/COMP",
          data: [46.891,
            51.755,
            73.788,
            55.401,
            88.001,
            96.830,
            64.064,
            44.597,
            58.409,
            124.389,
            99.939,
            68.772
          ]
        },

      ],

      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        },

      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      title: {
        text: "Dettaglio produzione 2022",
        align: "left"
      },
      xaxis: {
        type: "category",
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
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }

    };
  }
  ngOnInit(): void {
  }

}
