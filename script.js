document.addEventListener('DOMContentLoaded', function() {
    // 获取元素 (添加了 currentCycleDisplay)
    const startBtn = document.getElementById('startBtn'); //这个可以删除
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const shrinkTimeInput = document.getElementById('shrinkTime');
    const relaxTimeInput = document.getElementById('relaxTime');
    const cyclesInput = document.getElementById('cycles');
    const timeLeftDisplay = document.getElementById('timeLeft');
    const currentStageDisplay = document.getElementById('currentStage');
    const completedIndicator = document.getElementById('completed-indicator');
    const timerCircle = document.getElementById('timer-circle');
    const dailySetsInput = document.getElementById('dailySets');
    const currentSetInput = document.getElementById('currentSet');
    const currentSetDisplay = document.getElementById('currentSetDisplay');
    const totalSetsDisplay = document.getElementById('totalSetsDisplay');
    const punchCardBtn = document.getElementById('punchCardBtn');
    const calendar = document.getElementById('calendar');
    const currentCycleDisplay = document.getElementById('currentCycleDisplay'); // 新增：当前循环次数

    // 初始状态
    let isRunning = false;
    let isPaused = false;
    let isShrinking = true;
    let shrinkTime = 3;
    let relaxTime = 5;
    let remainingCycles = 10;
    let timerInterval = null;
    let completedSetCount = 0;
    let currentSet = 1;
    let dailySets = 2;
    let currentCycle = 1; // 新增：当前循环次数
    let savedShrinkTime; // 用于保存暂停时的 shrinkTime
    let savedRelaxTime; // 用于保存暂停时的 relaxTime
    // 从 localStorage 加载设置 (添加了对 currentCycle 的处理)
    function loadSettings() {
        shrinkTime = parseInt(localStorage.getItem('shrinkTime')) || 3;
        relaxTime = parseInt(localStorage.getItem('relaxTime')) || 5;
        remainingCycles = parseInt(localStorage.getItem('cycles')) || 10;
        dailySets = parseInt(localStorage.getItem('dailySets')) || 2;
        currentSet = parseInt(localStorage.getItem('currentSet')) || 1;
        currentCycle = parseInt(localStorage.getItem('currentCycle')) || 1; // 加载

        shrinkTimeInput.value = shrinkTime;
        relaxTimeInput.value = relaxTime;
        cyclesInput.value = remainingCycles;
        dailySetsInput.value = dailySets;
        currentSetInput.value = currentSet;
        totalSetsDisplay.textContent = dailySets;
        currentSetDisplay.textContent = currentSet;
        currentCycleDisplay.textContent = currentCycle; // 显示
        updateStageDisplay(); //初始显示‘开始’
    }

    // 保存设置 (添加了对 currentCycle 的保存)
    function saveSettings() {
        localStorage.setItem('shrinkTime', shrinkTimeInput.value);
        localStorage.setItem('relaxTime', relaxTimeInput.value);
        localStorage.setItem('cycles', cyclesInput.value);
        localStorage.setItem('dailySets', dailySetsInput.value);
        localStorage.setItem('currentSet', currentSetInput.value);
        localStorage.setItem('currentCycle', currentCycle); // 保存
    }

    //重置时间
    function resetTime() {
        shrinkTime = parseInt(localStorage.getItem('shrinkTime')) || 3;
        relaxTime = parseInt(localStorage.getItem('relaxTime')) || 5;
    }

    // 更新阶段和时间显示 (关键修改：根据 isRunning 来判断显示“开始”还是阶段)
    function updateStageDisplay() {
        if (!isRunning) {
            currentStageDisplay.textContent = '开始';
            timeLeftDisplay.textContent = ''; // 初始不显示时间
        } else {
            currentStageDisplay.textContent = isShrinking ? '收缩' : '放松';
            timeLeftDisplay.textContent = isShrinking ? shrinkTime : relaxTime;
        }
        currentCycleDisplay.textContent = currentCycle; // 更新循环次数
    }


    // 开始/继续 计时
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            currentCycle = 1; //开始时重置
        }
        isPaused = false;
        pauseBtn.textContent = '暂停';
        resetBtn.disabled = false;

        // 读取或恢复时间 (关键修改)
        if (isShrinking) {
            shrinkTime = savedShrinkTime !== undefined ? savedShrinkTime : parseInt(shrinkTimeInput.value);
        } else {
            relaxTime = savedRelaxTime !== undefined ? savedRelaxTime : parseInt(relaxTimeInput.value);
        }

        remainingCycles = parseInt(cyclesInput.value);
        dailySets = parseInt(dailySetsInput.value);
        currentSet = parseInt(currentSetInput.value);
        saveSettings(); //保存所有选项
        updateStageDisplay();
        timerCircle.classList.toggle('shrinking', isShrinking);
        totalSetsDisplay.textContent = dailySets;
        currentSetDisplay.textContent = currentSet;


        if (timerInterval === null) {
            timerInterval = setInterval(() => {
                if (isShrinking) {
                    shrinkTime--;
                    timeLeftDisplay.textContent = shrinkTime;
                    if (shrinkTime < 0) {
                        isShrinking = false;
                        timerCircle.classList.remove('shrinking');
                         resetTime();
                        updateStageDisplay(); //状态改变了，更新显示
                    }
                } else {
                    relaxTime--;
                    timeLeftDisplay.textContent = relaxTime;
                    if (relaxTime < 0) {
                        isShrinking = true;
                        timerCircle.classList.add('shrinking');
                         resetTime();
                        remainingCycles--;
                        currentCycle++;       // 循环次数增加
                        currentCycleDisplay.textContent = currentCycle; //更新次数
                        updateStageDisplay(); //状态改变了，更新显示

                        if (remainingCycles <= 0) {
                            completedSetCount++;
                            completedIndicator.textContent = completedSetCount;
                            completedIndicator.classList.add('show');
                            setTimeout(() => {
                                completedIndicator.classList.remove('show');
                            }, 3000);

                            remainingCycles = parseInt(localStorage.getItem('cycles')) || 10;
                            currentSet++;
                            currentSetInput.value = currentSet;
                            currentSetDisplay.textContent = currentSet;
                            currentCycle = 1;      // 重置循环次数
                            currentCycleDisplay.textContent = currentCycle; //更新
                            if (currentSet > dailySets) {
                                alert("恭喜完成今日提肛运动!");
                                currentSet = 1;
                                currentSetInput.value = currentSet;
                            }
                            saveSettings();
                            stopTimer();
                            //这里不需要自动开始下一组
                        }
                    }
                }
            }, 1000);
        }
    }


    // 暂停计时 (关键修改：保存剩余时间)
    function pauseTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            pauseBtn.textContent = '继续';
            timerCircle.classList.remove('shrinking');

            // 保存当前的剩余时间
            if (isShrinking) {
                savedShrinkTime = shrinkTime;
            } else {
                savedRelaxTime = relaxTime;
            }
        }
    }


    // 停止计时 (和之前一样)
    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        resetBtn.disabled = false;
        timerCircle.classList.remove('shrinking');
    }

    // 重置 (添加了对 currentCycle 的重置)
    function handleReset() {
        if (confirm('重置选项？ 点击确认重置今日设置.')) {
            currentSet = 1;
            currentSetInput.value = currentSet;
            remainingCycles = parseInt(localStorage.getItem('cycles')) || 10;
            currentSetDisplay.textContent = currentSet;
            currentCycle = 1;          // 重置循环次数
            currentCycleDisplay.textContent = currentCycle; //更新显示
            resetTime(); //重置时间
            updateStageDisplay();
            saveSettings();
            stopTimer();
        }
    }

    // 生成日历 (和之前一样)
    function generateCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        let calendarHTML = '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
        let dayCounter = 1;

        calendarHTML += '<tr>';
        for (let i = 0; i < startDayOfWeek; i++) {
            calendarHTML += '<td></td>';
        }

        for (let i = startDayOfWeek; i < 7; i++) {
            let cellClass = '';
            if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cellClass = 'today';
            }
            calendarHTML += `<td class="${cellClass}">${dayCounter}</td>`;
            dayCounter++;
        }
        calendarHTML += '</tr>';

        while (dayCounter <= daysInMonth) {
            calendarHTML += '<tr>';
            for (let i = 0; i < 7; i++) {
                if (dayCounter <= daysInMonth) {
                    let cellClass = '';
                    if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cellClass = 'today';
                    }
                    calendarHTML += `<td class="${cellClass}">${dayCounter}</td>`;
                    dayCounter++;
                } else {
                    calendarHTML += '<td></td>';
                }
            }
            calendarHTML += '</tr>';
        }

        calendar.innerHTML = calendarHTML;
    }

    // 打卡 (添加了对 currentCycle 的重置)
    function handlePunchCard() {
        currentSet = 1;
        currentSetInput.value = currentSet;
        currentSetDisplay.textContent = currentSet;
        remainingCycles = parseInt(localStorage.getItem('cycles')) || 10;
        currentCycle = 1;          // 重置循环次数
        currentCycleDisplay.textContent = currentCycle; //更新显示
        resetTime();
        updateStageDisplay();
        saveSettings();
        stopTimer();
        alert("打卡成功!");
    }

    // 事件监听
pauseBtn.addEventListener('click', function() {
        if (isRunning) { // 只有在计时器已启动的情况下才响应
            if (isPaused) {
                startTimer(); // 继续计时
            } else {
                pauseTimer(); // 暂停计时
            }
        }
    });
    resetBtn.addEventListener('click', handleReset);
    punchCardBtn.addEventListener('click', handlePunchCard);
    timerCircle.addEventListener('click', startTimer); // 保持点击圆圈开始

    // 页面加载时初始化
    loadSettings();
    generateCalendar();
});
