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
  selector: 'app-test-chart-c',
  templateUrl: './test-chart-c.component.html',
  styleUrls: ['./test-chart-c.component.scss']
})
export class TestChartCComponent implements OnInit {
  @ViewChild("chartC") chart: ChartComponent;
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
          354.797,
          712.002,
          1012.633,
          922.565,
          1172.072,
          806.680,
          592.387,
          678.127,
          763.340,
          1118.318,
          1145.792,
          894.447
         ]
        },
        {
          name: "2021",
          data:[
            167.469,
            290.966,
            352.263,
            283.743,
            317.031,
            486.832,
            450.684,
            202.671,
            327.842,
            553.883,
            446.746,
            367.128,

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
        text: "Produzione m3",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val
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
