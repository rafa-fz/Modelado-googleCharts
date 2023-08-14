// Attach event listener to radio buttons
// document.querySelectorAll('input[name="options"]').forEach((radioButton) => {
//     radioButton.addEventListener('change', () => {
//       const transactionType = radioButton.parentElement.id;
//       const chartData = prepareChartData(data, transactionType);
//       drawChart(chartData);
//     });
//   });

// Function to parse the CSV data into an array of objects
function parseCSVData(csvData) {
    return Papa.parse(csvData, {
        header: true
    }).data;
}

// Function to prepare the data for the chart
function prepareChartData(data, transactionType) {
    const transactionCounts = {};

    // Calculate the transaction counts for each hour of the day
    data.forEach(row => {
        if (transactionType === 'all' || row.transaction_status === transactionType) {
            const hour = row.hour;
            if (!transactionCounts[hour]) {
                transactionCounts[hour] = 1;
            } else {
                transactionCounts[hour]++;
            }
        }
    });

    const chartData = [
        ['Hour', 'Transaction Count']
    ];
    for (let hour = 0; hour < 24; hour++) {
        const count = transactionCounts[hour] || 0;
        chartData.push([hour, count]);
    }

    return chartData;
}


// Function to draw the chart
function drawChart(chartData) {
    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
        title: 'Line Chart | Transacciones realizadas por hora del día',
        titleTextStyle: {
            color: '#FFFFFF' // Text color for the chart title
        },
        legend: {
            position: 'none'
        },
        chartArea: {
            width: '80%',
            height: 'auto'
        },
        hAxis: {
            title: 'Hora',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            },
            gridlines: {
                color: '#888888' // Color for horizontal gridlines
            }
        },
        vAxis: {
            title: 'Numero de Transacciones',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            },
            gridlines: {
                color: '#888888' // Color for horizontal gridlines
            }
        },
        backgroundColor: '#3f4263', // Background color for the chart
        colors: ['#d346b1'], // Line color
        annotations: data.annotations, // Add annotations for peak points
    };

    const chart = new google.visualization.LineChart(document.getElementById('line_chart'));
    chart.draw(data, options);
}


// Function to prepare the data for the PieChart
function preparePieChartData(data) {
    const transactionCounts = {
        APROVADO: 0,
        RECHAZADO: 0
    };

    // Calculate the transaction counts for each transaction type
    data.forEach(row => {
        if (row.transaction_status === 'APPROVAL') {
            transactionCounts.APROVADO++;
        } else if (row.transaction_status === 'DECLINED') {
            transactionCounts.RECHAZADO++;
        }
    });

    const chartData = [
        ['Transaction Type', 'Transaction Count']
    ];
    for (const type in transactionCounts) {
        chartData.push([type, transactionCounts[type]]);
    }

    return {
        chartData
    };
}

// Function to draw the PieChart
function drawPieChart(data) {
    const dataTable = google.visualization.arrayToDataTable(data.chartData);

    const options = {
        title: 'Pie Chart | Aprovados vs Rechazados',
        titleTextStyle: {
            color: '#FFFFFF' // Text color for the chart title
        },
        legend: {
            textStyle: {
                color: '#FFFFFF' // Text color for the legend
            }
        },
        backgroundColor: '#3f4263', // Background color for the chart
        pieSliceTextStyle: {
            color: '#000' // Text color for the pie slices
        },
        pieSliceText: 'label',
        slices: {
            0: { color: '#00ffff' }, // Color for 'Aprovado' slice #00f2c3  00ffff  2bffc6
            1: { color: '#d346b1', offset: 0.5 }, // Color for 'Rechazado' slice
            // 1: { offset: 0.5 },
        },
        pieStartAngle: 100,
    };

    const chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
    chart.draw(dataTable, options);
}


// Function to prepare the data for a column chart
function prepareColumnChartData(data) {
    const transactionCounts = {};

    // Calculate the transaction counts for each hour of the day
    data.forEach(row => {
        const hour = row.hour;
        if (!transactionCounts[hour]) {
            transactionCounts[hour] = {
                APPROVAL: 0,
                DECLINED: 0
            };
        }
        if (row.transaction_status === 'APPROVAL') {
            transactionCounts[hour].APPROVAL++;
        } else if (row.transaction_status === 'DECLINED') {
            transactionCounts[hour].DECLINED++;
        }
    });

    const chartData = [
        ['Hour', 'Approved', 'Declined']
    ];
    for (let hour = 0; hour < 24; hour++) {
        const count = transactionCounts[hour] || {
            APPROVAL: 0,
            DECLINED: 0
        };
        chartData.push([hour, count.APPROVAL, count.DECLINED]);
    }

    return chartData;
}

// Function to draw the column chart
function drawColumnChart(chartData) {
    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
        title: 'Column Chart | Transacciones aprobadas vs rechazadas por hora del día',
        titleTextStyle: {
            color: '#FFFFFF' // Text color for the chart title
        },
        legend: {
            textStyle: {
                color: '#FFFFFF' // Text color for the legend
            }
        },
        chartArea: {
            width: '80%',
            height: 'auto'
        },
        hAxis: {
            title: 'Hora',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        vAxis: {
            title: 'Número de Transacciones',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        backgroundColor: '#3f4263', // Background color for the chart
        colors: ['#00ffff', '#d346b1'], // Line colors
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('column_chart'));
    chart.draw(data, options);
}


// Function to prepare the data for the BarChart
function prepareBarChartData(data) {
    const brandTransactionCounts = {};

    // Calculate the transaction counts for each brand and transaction status
    data.forEach(row => {
        const brand = row.brand;
        const transactionStatus = row.transaction_status;
        if (brand && transactionStatus) {
            const key = brand + '-' + transactionStatus;
            if (!brandTransactionCounts[brand]) {
                brandTransactionCounts[brand] = {
                    APPROVAL: transactionStatus === 'APPROVAL' ? 1 : 0,
                    DECLINED: transactionStatus === 'DECLINED' ? 1 : 0
                };
            } else {
                brandTransactionCounts[brand][transactionStatus]++;
            }
        }
    });

    const chartData = [['MARCA', 'APROVADO', 'RECHAZADO']];
    for (const brand in brandTransactionCounts) {
        const { APPROVAL, DECLINED } = brandTransactionCounts[brand];
        chartData.push([brand, APPROVAL, DECLINED]);
    }

    return { chartData };
}

// Function to draw the BarChart
function drawBarChart(data) {
    const dataTable = google.visualization.arrayToDataTable(data.chartData);

    const options = {
        title: 'Bar Chart | Estado de transacción por marca',
        titleTextStyle: {
            color: '#FFFFFF' // Text color for the chart title
        },
        legend: {
            position: 'top',
            textStyle: {
                color: '#FFFFFF' // Text color for the legend
            }
        },
        backgroundColor: '#3f4263', // Background color for the chart
        bars: 'horizontal', // Display the bars horizontally
        hAxis: {
            title: 'Número de transacciones',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        vAxis: {
            title: 'Marca',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        colors: ['#00ffff', '#d346b1'], // Bar colors for approvals and declines
    };

    const chart = new google.visualization.BarChart(document.getElementById('bar_chart'));
    chart.draw(dataTable, options);
}


// Function to prepare the data for the area chart
function prepareAreaChartData(data) {
    const transactionCounts = {
        'APPROVAL': new Array(24).fill(0),
        'DECLINED': new Array(24).fill(0)
    };

    data.forEach(row => {
        const hour = row.hour;
        const transactionStatus = row.transaction_status;
        if (transactionCounts[transactionStatus]) {
            transactionCounts[transactionStatus][hour]++;
        }
    });

    const chartData = [['Hora', 'Aprovado', 'Rechazado']];
    for (let hour = 0; hour < 24; hour++) {
        chartData.push([hour.toString(), transactionCounts['APPROVAL'][hour], transactionCounts['DECLINED'][hour]]);
    }

    return chartData;
}

// Function to draw the area chart
function drawAreaChart(chartData) {
    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
        title: 'Area Chart | Transacciones realizadas por hora del día',
        titleTextStyle: {
            color: '#FFFFFF' // Text color for the chart title
        },
        legend: {
            position: 'top',
            textStyle: {
                color: '#FFFFFF' // Text color for the legend
            }
        },
        chartArea: {
            width: '80%',
            height: 'auto'
        },
        hAxis: {
            title: 'Hora',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        vAxis: {
            title: 'Numero de Transacciones',
            textStyle: {
                color: '#FFFFFF' // Text color for the axis labels
            }
        },
        backgroundColor: '#3f4263', // Background color for the chart
        colors: ['#00ffff', '#d346b1'], // Line colors for approval and declined
        isStacked: true // Stacked area chart
    };

    const chart = new google.visualization.AreaChart(document.getElementById('area_chart'));
    chart.draw(data, options);
}




// Load the data from the CSV file
async function loadCSVData() {
    try {
        const response = await fetch(
            'DATA_NEW.csv');
        const csvData = await response.text();


        const data = parseCSVData(csvData);

        // Cargar LineChart
        const selectElement = document.getElementById('transactionType');
        selectElement.addEventListener('change', () => {
            const transactionType = selectElement.value;
            const chartData = prepareChartData(data, transactionType);
            drawChart(chartData);
        });
        // document.querySelectorAll('input[name="options"]').forEach((radioButton) => {
        //     radioButton.addEventListener('change', () => {
        //       const transactionType = radioButton.parentElement.id;
        //       const chartData = prepareChartData(data, transactionType);
        //       drawChart(chartData);
        //     });
        //   });

        // Cargar PieChart
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(() => {
            const transactionType = selectElement.value;
            const chartData = prepareChartData(data, transactionType);
            drawChart(chartData);
            drawPieChart(preparePieChartData(data));
        });

        // Cargar ColumnChart
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(() => {
            const chartData = prepareColumnChartData(data);
            drawColumnChart(chartData);
        });

        // cargar BarChart
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => {
            const chartData = prepareBarChartData(data);
            drawBarChart(chartData); // Call to draw the BarChart
        });

        // Cargar AreaChart
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => {
            const chartData = prepareAreaChartData(data);
            drawAreaChart(chartData);
        });


    } catch (error) {
        console.error('Error loading or parsing CSV file:', error);
    }
}

loadCSVData();
