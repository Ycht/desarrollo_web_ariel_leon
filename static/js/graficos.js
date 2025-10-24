document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/estadisticas");
        const data = await response.json();

        // Gráfico de líneas con la cantidad de avisos por día ===
        Highcharts.chart('graficoPorDia', {
            chart: { type: 'line', backgroundColor: '#ffffff' },
            title: { text: 'Avisos de adopción por día' },
            xAxis: { categories: data.por_dia.fechas, title: { text: 'Día' } },
            yAxis: { title: { text: 'Cantidad de avisos' }, allowDecimals: false },
            series: [{
                name: 'Avisos',
                data: data.por_dia.cantidades,
                color: '#329ea8'
            }],
            tooltip: { shared: true, valueSuffix: ' avisos' },
            credits: { enabled: false }
        });

        // Gráfico de torta con el total de avisos por tipo de mascota.
        const tipos = Object.keys(data.por_tipo);
        const valores = Object.values(data.por_tipo);

        Highcharts.chart('graficoPorTipo', {
            chart: { type: 'pie', backgroundColor: '#ffffff' },
            title: { text: 'Avisos por tipo de mascota' },
            tooltip: { pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)' },
            accessibility: { point: { valueSuffix: '%' } },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} avisos'
                    }
                }
            },
            series: [{
                name: 'Avisos',
                colorByPoint: true,
                data: tipos.map((t, i) => {
                    let color;
                    if (t.toLowerCase() === 'perro') color = '#ff9f40';
                    else if (t.toLowerCase() === 'gato') color = '#329ea8';
                    else color = Highcharts.getOptions().colors[i];

                    return {
                        name: t.charAt(0).toUpperCase() + t.slice(1),
                        y: valores[i],
                        color: color
                    };
                })
            }],
            credits: { enabled: false }
        });

        // Gráfico de barras con los avisos por mes y tipo
        Highcharts.chart('graficoPorMesYTipo', {
            chart: { type: 'column', backgroundColor: '#ffffff' },
            title: { text: 'Avisos por mes y tipo de mascota' },
            xAxis: { categories: data.por_mes_y_tipo.meses, title: { text: 'Mes' } },
            yAxis: { min: 0, title: { text: 'Cantidad de avisos' } },
            tooltip: {
                shared: true,
                valueSuffix: ' avisos'
            },
            plotOptions: { column: { borderRadius: 3, pointPadding: 0.1, groupPadding: 0.15 } },
            series: [
                { name: 'Gatos', data: data.por_mes_y_tipo.gatos, color: '#329ea8' },
                { name: 'Perros', data: data.por_mes_y_tipo.perros, color: '#ff9f40' }
            ],
            credits: { enabled: false }
        });

    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
});