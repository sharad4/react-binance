
export const chartOptions = {
    //aspectRatio: 2,
    //maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Time',
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Price',
            },
        },
    },
};