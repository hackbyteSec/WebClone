document.addEventListener('DOMContentLoaded', function() {
    var numberOfFiles = 0;
    var numberOfPages = 0;
    var downloadFile = '';
    var logLines = [];
    
    var socket = io();
    var myToken = generateToken(20);
    
    var websiteInput = document.getElementById('website');
    var downloadBtn = document.getElementById('download');
    var alertMessage = document.getElementById('alertMessage');
    var progressArea = document.getElementById('progressArea');
    var logConsole = document.getElementById('log');
    var logContent = document.getElementById('logContent');
    var statsGrid = document.getElementById('statsGrid');
    var nFilesSpan = document.getElementById('nFiles');
    var nPagesSpan = document.getElementById('nPages');
    var progressText = document.getElementById('progressText');
    var zipDownloadBtn = document.getElementById('downloadBtn');
    var spinner = document.getElementById('spinner');
    
    function addLog(message, type) {
        var code = document.createElement('code');
        code.textContent = message;
        if (type) code.className = type;
        logLines.push(code.outerHTML);
        if (logLines.length > 50) logLines = logLines.slice(-50);
        logContent.innerHTML = logLines.join('');
        logConsole.scrollTop = logConsole.scrollHeight;
    }
    
    socket.on(myToken, function(event) {
        if (event.progress === 'Converting') {
            progressText.textContent = '压缩中...';
            addLog('正在压缩文件...', 'info');
        } else if (event.progress === 'Completed') {
            spinner.style.display = 'none';
            progressText.textContent = '完成';
            downloadFile = event.file;
            addLog('下载完成!', 'success');
            zipDownloadBtn.style.display = 'inline-block';
        } else if (event.progress.indexOf('Error') !== -1 || event.progress.indexOf('错误') !== -1) {
            addLog(event.progress, 'error');
        } else {
            progressArea.style.display = 'block';
            logConsole.style.display = 'block';
            statsGrid.style.display = 'flex';
            
            if (event.progress.indexOf('[页面]') !== -1) {
                numberOfPages++;
                nPagesSpan.textContent = numberOfPages;
            }
            
            if (event.progress.indexOf('资源下载完成') !== -1) {
                var match = event.progress.match(/(\d+)/);
                if (match) numberOfFiles += parseInt(match[1]) || 0;
                nFilesSpan.textContent = numberOfFiles;
            }
            
            var type = '';
            if (event.progress.indexOf('完成') !== -1) type = 'success';
            else if (event.progress.indexOf('[页面]') !== -1) type = 'info';
            addLog(event.progress, type);
        }
    });
    
    function validateUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    }
    
    websiteInput.addEventListener('input', function() {
        downloadBtn.disabled = !validateUrl(this.value);
        alertMessage.style.display = (this.value && !validateUrl(this.value)) ? 'block' : 'none';
    });
    
    downloadBtn.addEventListener('click', function() {
        if (!validateUrl(websiteInput.value)) return;
        numberOfFiles = 0;
        numberOfPages = 0;
        logLines = [];
        nFilesSpan.textContent = '0';
        nPagesSpan.textContent = '0';
        zipDownloadBtn.style.display = 'none';
        progressArea.style.display = 'block';
        logConsole.style.display = 'block';
        statsGrid.style.display = 'flex';
        logContent.innerHTML = '';
        spinner.style.display = 'block';
        progressText.textContent = '连接中...';
        addLog('正在连接服务器...', 'info');
        socket.emit('request', { token: myToken, website: websiteInput.value.substring(0, 500) });
    });
    
    zipDownloadBtn.addEventListener('click', function() {
        // 安全: 防止文件名注入
        if (downloadFile && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(downloadFile)) {
            window.location = '/sites/' + encodeURIComponent(downloadFile) + '.zip';
        }
    });
    
    function generateToken(n) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for (var i = 0; i < n; i++) token += chars[Math.floor(Math.random() * chars.length)];
        return token;
    }
    
    // Update time
    function updateTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        var timeStr = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
        document.getElementById('statusTime').textContent = timeStr;
    }
    updateTime();
    setInterval(updateTime, 1000);
    
    // Get IP
    fetch('https://api.ipify.org?format=json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            document.getElementById('statusIp').textContent = data.ip;
        })
        .catch(function() {
            document.getElementById('statusIp').textContent = '127.0.0.1';
        });
});
