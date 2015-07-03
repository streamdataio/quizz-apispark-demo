'use strict';

(function () {
  function createChart(config, data) {
    var margin = config.margin;
    var w = config.barWidth * data.length - margin.left - margin.right;
    var h = config.height - margin.top - margin.bottom;
    var padding = config.padding;

    var yScale = computeYScale(data, h, config.heightGrowthMargin);

    var svg =
      d3.select(config.selector)
        .append('svg')
        .attr({width: w + margin.left + margin.right, height: h + margin.top + margin.bottom, id: config.svgId})
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.ordinal()
      .domain(data.map(function (d) {
        return d.label
      }))
      .rangeRoundBands([-margin.left, w], .1);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, ' + h + ')')
      .call(xAxis)
      .selectAll(".tick text")
      .call(wrap, xScale.rangeBand());

    var chart = svg.append('g');
    chart.attr('id', 'chart');

    chart.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr({
        x: function (d, i) {
          return i * (w / data.length)
        },
        width: w / data.length - padding,
        y: function () {
          return h;
        },
        height: function () {
          return 0;
        },
        fill: function (d) {
          return d.color;
        }
      })
      .transition()
      .attr({
        y: function (d) {
          return yScale(d.total);
        },
        height: function (d) {
          return h - yScale(d.total);
        }
      })
      .duration(1000);

    chart.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(function (d) {
        return (d.total > 0 ? d.total : '');
      })
      .attr({
        'text-anchor': 'middle',
        'font-weight': 'bold',
        x: function (d, i) {
          return i * (w / data.length) + (w / data.length - padding) / 2;
        },
        y: function () {
          return h - 5;
        }
      });
  }

  function updateChart(config, data) {
    var margin = config.margin;
    var h = config.height - margin.top - margin.bottom;
    var yScale = computeYScale(data, h, config.heightGrowthMargin);

    var chart = d3.select('#' + config.svgId).select('#chart');
    chart.selectAll('rect')
      .data(data)
      .transition()
      .duration(2000)
      .ease("linear")
      .attr({
        y: function (d) {
          return yScale(d.total);
        },
        height: function (d) {
          return h - yScale(d.total);
        }
      });

    chart.selectAll('text')
      .data(data)
      .transition()
      .text(function (d) {
        if (d.total > 0) {
          return d.total;
        } else {
          return '';
        }
      });
  }

  function barsChart($window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=',
        id: '=',
        title: '='
      },
      link: function (scope, element, attrs) {
        $window.onresize = function () {
          scope.$apply();
        };

        var config = {
          selector: element[0],
          title: angular.isDefined(scope.title) ? scope.title : attrs['title'],
          svgId: angular.isDefined(attrs['id']) ? 'svg-' + scope.id : 'svg-' + Math.floor((Math.random() * 100) + 1),
          margin: angular.isDefined(attrs['margin']) ? scope.$eval(attrs['margin']) : {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
          },
          barWidth: parseInt(attrs['barWidth']),
          height: parseInt(attrs['height']),
          padding: parseInt(attrs['barPadding']),
          heightGrowthMargin: parseInt(attrs['heightGrowthMargin'])
        };

        var isChartNotCreated = true;

        scope.$watch('data', function (newData) {
          if (angular.isDefined(newData)) {
            if (isChartNotCreated) {
              createChart(config, newData);
              isChartNotCreated = false;

            } else {
              updateChart(config, newData);

            }
          }
        }, true);

      }
    };
  };

  function computeYScale(data, height, heightGrowthMargin) {
    return d3.scale.linear()
      .domain([0, d3.max(data, function (d) {
        return d.total;
      }) + heightGrowthMargin])
      .range([height, 0]);
  }

  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  angular
    .module('QuizzApp')
    .directive('barsChart', ['$window', barsChart]);

})();