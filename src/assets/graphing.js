import Chart from 'chart.js'
import {percent, commas} from '../assets/utils.js'

const globalOptions = {
  deferred: {
    enabled: true
  },
  maintainAspectRatio: true,
  responsive: true,
  title: {
    display: true
  },
  tooltips: {
    display: true,
    displayColors: false,
    callbacks: {
      title: function () {
        return ''
      }
    }
  },
  animation: {
    onComplete: function () {
      // drawComplete = true
    }
  },
  legend: {
    display: false,
    position: 'right'
  },
  legendCallback: function (chart) {
    var legend = '<ul class="legend-ul">'
    for (var i = 0; i < chart.data.datasets.length; i++) {
      let data = chart.data.datasets[i]
      var color = chart.config.options.legend.labels.fontColor
      legend += '<li style="color:' + color + '">'

      legend += '<div class="legend-click" style="background-color:' + data.backgroundColor + '">'
      legend += '</div>'

      legend += chart.data.datasets[i].label

      legend += '</li>'
    }
    legend += '</ul>'
    return legend
  },
  defaultFontFamily: 'Helvetica',
  yAxes: {
    display: true
  },
  xAxes: {
    display: true
  }
}
Chart.defaults.global = MergeRecursive(Chart.defaults.global, globalOptions)
let charts = function (city) {
  return {
    'urban_extent_composition_stacked_bar': {
      labels: [city.City.t1.substr(0, 4), city.City.t2.substr(0, 4), city.City.t2b.substr(0, 4), city.City.t3.substr(0, 4)],
      datasets: [
        {
          backgroundColor: 'rgba(52,22,186,1)',
          borderWidth: 0,
          label: ['Urbano'],
          data: [
            city.DataSet.urban_extent_composition_urban_t1,
            city.DataSet.urban_extent_composition_urban_t2,
            city.DataSet.urban_extent_composition_urban_t2b,
            city.DataSet.urban_extent_composition_urban_t3
          ]
        },
        {
          backgroundColor: 'rgba(194,121,159,1)',
          borderWidth: 0,
          label: ['Suburbano'],
          data: [
            city.DataSet.urban_extent_composition_suburban_t1,
            city.DataSet.urban_extent_composition_suburban_t2,
            city.DataSet.urban_extent_composition_suburban_t2b,
            city.DataSet.urban_extent_composition_suburban_t3
          ]
        },
        {
          backgroundColor: 'rgba(0,0,0,1)',
          borderWidth: 0,
          label: ['Rural Construido'],
          data: [
            city.DataSet.urban_extent_composition_rural_t1,
            city.DataSet.urban_extent_composition_rural_t2,
            city.DataSet.urban_extent_composition_rural_t2b,
            city.DataSet.urban_extent_composition_rural_t3
          ]
        },
        {
          backgroundColor: 'rgba(247,245,80,1)',
          borderWidth: 0,
          label: ['Espacio Abierto Urbanizado'],
          data: [
            city.DataSet.urban_extent_composition_open_t1,
            city.DataSet.urban_extent_composition_open_t2,
            city.DataSet.urban_extent_composition_open_t2b,
            city.DataSet.urban_extent_composition_open_t3
          ]
        }
      ]
    },
    'roads_width_stacked_bar': {
      labels: ['Pre 1990', '1990-2015'],
      datasets: [
        {
          backgroundColor: '#889A9A',
          borderWidth: 0,
          label: '<4m',
          data: [city.DataSet.roads_width_under_4m_pre_1990 * 100,
            city.DataSet.roads_width_under_4m_1990_2015 * 100 ]
        },
        {
          backgroundColor: '#93AFA9',
          borderWidth: 0,
          label: '4-8m',
          data: [city.DataSet.roads_width_4_8m_pre_1990 * 100,
            city.DataSet.roads_width_4_8m_1990_2015 * 100 ]
        },
        {
          backgroundColor: '#9FC3B5',
          borderWidth: 0,
          label: '8-12m',
          data: [city.DataSet.roads_width_8_12m_pre_1990 * 100,
            city.DataSet.roads_width_8_12m_1990_2015 * 100 ]
        },
        {
          backgroundColor: '#AED7C0',
          borderWidth: 0,
          label: '12-16m',
          data: [city.DataSet.roads_width_12_16m_pre_1990 * 100,
            city.DataSet.roads_width_12_16m_1990_2015 * 100 ]
        },
        {
          backgroundColor: '#BFECCA',
          borderWidth: 0,
          label: '>16m',
          data: [city.DataSet.roads_width_over_16m_pre_1990 * 100,
            city.DataSet.roads_width_over_16m_1990_2015 * 100 ]
        }
      ]
    },
    'arterial_roads': {
      labels: [
        ['Portoviejo'],
        ['Países Menos', 'Desarrollados'],
        ['Mundo']
      ],
      datasets: [
        {
          label: 'Densidad de las todas Vías',
          suffix: '_all_',
          backgroundColor: '#CEADA9',
          borderWidth: 0
        }
      ]
    },
    'arterial_roads_distance': {
      labels: [
        ['Portoviejo'],
        ['Países Menos', 'Desarrollados'],
        ['Mundo']
      ],
      datasets: [
        {
          label: 'Ancho',
          suffix: '_wide_',
          backgroundColor: '#F1E0DE',
          borderWidth: 0
        },
        {
          label: 'Todas',
          suffix: '_all_',
          backgroundColor: '#CEADA9',
          borderWidth: 0
        }
      ]
    },
    'blocks_and_plots_composition_special_stacked': {
      labels: [
        ['Portoviejo'],
        ['Países Menos', 'Desarrollados'],
        ['Mundo']
      ],
      datasets: [
        {
          suffix: '_atomistic_',
          bgColor: 'rgba(202,145,121,1)',
          label: 'Asentamientos Atomísticos'
        },
        {
          suffix: '_informal_',
          bgColor: 'rgba(197,97,77,1)',
          label: 'Subdivisiones Informales'
        },
        {
          suffix: '_formal_',
          bgColor: 'rgba(164,53,43,1)',
          label: 'Subdivisiones Formales'
        },
        {
          suffix: '_housing_',
          bgColor: 'rgba(126,8,18,1)',
          label: 'Proyectos de Vivienda'
        }
      ]
    }
  }
}

export var returnSpecialStacked = function (prefix, city, laterYear = true) {
  var field = prefix.replace('_special_stacked', '')

  var data1990 = {
    labels: charts(city)[prefix].labels,
    datasets: []
  }
  var data2015 = {
    labels: charts(city)[prefix].labels,
    datasets: []
  }

  // $(charts[prefix].datasets).each(function(){
  charts(city)[prefix].datasets.forEach(function (dataset) {
    var data = {
      backgroundColor: dataset.bgColor,
      borderWidth: 0,
      label: dataset.label,
      data: [city.DataSet[field + dataset.suffix + 'pre_1990'], city.Region.DataSet[field + dataset.suffix + 'pre_1990'], city.World.DataSet[field + dataset.suffix + 'pre_1990']]
    }
    data1990.datasets.push(JSON.parse(JSON.stringify(data)))
    data.data = [city.DataSet[field + dataset.suffix + '1990_2015'], city.Region.DataSet[field + dataset.suffix + '1990_2015'], city.World.DataSet[field + dataset.suffix + '1990_2015']]
    data2015.datasets.push(JSON.parse(JSON.stringify(data)))
  })
  return laterYear ? data2015 : data1990
}

export var makeSpecialStacked = function (prefix, city, title = '', laterYear = true) {
  var ctx = document.getElementById(prefix)

  return new Chart(ctx, {
    type: 'horizontalBar',
    data: returnSpecialStacked(prefix, city, laterYear),
    options: {
      legend: {
        labels: {
          fontColor: '#4A4A4A',
          boxWidth: 10
        }
      },
      tooltips: {
        callbacks: {
          title: function () {
            return false
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label
            var amount = tooltipItem.xLabel

            // var folded = fold(label, 20, true);
            return percentageTooltip(amount, label)
          }
        }
      },
      title: {
        display: false,
      },
      scales: {
        yAxes: stackedYAxes(prefix),
        xAxes: stackedXAxes(prefix)
      }
    }
  })
}

export var makeBlockChart = function (prefix, city, title = '', unit = '', multiply = false) {
  var ctx = document.getElementById(prefix)
  var field = prefix.replace('_bar', '')

  var data = {
    labels: ['Informal', 'Formal'],
    datasets: [
      {
        label: 'Pre 1990',
        backgroundColor: 'rgba(229,223,227,1.0)',
        borderWidth: 0,
        data: [city.DataSet[field + '_informal_plot_pre_1990'], city.Region.DataSet[field + '_formal_plot_pre_1990']]
      },
      {
        label: '1990-2015',
        backgroundColor: 'rgba(176,171,174,1.0)',
        borderWidth: 0,
        data: [city.DataSet[field + '_informal_plot_1990_2015'], city.Region.DataSet[field + '_formal_plot_1990_2015']]
      }
    ]
  }
  var yAxes = [{
    ticks: {
      beginAtZero: true,
      callback: function (value, index, values) {
        return commas(value)
        // return (Math.floor(value * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }]
  var xAxes = [{
    ticks: {
      beginAtZero: true
    },
    gridLines: {
      display: false
    }
  }]
  return new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      legend: {
        labels: {
          fontColor: '#929292',
          boxWidth: 10
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label
            return bigTooltip(tooltipItem.yLabel, label, unit)
          }
        }
      },
      title: {
        display: false
      },
      scales: {
        yAxes: yAxes,
        xAxes: xAxes
      }
    }
  })
}
// TODO: This is horrible and needs to be changed.
export let returnRoadChartData = function (prefix, city, laterYear = true) {
  var field = prefix.replace('_bar', '')
  if (prefix === 'arterial_roads_walking_bar') {
    var data1990 = {
      labels: charts(city).arterial_roads_distance.labels,
      datasets: []
    }
    var data2015 = {
      labels: charts(city).arterial_roads_distance.labels,
      datasets: []
    }

    charts(city).arterial_roads_distance.datasets.forEach(function (dataset) {
      var data = {
        backgroundColor: dataset.backgroundColor,
        borderWidth: 0,
        label: dataset.label,
        data: [city.DataSet[field + dataset.suffix + 'pre_1990'], city.Region.DataSet[field + dataset.suffix + 'pre_1990'], city.World.DataSet[field + dataset.suffix + 'pre_1990']]
      }
      data1990.datasets.push(JSON.parse(JSON.stringify(data)))

      data.data = [city.DataSet[field + dataset.suffix + '1990_2015'], city.Region.DataSet[field + dataset.suffix + '1990_2015'], city.World.DataSet[field + dataset.suffix + '1990_2015']]
      data2015.datasets.push(JSON.parse(JSON.stringify(data)))
    })

    return laterYear ? data2015 : data1990
  } else {

    var data1990 = {
      labels: charts(city).arterial_roads.labels,
      datasets: []
    }
    var data2015 = {
      labels: charts(city).arterial_roads.labels,
      datasets: []
    }

    charts(city).arterial_roads.datasets.forEach(function (dataset) {
      var data = {
        backgroundColor: dataset.backgroundColor,
        borderWidth: 0,
        label: dataset.label,
        data: [city.DataSet[field + dataset.suffix + 'pre_1990'], city.Region.DataSet[field + dataset.suffix + 'pre_1990'], city.World.DataSet[field + dataset.suffix + 'pre_1990']]
      }
      data1990.datasets.push(JSON.parse(JSON.stringify(data)))

      data.data = [city.DataSet[field + dataset.suffix + '1990_2015'], city.Region.DataSet[field + dataset.suffix + '1990_2015'], city.World.DataSet[field + dataset.suffix + '1990_2015']]
      data2015.datasets.push(JSON.parse(JSON.stringify(data)))
    })
    return laterYear ? data2015 : data1990

  }
}

export let makeRoadChart = function (prefix, city, title = '', unit = '', multiply = false, laterYear = true) {
  var ctx = document.getElementById(prefix)

  return new Chart(ctx, {
    type: 'horizontalBar',
    data: returnRoadChartData(prefix, city, laterYear),
    options: {
      legend: {
        labels: {
          fontColor: '#929292',
          boxWidth: 10
        }
      },
      gridLines: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: function () {
            return false
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label
            var number = tooltipItem.xLabel
            if (unit === '%') {
              return percentageTooltip(number, label, multiply)
            } else {
              return bigTooltip(number, label, unit)
            }
          }
        }
      },
      title: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            // max : max,
            callback: function (value, index, values) {
              if (multiply) {
                value *= multiply
              }
              value = Math.floor(value * 100) / 100
              if (unit && (unit === '%' || unit === 'm')) {
                value += unit
              }
              return value
            }
          }
        }]
      }
    }
  })
}

export let makeStacked = function (prefix, city, title, unit = '', multiply = false, vert = false) {
  var ctx = document.getElementById(prefix)

  var data = charts(city)[prefix]
  return new Chart(ctx, {
    type: vert ? 'bar' : 'horizontalBar',
    data: data,
    options: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#4A4A4A',
          boxWidth: 10
        }
      },
      tooltips: {
        callbacks: {
          title: function () {
            return false
          },
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label
            var number = vert ? tooltipItem.yLabel : tooltipItem.xLabel
            return percentageTooltip(number, label, multiply)
          }
        }
      },
      title: {
        display: false
      },
      scales: {
        yAxes: vert ? stackedXAxes(prefix, multiply) : stackedYAxes(prefix),
        xAxes: vert ? stackedYAxes(prefix) : stackedXAxes(prefix, multiply)
      }
    }
  })
}

export let makeChart = function (prefix, city, title, unit = '', multiply = false, side = false) {
  var ctx = document.getElementById(prefix)
  var field = prefix.replace('_bar', '')
  var suffix1 = side ? '_pre_1990' : '_t1_t2'
  var suffix2 = side ? '_1990_2015' : '_t2_t3'
  var data = {
    labels: [city.City.name, 'Países Menos Desarrollados', 'Mundo'],
    datasets: [{
      label: 'Pre 1990',
      backgroundColor: '#FE8B73',
      borderWidth: 0,
      data: [city.DataSet[field + suffix1], city.Region.DataSet[field + suffix1], city.World.DataSet[field + suffix1]]
    }, {
      label: '1990-2015',
      backgroundColor: '#A2A09D',
      borderWidth: 0,
      data: [city.DataSet[field + suffix2], city.Region.DataSet[field + suffix2], city.World.DataSet[field + suffix2]]
    }
    ]
  }

  var yAxes = [{
    ticks: {
      beginAtZero: true,
      callback: function (value, index, values) {
        if (side) {
          if (multiply) {
            value *= multiply
          }
          value = commas(value)
          if (unit === '%' || unit === 'm') {
            value += unit
          }
          return value
        } else {
          value = Math.floor(value * 100) / 100
          // value = newValue == 0 ? value: newValue
          return value + '%'
        }
      }
    }
  }]
  var xAxes = [{
    ticks: {
      beginAtZero: true,
      callback: function (value, index, values) {
        return fold(value, 15, true)
        // return value.split(' ')
      }
    },
    gridLines: {
      display: false
    }
  }]
  return new Chart(ctx, {
    type: side ? 'horizontalBar' : 'bar',
    data: data,
    options: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#929292',
          boxWidth: 10
        }
      },
      gridLines: {
        display: false
      },
      tooltips: {
        callbacks: {
          title: function () {
            return false
          },
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label
            if (side) {
              let number = tooltipItem.xLabel
              if (unit === '%') {
                return percentageTooltip(number, label, multiply)
              }
              return bigTooltip(number, label, unit)
            } else {
              let number = tooltipItem.yLabel
              return percentageTooltip(number, label, multiply)
            }
          }
        }
      },
      title: {
        display: false
      },
      scales: {
        yAxes: side ? xAxes : yAxes,
        xAxes: side ? yAxes : xAxes
      }
    }
  })
}

export let makeLine = function (prefix, city, title, unit = '') {
  var ctx = document.getElementById(prefix)
  var field = prefix.replace('_line', '')
  var data = {
    labels: [city.City.t1, city.City.t2, city.City.t2b, city.City.t3],
    datasets: [{
      pointRadius: 5,
      borderJoinStyle: 'miter',
      lineTension: 0,
      borderWidth: 1,
      borderColor: '#7b7b7b',
      pointBorderColor: '#7b7b7b',
      pointBorderWidth: 1,
      fill: false,
      label: title,
      data: [city.DataSet[field + '_t1'], city.DataSet[field + '_t2'], city.DataSet[field + '_t2b'], city.DataSet[field + '_t3']]
    }]
  }
  var max = Math.max.apply(Math, data.datasets[0].data)
  var min = Math.min.apply(Math, data.datasets[0].data.filter(Boolean))
  var log = Math.floor(Math.log(max) / Math.log(10))
  log = Math.pow(10, log)
  var yMax = Math.ceil((max + min) / log) * log

  return new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      maintainAspectRatio: true,
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = tooltipItem.xLabel.substr(0, 4)// + ' ' + data.datasets[tooltipItem.datasetIndex].label
            var number = tooltipItem.yLabel
            var tool = bigTooltip(number, label, unit)
            return tool
          }
        }
      },
      title: {
        display: false
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: yMax,
            callback: function (value, index, values) {
              return commas(value)
            }
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY'
            },
            min: new Date('1982-01-01'),
            max: new Date('2020-01-01'),
            unitStepSize: 5
          }
        }]
      }
    }
  })
}

var stackedXAxes = function (id, multiply) {
  return [{
    // stacked: id == 'blocks_and_plots_composition_special_stacked' ? true: true,
    stacked: true,
    ticks: {
      beginAtZero: true,
      max: 100,
      callback: function (value, index, values) {
        if (multiply) {
          value *= multiply
        }
        return value + '%'
      }
    },
    gridLines: {
      display: false
    }
  }]
}

var stackedYAxes = function (id) {
  return [{
    ticks: {
      beginAtZero: true
    },
    stacked: true,
    gridLines: {
      display: false
    },
    categoryPercentage: 0.6,
    barPercentage: 1
  }]
}

let percentageTooltip = function (amount, label, multiply) {
  return label + ': ' + percent(amount, (amount >= 1 ? 1 : 2), multiply)
}

let bigTooltip = function (amount, label, unit) {
  amount = commas(amount, (amount >= 1 ? 1 : 2))
  return label + ': ' + amount + unit
}

/*
* Recursively merge properties of two objects
*/
function MergeRecursive (obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor === Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p])
      } else {
        obj1[p] = obj2[p]
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p]
    }
  }
  return obj1
}

//
// Folds a string at a specified length, optionally attempting
// to insert newlines after whitespace characters.
//
// s          -  input string
// n          -  number of chars at which to separate lines
// useSpaces  -  if true, attempt to insert newlines at whitespace
// a          -  array used to build result
//
// Returns an array of strings that are no longer than n
// characters long.  If a is specified as an array, the lines
// found in s will be pushed onto the end of a.
//
// If s is huge and n is very small, this metho will have
// problems... StackOverflow.
//

let fold = function (s, n, useSpaces, a) {
  a = a || []
  if (s.length <= n) {
    a.push(s)
    return a
  }
  var line = s.substring(0, n)
  if (!useSpaces) { // insert newlines anywhere
    a.push(line)
    return fold(s.substring(n), n, useSpaces, a)
  } else { // attempt to insert newlines after whitespace
    var lastSpaceRgx = /\s(?!.*\s)/
    var idx = line.search(lastSpaceRgx)
    var nextIdx = n
    if (idx > 0) {
      line = line.substring(0, idx)
      nextIdx = idx
    }
    a.push(line)
    return fold(s.substring(nextIdx), n, useSpaces, a)
  }
}
export const drawForecasts = function(prefix, city) {
  var unit = 'Hectáreas'
  var ctx = document.getElementById(prefix)
  var field = prefix.replace('_line', '')

  if (prefix === 'urban_extent_forecast_line') {
    var d1 = [1155, 2254, 3376, 5176, 6610, 7287, 8558]
    var d2 = [
      {x: city.City.t3, y: 5176},
      {x: "2030-01-01", y: 7950},
      {x: "2040-01-01", y: 10102},
      {x: "2050-01-01", y: 13674}
    ]
    var d3 = [
      {x: city.City.t3, y: 5176},
      {x: "2030-01-01", y: 8152},
      {x: "2040-01-01", y: 10561},
      {x: "2050-01-01", y: 14573}
    ]
  } else {
    var d1 = [345.2, 894.3, 1394.10, 2002.90, 4230.00, 5101.00, 5991]
    var d2 = [
      {x: city.City.t3, y: 2002.90},
      {x: "2030-01-01", y: 5088.00},
      {x: "2040-01-01", y: 7072.00},
      {x: "2050-01-01", y: 9572.00}
    ]
    var d3 = [
      {x: city.City.t3, y: 2002.90},
      {x: "2030-01-01", y: 5217.00},
      {x: "2040-01-01", y: 7392.00},
      {x: "2050-01-01", y: 10201.00}
    ]

  }

  var data = {
      labels: [city.City.t1, city.City.t2, city.City.t2b, city.City.t3, "2030-01-01", "2040-01-01", "2050-01-01"],
      datasets: [
        {
          pointRadius: 5,
          borderJoinStyle: 'miter',
          lineTension: 0,
          borderWidth: 1,
          borderColor: 'blue',
          pointBorderColor: 'blue',
          pointBackgroundColor: 'blue',
          pointBorderWidth: 1,
          fill: false,
          label: 'Densidad constante',
          data: d1
        },
        {
          pointRadius: 5,
          borderJoinStyle: 'miter',
          lineTension: 0,
          borderWidth: 1,
          borderDash: [2, 2],
          borderColor: 'green',
          pointBorderColor: 'green',
          pointBackgroundColor: 'green',
          pointBorderWidth: 1,
          fill: false,
          label: 'Tendencia Ciudad',
          data: d2
        },
        {
          pointRadius: 5,
          borderJoinStyle: 'miter',
          lineTension: 0,
          borderWidth: 1,
          borderDash: [2, 2],
          borderColor: 'red',
          pointBorderColor: 'red',
          pointBackgroundColor: 'red',
          pointBorderWidth: 1,
          fill: false,
          label: 'Tendencia Mundo',
          data: d3
        }
      ]
    }
    var max = 11000
    var min = Math.min.apply(Math, data.datasets[0].data.filter(Boolean))
    var log = Math.floor(Math.log(max) / Math.log(10))
    log = Math.pow(10, log)
    var yMax = 15000

    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        maintainAspectRatio: true,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label
              var year = tooltipItem.xLabel.substr(0, 4)
              var number = tooltipItem.yLabel
              return year + ' ' + label + ': ' + number + ' ' + unit
            }
          }
        },
        title: {
          text: prefix === 'urban_extent_forecast_line' ? 'Proyecciones de área construida' : 'Proyecciones de la huella urbana'
        },
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: yMax,
              callback: function (value, index, values) {
                return commas(value)
              }
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'MMM YYYY'
              },
              min: new Date('1982-01-01'),
              max: new Date('2055-01-01'),
              unitStepSize: 5
            }
          }]
        }
      }
    })

}
