let processCount = 0;
let processes = [];
let colors = {};

function addProcess() {
    processCount++;
    const table = document.getElementById('processTable');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>P${processCount}</td>
        <td><input type="number" min="0" id="arrival${processCount}" value="0"></td>
        <td><input type="number" min="1" id="burst${processCount}" value="10"></td>
    `;
    table.appendChild(row);

    colors[`P${processCount}`] = getRandomColor();
}

function visualize() {
    // xoa het du lieu cu
    processes = [];
    const chart = document.getElementById('chart');
    chart.innerHTML = '';
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>Process</th>
            <th>Completion Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
        </tr>
    `;

    // lay du lieu tu giao dien
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value);
    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({
            processId: `P${i}`,
            arrivalTime,
            burstTime,
            remainingTime: burstTime,
            completionTime: 0,
        });
    }
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);


    // xu ly thuat toan
    let time = 0; // thoi gian hien tai trong qua trinh mo phong
    let allDone = false; 

    while (!allDone) {
        allDone = true;
        processes.forEach((process) => {
            if (process.remainingTime > 0 && process.arrivalTime <= time) {
                allDone = false;
                const executeTime = Math.min(timeQuantum, process.remainingTime);

                process.remainingTime -= executeTime;
                time += executeTime;

                if (process.remainingTime === 0) {
                    process.completionTime = time;
                }

                const processBlock = document.createElement('div');
                processBlock.classList.add('process-block');
                processBlock.style.width = `${executeTime * 20}px`;
                processBlock.style.backgroundColor = colors[process.processId];
                processBlock.innerHTML = process.processId;

                const timeLabel = document.createElement('div');
                timeLabel.classList.add('process-time');
                timeLabel.innerHTML = `${time - executeTime} - ${time}`;
                processBlock.appendChild(timeLabel);

                chart.appendChild(processBlock);
            }
        });

        //kiem tra tg nhan roi
        if (processes.every(p => p.arrivalTime > time || p.remainingTime === 0)) {
            time++; // tao khoang tgian trong
        }
    }

    // tinh toan hien thi ket qua
    let totalWaitingTime = 0;
    processes.forEach((process) => {
        const turnaroundTime = process.completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        totalWaitingTime += waitingTime;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${process.processId}</td>
            <td>${process.completionTime}</td>
            <td>${turnaroundTime}</td>
            <td>${waitingTime}</td>
        `;
        resultTable.appendChild(row);
    });
    const avgWaitingTime = (totalWaitingTime / processes.length).toFixed(2); // Rounded to 2 decimals
    const avgRow = document.createElement('tr');
    avgRow.innerHTML = `
        <td colspan="3" style="font-weight: bold; text-align: right;">Average Waiting Time:</td>
        <td style="font-weight: bold;">${avgWaitingTime}</td>
    `;
    resultTable.appendChild(avgRow);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}




