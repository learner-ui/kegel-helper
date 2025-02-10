document.addEventListener('DOMContentLoaded', function() {
    const startCircle = document.getElementById('start-circle');
    //const timerDisplay = document.getElementById('timer-display'); //不再需要
    const contractTimeInput = document.getElementById('contract-time');
    const relaxTimeInput = document.getElementById('relax-time');
    const repetitionsInput = document.getElementById('repetitions');
    const dailySetsInput = document.getElementById('daily-sets');
    const currentSetsInput = document.getElementById('current-sets');
    const checkinButton = document.getElementById('checkin-button');
    const heatmap = document.getElementById('heatmap');
    const circleText = document.getElementById('circle-text'); // 获取圆圈内的文本元素

    let timer;
    let state = 'ready'; // 'ready', 'contract', 'relax', 'stopped'
    let currentRepetitions = 0;
    let currentSets = 1;

    // 从 localStorage 中读取数据
    let contractTime = parseInt(localStorage.getItem('contractTime')) || 3;
    let relaxTime = parseInt(localStorage.getItem('relaxTime')) || 5;
    let repetitions = parseInt(localStorage.getItem('repetitions')) || 10;
    let dailySets = parseInt(localStorage.getItem('dailySets')) || 2;

    // 初始化
    contractTimeInput.value = contractTime;
    relaxTimeInput.value = relaxTime;
    repetitionsInput.value = repetitions;
    dailySetsInput.value = dailySets;
    currentSetsInput.value = currentSets;

    // 更新 localStorage
    function updateLocalStorage() {
        localStorage.setItem('contractTime', contractTimeInput.value);
        localStorage.setItem('relaxTime', relaxTimeInput.value);
        localStorage.setItem('repetitions', repetitionsInput.value);
        localStorage.setItem('dailySets', dailySetsInput.value);
    }

    // 更新设置
    function updateSettings() {
        contractTime = parseInt(contractTimeInput.value);
        relaxTime = parseInt(relaxTimeInput.value);
        repetitions = parseInt(repetitionsInput.value);
        dailySets = parseInt(dailySetsInput.value);
        currentSets = parseInt(currentSetsInput.value);
        updateLocalStorage();
    }

    // 打卡
    checkinButton.addEventListener('click', function() {
        let today = new Date().toISOString().split('T')[0];
        let checkins = JSON.parse(localStorage.getItem('checkins') || '{}');
        checkins[today] = true;
        localStorage.setItem('checkins', JSON.stringify(checkins));
        renderHeatmap();
    });
    // 生成热力图
    function renderHeatmap() {
        heatmap.innerHTML = ''; // 清空现有内容

            // 添加星期标题
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            for (let weekday of weekdays) {
                let headerCell = document.createElement('div');
                headerCell.classList.add('heatmap-header');
                headerCell.textContent = weekday;
                heatmap.appendChild(headerCell);
            }

            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let firstDayOfMonth = new Date(year, month, 1);
            let lastDayOfMonth = new Date(year, month + 1, 0);
            let checkins = JSON.parse(localStorage.getItem('checkins') || '{}');

            // 获取当月第一天是星期几（0-6，0 表示星期日）
            let firstDayOfWeek = firstDayOfMonth.getDay();

            // 添加空白单元格，填充到第一天之前
            for (let i = 0; i < firstDayOfWeek; i++) {
                let emptyCell = document.createElement('div');
                emptyCell.classList.add('heatmap-cell'); // 添加相同的类名
                emptyCell.style.backgroundColor = 'transparent'; // 设置为透明
                emptyCell.style.border = 'none'; // 去掉边框
                heatmap.appendChild(emptyCell);
            }

                // 创建一个包含当月所有日期的数组
            let daysInMonth = [];
            for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
                daysInMonth.push(new Date(d));
            }

            // 为每个日期创建一个单元格
            daysInMonth.forEach(day => {
                let dateStr = day.toISOString().split('T')[0];
                let cell = document.createElement('div');
                cell.classList.add('heatmap-cell');

                // 检查是否是今天的日期
                if (day.toDateString() === today.toDateString()) {
                    cell.classList.add('today');
                }

                if (checkins[dateStr]) {
                    cell.classList.add('checked-in'); // 如果已打卡，添加 checked-in 类
                }
                heatmap.appendChild(cell);
            });
        }

        // 启动函数 (修改版)
        function startTimer(duration, nextState) {
            let timeLeft = duration;
            updateCircleText(nextState === 'contract' ? '收缩' : '放松', timeLeft); // 初始显示

            timer = setInterval(() => {
                timeLeft--;
                updateCircleText(nextState === 'contract' ? '收缩' : '放松', timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    if (nextState === 'contract') {
                        currentRepetitions++;
                        if (currentRepetitions < repetitions) {
                            startTimer(relaxTime, 'relax');
                            state = 'relax';
                            startCircle.style.backgroundColor = '#2196F3';  //放松蓝色
                        } else {
                            currentRepetitions = 0;
                            currentSets++;
                            currentSetsInput.value = currentSets;
                            if (currentSets > dailySets) {
                                updateCircleText('完成', '');
                                startCircle.style.backgroundColor = '#4CAF50'; //完成了绿色
                                state = 'ready';
                                currentSets = 1;
                                    currentSetsInput.value = currentSets;
                            } else {
                                    updateCircleText('继续', '');
                                state = 'stopped';
                                startCircle.style.backgroundColor = '#4CAF50'; //没完成继续也是绿色
                            }
                        }
                    } else if (nextState === 'relax') {
                        startTimer(contractTime, 'contract');
                        state = 'contract';
                        startCircle.style.backgroundColor = '#f44336'; //收缩红色
                    }
                }
            }, 1000);
        }

        // 更新圆圈内文本的函数 (修改版)
        function updateCircleText(text, time) {
            // 如果是 "ready" 或 "stopped" 状态，或者已经完成，只显示文本
            if (state === 'ready' || state === 'stopped' || currentSets > dailySets) {
                circleText.textContent = text;
            } else {
                // 其他情况下，显示文本、时间和次数
                circleText.textContent = `${text} ${time} (${currentRepetitions + 1}/${repetitions})`;
            }
        }

        // 点击事件
        startCircle.addEventListener('click', () => {
            updateSettings();
            if (state === 'ready' || state === 'stopped') {
                startTimer(contractTime, 'contract');
                state = 'contract';
                startCircle.style.backgroundColor = '#f44336'; //开始红色
            }
        });

    renderHeatmap();
});
