(function() {
  // Gradient function
  function getGradient(ctx, status) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    switch (status) {
      case "In Favour":
        gradient.addColorStop(0, "#00ff99");
        gradient.addColorStop(0.5, "#00cc66");
        gradient.addColorStop(1, "#009933");
        break;
      case "Opposed":
        gradient.addColorStop(0, "#ff6666");
        gradient.addColorStop(0.5, "#cc0000");
        gradient.addColorStop(1, "#660000");
        break;
      case "Abstain":
        gradient.addColorStop(0, "#ffff99");
        gradient.addColorStop(0.5, "#ffcc33");
        gradient.addColorStop(1, "#996600");
        break;
      case "Can't Vote":
        gradient.addColorStop(0, "#999999");
        gradient.addColorStop(0.5, "#555555");
        gradient.addColorStop(1, "#000000");
        break;
      case "Waiting for Vote":
        gradient.addColorStop(0, "#33ccff");
        gradient.addColorStop(0.25, "#9966ff");
        gradient.addColorStop(0.5, "#ff66cc");
        gradient.addColorStop(0.75, "#ff9933");
        gradient.addColorStop(1, "#33cc33");
        break;
      default:
        gradient.addColorStop(0, "lightgray");
        gradient.addColorStop(1, "gray");
    }
    return gradient;
  }

  // Plugin to draw vote status **inside the bar vertically**
  const statusLabelPlugin = {
    id: 'statusLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((bar, i) => {
        const status = voteData[i].status;
        if (!status) return;

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Rotate text 90° and position it in the middle of the bar
        ctx.translate(bar.x, bar.y + bar.height / 2);
        ctx.rotate(-Math.PI / 2); // rotate 90° counterclockwise
        ctx.fillText(status, 0, 0);
        ctx.rotate(Math.PI / 2);  // reset rotation
        ctx.translate(-bar.x, -(bar.y + bar.height / 2));
      });

      ctx.restore();
    }
  };

  // Create chart
  const canvas = document.getElementById("voteChart");
  if (canvas && voteData) {
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: voteData.map(v => v.country),
        datasets: [{
          data: voteData.map(() => 1),
          backgroundColor: voteData.map(v => getGradient(ctx, v.status)),
          barPercentage: 0.55,
          categoryPercentage: 0.6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Country" },
            ticks: {
              autoSkip: false,
              maxRotation: 75,
              minRotation: 75,
              font: { size: 11 }
            }
          },
          y: { display: false, beginAtZero: true, max: 1 }
        }
      },
      plugins: [statusLabelPlugin]
    });
  }
})();
