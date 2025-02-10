body
{
    font - family : Arial, sans - serif;
display:
    flex;
    flex - direction : column; /* 改为列布局 */
    align - items : center;
    justify - content : flex - start; /* 让内容从顶部开始 */
    min - height : 100vh;
    background - color : #f0f0f0;
    padding - top : 20px; /* 添加顶部内边距 */
margin:
    0;
}

.container
{
    text - align : center;
}

.title - circle - container
{
display:
    flex;
    flex - direction : column; /* 设置内部元素垂直排列 */
gap:
    1.5rem;
}

.circle
{
width:
    150px;
height:
    150px;
    border - radius : 50 % ;
    background - color : #4CAF50;
display:
    flex;
    align - items : center;
    justify - content : center;
cursor:
    pointer;
    margin - bottom : 20px; /* 添加下边距 */
transition:
    background - color 0.3s ease; /* 使背景颜色变化更平滑 */
}

.circle : hover
{
transform:
    scale(1.05);                                 /*鼠标悬停放大效果*/
    box - shadow : 0 4px 8px rgba(0, 0, 0, 0.2); /*鼠标悬停时添加阴影*/
}

#circle - text {
color : white;
font - size : 20px;
}

.settings
{
display:
    flex;
    flex - direction : column;
gap:
    10px;
    margin - bottom : 20px;
width:
    80 % ; /* 或者一个固定的最大宽度，例如 max-width: 300px; */
    margin - left : auto;
    margin - right : auto;
}

.settings > div
{
display:
    flex;
    justify - content : space - between; /* 两端对齐 */
    align - items : center;              /* 垂直居中 */
    margin - bottom : 5px;               /* 设置下方间距 */
padding:
    0 10px;
}

.settings label
{
    margin - right : 10px;
width:
    40 % ;
}

.settings input[type = "number"]
{
width:
    50px;
padding:
    5px;
border:
    1px solid #ddd;
    border - radius : 4px;
}

.checkin - button
{
    background - color : #007bff;
color:
    white;
padding:
    10px 20px;
border:
    none;
    border - radius : 5px;
cursor:
    pointer;
    font - size : 16px;
transition:
    background - color 0.3s ease;
}
.checkin - button : hover{
    background - color : #0056b3; /*鼠标悬停改变颜色*/
}

#heatmap - container {
margin - top : 20px; /* 添加上边距 */
overflow - x : auto; /* 允许水平滚动 */
}

#heatmap {
display : grid;
grid - template - columns : repeat(7, 20px); /* 7 列，每列 20px */
grid - template - rows : auto;               /* 行高自动 */
gap : 4px;                                   /* 单元格间距 */
padding : 10px;
border : 1px solid #ddd;
background - color : white;
border - radius : 8px;                       /* 圆角 */
box - shadow : 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.heatmap - header
{
    text - align : center;
    font - size : 0.8em; /* 稍微缩小字体 */
color:
# 888;                      /* 浅灰色 */
    padding - bottom : 2px; /* 稍微增加下边距 */
}

.heatmap - cell
{
width:
    20px;
height:
    20px;
    background - color : #eee;
border:
    1px solid #ddd;
}

.heatmap - cell.today
{
    background - color : #fff5e6; /* 使用浅橙色表示今天 */
}

.heatmap - cell.checked - in
{
    background - color : #4CAF50;
}
