/**
 * 获取股票某一天的分时数据
 * @param {string} symbol - 股票代码，如 '600036'
 * @param {string} date - 日期，格式 '20240823'
 * @returns {Promise<Array>} 分时数据数组
 */
async function getStockDailyMinuteData(symbol, date) {
    const market = symbol.startsWith('6') ? '1' : '0';
    const url = 'https://push2his.eastmoney.com/api/qt/stock/trends2/get';
    
    const params = new URLSearchParams({
        secid: `${market}.${symbol}`,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        iscr: '0',
        ndays: '1',
        _: Date.now().toString()
    });

    try {
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        console.log(data)
        
        if (data.data && data.data.trends) {
            return data.data.trends.map(item => {
                const [datetime, price, avg, volume, amount, change, pctChange] = item.split(',');
                return {
                    datetime,  // 直接使用返回的完整日期时间
                    price: parseFloat(price),
                    avg: parseFloat(avg),
                    volume: parseInt(volume),
                    amount: parseInt(amount),
                    change: parseFloat(change),
                    pctChange: parseFloat(pctChange)
                };
            });
        }
        
        return [];
    } catch (error) {
        console.error('获取分时数据失败:', error);
        throw error;
    }
}

// 使用示例
getStockDailyMinuteData('600036', '20240823').then(data => {
    console.log('2024-08-23 分时数据:', data);
});